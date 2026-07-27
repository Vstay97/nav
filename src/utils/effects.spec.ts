// Copyright @ 2026-present Vstay97. All rights reserved.

import { computeFxClasses, ensureEffectDefaults } from './effects.util'
import { ISettings } from 'src/types'

const baseSettings = {
  effectAurora: true,
  effectGlass: true,
  effectCardMotion: true,
  effectParallax: true,
  effectCursorGlow: true,
} as unknown as ISettings

describe('computeFxClasses', () => {
  it('主题路由：五类全开', () => {
    expect(computeFxClasses(baseSettings, '/side')).toEqual({
      aurora: true,
      glass: true,
      tilt: true,
      parallax: true,
      cursorGlow: true,
    })
  })

  it('根路径按默认主题处理（settings.theme=Side）', () => {
    const r = computeFxClasses(baseSettings, '/')
    expect(r.aurora).toBeTrue()
    expect(r.glass).toBeTrue()
    expect(r.tilt).toBeTrue()
    expect(r.parallax).toBeTrue()
    expect(r.cursorGlow).toBeTrue()
  })

  it('Shortcut 主题：豁免极光，保留其余', () => {
    expect(computeFxClasses(baseSettings, '/shortcut')).toEqual({
      aurora: false,
      glass: true,
      tilt: true,
      parallax: true,
      cursorGlow: true,
    })
  })

  it('后台路由：全部关闭', () => {
    expect(computeFxClasses(baseSettings, '/system/setting')).toEqual({
      aurora: false,
      glass: false,
      tilt: false,
      parallax: false,
      cursorGlow: false,
    })
  })

  it('开关关闭时对应类为 false', () => {
    const s = {
      ...baseSettings,
      effectAurora: false,
      effectCardMotion: false,
      effectParallax: false,
      effectCursorGlow: false,
    } as unknown as ISettings
    expect(computeFxClasses(s, '/side')).toEqual({
      aurora: false,
      glass: true,
      tilt: false,
      parallax: false,
      cursorGlow: false,
    })
  })

  it('带查询串的 URL 也能识别', () => {
    expect(computeFxClasses(baseSettings, '/side?page=0&id=1').aurora).toBeTrue()
  })
})

describe('ensureEffectDefaults', () => {
  it('缺失键时返回补丁', () => {
    expect(ensureEffectDefaults({} as unknown as ISettings)).toEqual({
      effectAurora: true,
      effectGlass: true,
      effectCardMotion: true,
      effectParallax: true,
      effectCursorGlow: true,
    })
  })

  it('部分缺失只补缺失项', () => {
    const s = { effectGlass: false, effectParallax: false } as unknown as ISettings
    expect(ensureEffectDefaults(s)).toEqual({
      effectAurora: true,
      effectCardMotion: true,
      effectCursorGlow: true,
    })
  })

  it('齐全时返回 null', () => {
    expect(ensureEffectDefaults(baseSettings)).toBeNull()
  })
})
