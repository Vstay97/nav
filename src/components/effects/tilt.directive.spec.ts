// Copyright @ 2026-present Vstay97. All rights reserved.

import { Component } from '@angular/core'
import { TestBed, ComponentFixture } from '@angular/core/testing'
import { TiltDirective } from './tilt.directive'

@Component({
  template: `<div appTilt style="width:100px;height:100px"></div>`,
  standalone: true,
  imports: [TiltDirective],
})
class HostComponent {}

describe('TiltDirective', () => {
  let fixture: ComponentFixture<HostComponent>
  let el: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] })
    fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    el = fixture.nativeElement.querySelector('div')
  })

  afterEach(() => {
    document.body.classList.remove('fx-tilt')
  })

  it('body 无 fx-tilt 类时不写入 transform', () => {
    el.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }))
    expect(el.style.transform).toBe('')
  })

  it('body 有 fx-tilt 类时写入 rotate 与追光变量', () => {
    document.body.classList.add('fx-tilt')
    const rect = el.getBoundingClientRect()
    el.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: rect.left + 50,
        clientY: rect.top + 25,
      })
    )
    expect(el.style.transform).toContain('rotateX')
    expect(el.style.transform).toContain('rotateY')
    expect(el.style.getPropertyValue('--mx')).toContain('px')
  })

  it('mouseleave 后清除内联样式', () => {
    document.body.classList.add('fx-tilt')
    const rect = el.getBoundingClientRect()
    el.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: rect.left + 1,
        clientY: rect.top + 1,
      })
    )
    el.dispatchEvent(new MouseEvent('mouseleave'))
    expect(el.style.transform).toBe('')
    expect(el.style.boxShadow).toBe('')
  })
})
