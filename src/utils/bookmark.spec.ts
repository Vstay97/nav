// Copyright @ 2026-present Vstay97. All rights reserved.
import { generateBookmarkHtml } from './bookmark'

describe('generateBookmarkHtml', () => {
  const webs: any[] = [
    {
      title: '一级分类',
      nav: [
        {
          title: '二级分类',
          nav: [
            {
              title: '三级分类',
              nav: [
                {
                  name: 'GitHub & Co',
                  url: 'https://github.com/?a=1&b=2',
                  icon: 'https://github.com/favicon.ico',
                  createdAt: 1700000000000,
                },
                { name: 'NoIcon', url: 'https://example.com', createdAt: 0 },
              ],
            },
          ],
        },
      ],
    },
  ]
  const html = generateBookmarkHtml(webs as any)

  it('生成 Netscape 格式头与三级目录结构', () => {
    expect(html.startsWith('<!DOCTYPE NETSCAPE-Bookmark-file-1>')).toBe(true)
    expect((html.match(/<H3>/g) || []).length).toBe(3)
    expect(html).toContain('<DL><p>')
  })

  it('转义名称与 URL 中的特殊字符', () => {
    expect(html).toContain('GitHub &amp; Co')
    expect(html).toContain('https://github.com/?a=1&amp;b=2')
  })

  it('ICON 属性仅在有图标时输出，ADD_DATE 为秒级时间戳', () => {
    expect(html).toContain('ICON="https://github.com/favicon.ico"')
    expect(html).toContain('ADD_DATE="1700000000"')
    const noIconLine = html.split('\n').find((l) => l.includes('NoIcon'))!
    expect(noIconLine).not.toContain('ICON=')
  })

  it('生成结果可被 DOM 解析为书签树（与 parseBookmark 同格式）', () => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const rootDL = doc.querySelector('dl dl')
    expect(rootDL).not.toBeNull()
    const anchors = doc.querySelectorAll('dt a')
    expect(anchors.length).toBe(2)
    expect(anchors[0].getAttribute('href')).toBe('https://github.com/?a=1&b=2')
    expect(anchors[0].textContent).toBe('GitHub & Co')
  })
})
