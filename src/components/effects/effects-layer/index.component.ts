// Copyright @ 2026-present Vstay97. All rights reserved.

import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core'

/**
 * 极光背景层：4 个模糊光斑缓慢漂移。
 * 开启「极光视差」（body.fx-parallax）时，整个极光层随鼠标轻微偏移，产生空间纵深感。
 */
@Component({
  selector: 'app-effects-layer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EffectsLayerComponent implements AfterViewInit, OnDestroy {
  /** 视差最大偏移（px），实际范围 ±20 */
  private static readonly SHIFT = 40
  /** 缓动系数（越小越柔和） */
  private static readonly EASE = 0.06

  private rafId = 0
  private targetX = 0
  private targetY = 0
  private curX = 0
  private curY = 0

  private onMouseMove = (e: MouseEvent) => {
    const w = window.innerWidth || 1
    const h = window.innerHeight || 1
    this.targetX = (e.clientX / w - 0.5) * EffectsLayerComponent.SHIFT
    this.targetY = (e.clientY / h - 0.5) * EffectsLayerComponent.SHIFT
  }

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    document.addEventListener('mousemove', this.onMouseMove)
    const loop = () => {
      const host = this.el.nativeElement
      if (document.body.classList.contains('fx-parallax')) {
        this.curX += (this.targetX - this.curX) * EffectsLayerComponent.EASE
        this.curY += (this.targetY - this.curY) * EffectsLayerComponent.EASE
        host.style.transform = `translate(${this.curX.toFixed(2)}px, ${this.curY.toFixed(2)}px)`
      } else if (this.curX !== 0 || this.curY !== 0) {
        this.curX = 0
        this.curY = 0
        host.style.transform = ''
      }
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId)
    document.removeEventListener('mousemove', this.onMouseMove)
  }
}
