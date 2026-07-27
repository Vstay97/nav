// Copyright @ 2026-present Vstay97. All rights reserved.

import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core'

/**
 * 卡片 3D 悬浮 + 鼠标追光。
 * 仅当 body 带 fx-tilt 类时生效（全局「卡片动效」开关），移动端无 hover 天然不触发。
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective {
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent) {
    if (!document.body.classList.contains('fx-tilt')) {
      return
    }
    const host = this.el.nativeElement
    const rect = host.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = (y / rect.height - 0.5) * -10
    const ry = (x / rect.width - 0.5) * 10
    this.renderer.setStyle(
      host,
      'transform',
      `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(6px)`
    )
    this.renderer.setStyle(host, 'box-shadow', '0 18px 36px rgba(0,0,0,.28)')
    host.style.setProperty('--mx', `${x}px`)
    host.style.setProperty('--my', `${y}px`)
  }

  @HostListener('mouseleave')
  onLeave() {
    const host = this.el.nativeElement
    this.renderer.removeStyle(host, 'transform')
    this.renderer.removeStyle(host, 'box-shadow')
  }
}
