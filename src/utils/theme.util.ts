// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { navStore } from 'src/store/nav.store'
import { isMobile } from './dom.util'
import { randomInt } from './text.util'
import { readIsDark } from './storage.util'

function randomColor(): string {
  const r = randomInt(255)
  const g = randomInt(255)
  const b = randomInt(255)
  const c = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}000`
  return c.slice(0, 7)
}

export function isDark(): boolean {
  return readIsDark()
}

let randomTimer: any
export function randomBgImg() {
  if (isDark()) return
  // 极光背景开启时不再生成随机渐变（两者互斥，极光为上位替代）
  if (document.body.classList.contains('fx-aurora')) return

  clearInterval(randomTimer)
  const id = 'random-light-bg'
  const el = document.getElementById(id) || document.createElement('div')
  const deg = randomInt(360)
  el.id = id
  el.style.cssText =
    'position:fixed;top:0;left:0;right:0;bottom:0;z-index:-3;transition: 1s linear;'
  el.style.backgroundImage = `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`
  document.body.appendChild(el)

  function setBg() {
    if (isDark()) {
      clearInterval(randomTimer)
      return
    }
    const randomBg = `linear-gradient(${deg}deg, ${randomColor()} 0%, ${randomColor()} 100%)`
    el.style.opacity = '.3'
    setTimeout(() => {
      el.style.backgroundImage = randomBg
      el.style.opacity = '1'
    }, 1000)
  }

  randomTimer = setInterval(setBg, 10000)
}

export function getDefaultTheme() {
  const settings = navStore.settings()
  const t = isMobile() ? settings.appTheme : settings.theme
  if (t === 'Current') {
    return settings.theme
  }
  return t
}
