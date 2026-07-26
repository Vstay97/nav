// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import Clipboard from 'clipboard'

export function copyText(el: Event, text: string): Promise<boolean> {
  const target = el.target as Element
  const ranId = `copy-${Date.now()}`
  target.id = ranId
  target.setAttribute('data-clipboard-text', text)

  return new Promise((resolve) => {
    const clipboard = new Clipboard(`#${ranId}`)
    clipboard.on('success', function () {
      clipboard.destroy()
      resolve(true)
    })

    clipboard.on('error', function () {
      clipboard.destroy()
      resolve(false)
    })
  })
}

export async function isValidImg(url: string): Promise<boolean> {
  if (!url) return false

  if (url === 'null' || url === 'undefined') return false

  const { protocol } = window.location

  if (protocol === 'https:' && url.startsWith('http:')) return false

  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.src = url
    img.style.display = 'none'
    img.onload = () => {
      img.parentNode?.removeChild(img)
      resolve(true)
    }
    img.onerror = () => {
      img.parentNode?.removeChild(img)
      resolve(false)
    }
    document.body.append(img)
  })
}

// 获取第几个元素超出父节点宽度
export function getOverIndex(selector: string): number {
  const els = document.querySelectorAll(selector)
  let overIndex = Number.MAX_SAFE_INTEGER
  if (els.length <= 0) {
    return overIndex
  }
  const parentEl = els[0].parentNode as HTMLElement
  const parentWidth = parentEl!.clientWidth as number
  let scrollWidth = 0
  for (let i = 0; i < els.length; i++) {
    const el = els[i]
    scrollWidth += el.clientWidth
    if (scrollWidth > parentWidth) {
      overIndex = i - 1
      break
    }
  }
  return overIndex
}

export function isMobile() {
  return 'ontouchstart' in window
}
