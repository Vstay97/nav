// Copyright @ 2026-present Vstay97. All rights reserved.

import { ISettings } from 'src/types'
import { THEME_REGISTRY } from 'src/view/themes.registry'
import { getDefaultTheme } from './theme.util'

export interface FxClasses {
  aurora: boolean
  glass: boolean
  tilt: boolean
  parallax: boolean
  cursorGlow: boolean
}

const OFF: FxClasses = {
  aurora: false,
  glass: false,
  tilt: false,
  parallax: false,
  cursorGlow: false,
}

/**
 * 计算当前页面应启用的特效 body 类。
 * 规则：非主题路由（/system 等）全关；Shortcut 豁免极光；其余按设置开关。
 */
export function computeFxClasses(settings: ISettings, url: string): FxClasses {
  const path = (url.split('?')[0] || '/').replace(/^\/+/, '').toLowerCase()
  const themePath = path || getDefaultTheme().toLowerCase()
  const isThemeRoute = THEME_REGISTRY.some((t) => t.path === themePath)
  if (!isThemeRoute) {
    return { ...OFF }
  }
  return {
    aurora: settings.effectAurora !== false && themePath !== 'shortcut',
    glass: settings.effectGlass !== false,
    tilt: settings.effectCardMotion !== false,
    parallax: settings.effectParallax !== false,
    cursorGlow: settings.effectCursorGlow !== false,
  }
}

/** 存量 settings 缺失 effect* 键时返回默认值补丁；齐全返回 null */
export function ensureEffectDefaults(
  settings: ISettings
): Partial<ISettings> | null {
  const patch: Partial<ISettings> = {}
  if (settings.effectAurora == null) patch.effectAurora = true
  if (settings.effectGlass == null) patch.effectGlass = true
  if (settings.effectCardMotion == null) patch.effectCardMotion = true
  if (settings.effectParallax == null) patch.effectParallax = true
  if (settings.effectCursorGlow == null) patch.effectCursorGlow = true
  return Object.keys(patch).length ? patch : null
}
