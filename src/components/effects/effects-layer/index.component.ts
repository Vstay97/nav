// Copyright @ 2026-present Vstay97. All rights reserved.

import { Component, ChangeDetectionStrategy } from '@angular/core'

/** 极光背景层：4 个模糊光斑缓慢漂移。仅渲染，无任何交互。 */
@Component({
  selector: 'app-effects-layer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EffectsLayerComponent {}
