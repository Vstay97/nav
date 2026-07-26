// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Directive, AfterViewInit, OnDestroy } from '@angular/core'
import { CommonService } from 'src/services/common'

/**
 * 主题视图基类：接管各主题共有的"顶部导航溢出检测"生命周期。
 *
 * 子类约定：
 * - overTypeKey：settings 中该主题的 OverType 配置键（null 表示不启用检测）
 * - overflowSelector：顶部导航项的 CSS 选择器（默认 .top-nav .over-item）
 *
 * Angular 会调用基类实现的生命周期钩子（子类不覆盖同名钩子即可）。
 */
@Directive()
export abstract class BaseThemeComponent
  implements AfterViewInit, OnDestroy
{
  /** settings 中对应主题的 OverType 配置键；null 表示该主题不做溢出检测 */
  protected abstract readonly overTypeKey:
    | 'lightOverType'
    | 'simOverType'
    | 'superOverType'
    | null

  protected overflowSelector = '.top-nav .over-item'

  constructor(public commonService: CommonService) {}

  ngAfterViewInit() {
    if (
      this.overTypeKey &&
      this.commonService.settings[this.overTypeKey] === 'ellipsis'
    ) {
      this.commonService.getOverIndex(this.overflowSelector)
    }
  }

  ngOnDestroy() {
    this.commonService.overIndex = Number.MAX_SAFE_INTEGER
  }
}
