// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component, Output, EventEmitter, effect } from '@angular/core'
import { queryString, getTextContent } from 'src/utils'
import { setWebsiteList, updateByWeb } from 'src/services/web-tree'
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms'
import { IWebProps, IWebTag, TopType } from 'src/types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { dataProvider } from 'src/providers'
import { $t } from 'src/locale'
import { navStore } from 'src/store/nav.store'
import { dialogService } from 'src/services/dialog'
import { isLogin } from 'src/utils/user'
import { ISettings, ITagPropValues } from 'src/types'
import { NzModalComponent, NzModalContentDirective } from 'ng-zorro-antd/modal';

import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective, NzAutosizeDirective } from 'ng-zorro-antd/input';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { NzCheckboxGroupComponent } from 'ng-zorro-antd/checkbox';
import { NzRateComponent } from 'ng-zorro-antd/rate';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { LogoComponent } from '../logo/logo.component';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { UploadComponent } from '../upload/index.component';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'app-create-web',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
    NzModalComponent,
    NzModalContentDirective,
    ReactiveFormsModule,
    NzFormDirective,
    NzRowDirective,
    NzFormItemComponent,
    NzColDirective,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzSwitchComponent,
    NzCheckboxGroupComponent,
    NzRateComponent,
    NzInputGroupComponent,
    ɵNzTransitionPatchDirective,
    NzInputGroupWhitSuffixOrPrefixDirective,
    LogoComponent,
    NzIconDirective,
    UploadComponent,
    NzAutosizeDirective,
    NzSelectComponent,
    NzOptionComponent,
    NzButtonComponent,
    NzWaveDirective
],
})
export class CreateWebComponent {
  @Output() onOk = new EventEmitter()

  $t = $t
  isLogin: boolean = isLogin
  validateForm!: FormGroup
  uploading = false
  getting = false
  showModal = false
  detail: any = null
  isMove = false // 提交完是否可以移动
  oneIndex: number | undefined
  twoIndex: number | undefined
  threeIndex: number | undefined
  callback: Function = () => {}
  topOptions = [
    { label: TopType[1], value: TopType.Side, checked: false },
    { label: TopType[2], value: TopType.Shortcut, checked: false },
  ]

  get tagList(): ITagPropValues[] {
    return navStore.tagList()
  }

  get settings(): ISettings {
    return navStore.settings()
  }

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    effect(() => {
      const payload = dialogService.createWebPayload()
      if (payload !== null && isLogin) {
        this.open(this, payload)
      }
    })
    effect(() => {
      const props = dialogService.setCreateWebPayload()
      if (props !== null) {
        for (const k in props) {
          // @ts-ignore
          this[k] = props[k]
        }
      }
    })

    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      url: ['', [Validators.required]],
      top: [false],
      topOptions: [this.topOptions],
      ownVisible: [false],
      rate: [5],
      icon: [''],
      desc: [''],
      index: [''],
      urlArr: this.fb.array([]),
    })
  }

  get urlArray(): FormArray {
    return this.validateForm.get('urlArr') as FormArray
  }

  get isTop(): boolean {
    return this.validateForm.get('top')?.value || false
  }

  open(
    ctx: this,
    props:
      | {
          isMove?: boolean
          detail: IWebProps | null
          oneIndex: number | undefined
          twoIndex: number | undefined
          threeIndex: number | undefined
        }
      | Record<string, any> = {}
  ) {
    const detail = props.detail
    ctx.detail = detail
    ctx.showModal = true
    ctx.oneIndex = props.oneIndex
    ctx.twoIndex = props.twoIndex
    ctx.threeIndex = props.threeIndex
    ctx.isMove = !!props.isMove
    this.validateForm.get('title')!.setValue(getTextContent(detail?.name))
    this.validateForm.get('desc')!.setValue(getTextContent(detail?.desc))
    this.validateForm.get('index')!.setValue(detail?.index ?? '')
    this.validateForm.get('icon')!.setValue(detail?.icon || '')
    this.validateForm.get('url')!.setValue(detail?.url || '')
    this.validateForm.get('top')!.setValue(detail?.top ?? false)
    this.validateForm.get('ownVisible')!.setValue(detail?.ownVisible ?? false)
    this.validateForm.get('rate')!.setValue(detail?.rate ?? 5)
    if (detail) {
      if (Array.isArray(detail.tags)) {
        const tagMap = navStore.tagMap()
        detail.tags.forEach((item: IWebTag) => {
          ;(this.validateForm?.get('urlArr') as FormArray).push?.(
            this.fb.group({
              id: Number(item.id),
              name: tagMap[item.id].name ?? '',
              url: item.url || '',
            })
          )
        })
      }
    }
    const topOptions = this.topOptions.map((item) => {
      item.checked = false
      type V = typeof item.value
      if (detail?.topTypes) {
        const checked = detail.topTypes.some((value: V) => value === item.value)
        item.checked = checked
      }
      return item
    })

    this.validateForm.get('topOptions')!.setValue(topOptions)
  }

  get iconUrl() {
    return this.validateForm.get('icon')?.value || ''
  }

  onClose() {
    // @ts-ignore
    this.validateForm.get('urlArr').controls = []
    this.validateForm.reset()
    this.showModal = false
    this.detail = null
    this.oneIndex = undefined
    this.twoIndex = undefined
    this.threeIndex = undefined
    this.uploading = false
    this.isMove = false
    this.callback = Function
  }

  async onUrlBlur(e: any) {
    if (!this.settings.openSearch) {
      return
    }

    let url = e.target?.value
    if (!url) {
      return
    }
    try {
      // test url
      if (url[0] === '!') {
        url = url.slice(1)
      }
      new URL(url)

      const iconVal = this.validateForm.get('icon')?.value
      const titleVal = this.validateForm.get('title')?.value
      const descVal = this.validateForm.get('desc')?.value
      if (iconVal && titleVal && descVal) {
        return
      }

      this.getting = true
      const res = await dataProvider.getWebInfo(url)
      if (res['url'] != null && !iconVal) {
        this.validateForm.get('icon')!.setValue(res['url'])
      }
      if (res['title'] != null && !titleVal) {
        this.validateForm.get('title')!.setValue(res['title'])
      }
      if (res['description'] != null && !descVal) {
        this.validateForm.get('desc')!.setValue(res['description'])
      }
      this.getting = false
    } catch (error) {}
  }

  addMoreUrl() {
    ;(this.validateForm.get('urlArr') as FormArray).push(
      this.fb.group({
        id: '',
        name: '',
        url: '',
      })
    )
  }

  lessMoreUrl(idx: number) {
    ;(this.validateForm.get('urlArr') as FormArray).removeAt(idx)
  }

  onChangeFile(data: any) {
    this.validateForm.get('icon')!.setValue(data.cdn)
  }

  async handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    const createdAt = Date.now()
    const tags: IWebTag[] = []
    let { title, icon, url, top, ownVisible, rate, desc, index, topOptions } =
      this.validateForm.value

    if (!title || !url) return

    title = title.trim()
    const urlArr = this.validateForm.get('urlArr')?.value || []
    urlArr.forEach((item: any) => {
      if (item.id) {
        tags.push({
          id: item.id,
          url: item.url,
        })
      }
    })

    type TopTypes = typeof this.topOptions
    const topTypes: number[] = (topOptions as TopTypes)
      .filter((item) => item.checked)
      .map((item) => item.value)

    const payload = {
      id: -Date.now(),
      name: title,
      createdAt: this.detail?.createdAt ?? createdAt,
      rate,
      desc,
      top,
      index,
      ownVisible,
      icon,
      url,
      tags,
      topTypes,
    }

    if (this.detail) {
      const ok = updateByWeb(this.detail, payload as IWebProps)
      if (ok) {
        this.message.success($t('_modifySuccess'))
      } else {
        this.message.error('修改失败，找不到ID，请同步远端后尝试')
      }
    } else {
      try {
        const { page, id } = queryString()
        const oneIndex = this.oneIndex ?? page
        const twoIndex = this.twoIndex ?? id
        const threeIndex = this.threeIndex || 0
        const websiteList = navStore.websiteList()
        const w = websiteList[oneIndex].nav[twoIndex].nav[threeIndex].nav
        this.uploading = true
        if (this.isLogin) {
          w.unshift(payload as IWebProps)
          setWebsiteList(websiteList)
          this.message.success($t('_addSuccess'))
          if (this.isMove) {
            dialogService.openMoveWeb({
              indexs: [oneIndex, twoIndex, threeIndex, 0],
              data: [payload as IWebProps],
            })
          }
        }
      } catch (error: any) {
        this.message.error(error.message)
      }
    }
    this.callback()
    this.onOk?.emit?.(payload)
    this.onClose()
  }
}
