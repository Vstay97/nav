// Copyright @ 2026-present Vstay97. All rights reserved.

import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core'

/**
 * 全局光标光晕：一个柔光斑跟随鼠标扫过整页背景（相当于「追光」的全局版）。
 * 光斑位于内容之下、极光之上，透过玻璃卡片隐约可见。
 */
@Component({
  selector: 'app-cursor-glow',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursorGlowComponent implements AfterViewInit, OnDestroy {
  /** 缓动系数（越大越跟手，越小拖尾感越重） */
  private static readonly EASE = 0.45

  private rafId = 0
  private targetX = 0
  private targetY = 0
  private curX = 0
  private curY = 0
  private shown = false

  private onMouseMove = (e: MouseEvent) => {
    this.targetX = e.clientX
    this.targetY = e.clientY
    if (!this.shown) {
      this.shown = true
      this.curX = e.clientX
      this.curY = e.clientY
      this.el.nativeElement.classList.add('visible')
    }
  }

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    document.addEventListener('mousemove', this.onMouseMove)
    const loop = () => {
      this.curX += (this.targetX - this.curX) * CursorGlowComponent.EASE
      this.curY += (this.targetY - this.curY) * CursorGlowComponent.EASE
      // 光斑尺寸 400px，居中于光标
      this.el.nativeElement.style.transform = `translate(${(this.curX - 200).toFixed(2)}px, ${(this.curY - 200).toFixed(2)}px)`
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId)
    document.removeEventListener('mousemove', this.onMouseMove)
  }
}
