import localforage from 'localforage'
import { WebManagementService } from './web-management.service'
import { navStore } from 'src/store/nav.store'
import { $t } from 'src/locale'
import { INavProps, IWebProps } from 'src/types'

/** 直建服务实例并注入 mock 通知/弹窗服务（仿 providers.spec.ts 模式，不走 TestBed） */
function buildService() {
  const message = jasmine.createSpyObj('NzMessageService', ['success', 'error'])
  const notification = jasmine.createSpyObj('NzNotificationService', ['error'])
  const modal = jasmine.createSpyObj('NzModalService', ['info'])
  const service = new WebManagementService(
    message as any,
    notification as any,
    modal as any
  )
  return { service, message, notification, modal }
}

function buildNavList(): INavProps[] {
  const web = {
    id: 'w1',
    name: 'GitHub 加速',
    desc: '加速下载',
    url: 'https://ghproxy.com',
    icon: '',
    createdAt: '',
    breadcrumb: [],
    tags: [],
  }
  return [
    {
      title: '一级A',
      nav: [
        {
          title: '二级A1',
          nav: [{ title: '三级A11', nav: [web] }],
        },
      ],
    },
  ] as unknown as INavProps[]
}

/** 从 modal.info 调用参数中取出确认回调 */
function captureNzOnOk(modal: any): () => Promise<any> {
  expect(modal.info).toHaveBeenCalled()
  return modal.info.calls.mostRecent().args[0].nzOnOk
}

describe('WebManagementService', () => {
  let snapshot: string

  beforeEach(() => {
    snapshot = JSON.stringify(navStore.websiteList())
  })

  afterEach(() => {
    navStore.setWebsiteList(JSON.parse(snapshot))
  })

  it('deleteWeb 删除成功：提示删除成功且条目从列表移除', () => {
    // spy 避免与其他 spec 共享 localforage 产生异步竞争
    spyOn(localforage, 'setItem').and.resolveTo(null as any)
    const { service, message } = buildService()
    navStore.setWebsiteList(buildNavList())

    const ok = service.deleteWeb({ id: 'w1' } as IWebProps)

    expect(ok).toBe(true)
    expect(message.success).toHaveBeenCalledWith($t('_delSuccess'))
    expect(JSON.stringify(navStore.websiteList())).not.toContain('w1')
  })

  it('confirmAndSync 同步成功：成功提示且 loading 复位', async () => {
    const { service, message, modal } = buildService()
    const loadingStates: boolean[] = []
    service.confirmAndSync((loading) => loadingStates.push(loading))
    const nzOnOk = captureNzOnOk(modal)
    const syncSpy = spyOn(service, 'syncToRemote').and.resolveTo({})

    await expectAsync(nzOnOk()).toBeResolved()

    expect(syncSpy).toHaveBeenCalled()
    expect(message.success).toHaveBeenCalledWith($t('_syncSuccessTip'))
    expect(loadingStates).toEqual([true, false])
  })

  it('confirmAndSync 同步失败：错误提示与同步动作关联且无未处理 promise 拒绝', async () => {
    const { service, message, notification, modal } = buildService()
    const loadingStates: boolean[] = []
    service.confirmAndSync((loading) => loadingStates.push(loading))
    const nzOnOk = captureNzOnOk(modal)
    spyOn(service, 'syncToRemote').and.rejectWith(new Error('network down'))

    // 链上带显式 catch：Promise 正常 resolve，无未处理拒绝
    await expectAsync(nzOnOk()).toBeResolved()

    expect(notification.error).toHaveBeenCalled()
    const [title, content] = notification.error.calls.mostRecent().args
    // 标题与同步动作关联，内容含失败提示与重试指引及原始错误信息
    expect(title).toBe($t('_syncData'))
    expect(content).toContain($t('_syncFailTip'))
    expect(content).toContain('network down')
    expect(message.success).not.toHaveBeenCalled()
    expect(loadingStates).toEqual([true, false])
  })
})
