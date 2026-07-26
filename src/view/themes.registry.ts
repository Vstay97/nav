// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Type } from '@angular/core'
import { ThemeType } from 'src/types'

/**
 * 主题注册表：路由、主题切换菜单、默认主题判定共用同一份元数据。
 * 新增主题 = 在此注册一项（含 loadComponent 静态分包路径）。
 */
export interface IThemeMeta {
  /** 路由路径（小写，如 'light'） */
  path: string
  /** ThemeType 中的主题名（如 'Light'） */
  name: Exclude<ThemeType, 'Current'>
  /** 路由懒加载（静态 import 供 webpack 分包） */
  loadComponent: () => Promise<Type<any>>
}

export const THEME_REGISTRY: IThemeMeta[] = [
  {
    path: 'side',
    name: 'Side',
    loadComponent: () =>
      import('../view/side/index.component').then((m) => m.SideComponent),
  },
  {
    path: 'light',
    name: 'Light',
    loadComponent: () =>
      import('../view/light/index.component').then((m) => m.LightComponent),
  },
  {
    path: 'sim',
    name: 'Sim',
    loadComponent: () =>
      import('../view/sim/index.component').then((m) => m.SimComponent),
  },
  {
    path: 'super',
    name: 'Super',
    loadComponent: () =>
      import('../view/super/index.component').then((m) => m.SuperComponent),
  },
  {
    path: 'shortcut',
    name: 'Shortcut',
    loadComponent: () =>
      import('../view/shortcut/index.component').then(
        (m) => m.ShortcutComponent
      ),
  },
  {
    path: 'app',
    name: 'App',
    loadComponent: () =>
      import('../view/app/default/app.component').then((m) => m.WebpComponent),
  },
]

export function findTheme(path: string): IThemeMeta | undefined {
  return THEME_REGISTRY.find((t) => t.path === path)
}
