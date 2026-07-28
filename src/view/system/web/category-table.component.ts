// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { $t } from 'src/locale'
import { NavCategory } from 'src/types'

import { NzTableModule } from 'ng-zorro-antd/table'
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { LogoComponent } from 'src/components/logo/logo.component'

/**
 * 分类管理表格（一/二/三级分类 tab 共用）：
 * 选择框、图标、名称、自己可见、创建时间、操作（上移/下移/编辑/删除）。
 * 全部操作经 Output 冒泡给父组件处理。
 */
@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [
    NzTableModule,
    NzPopconfirmDirective,
    NzIconDirective,
    LogoComponent
],
  template: `
    <nz-table
      #rowSelectionTable
      #basicTable
      [nzData]="data"
      [nzShowPagination]="false"
      style="margin-top: 15px"
      >
      <thead>
        <tr>
          <th
            [nzChecked]="checkedAll"
            (nzCheckedChange)="allChecked.emit($event)"
          ></th>
          <th>{{ $t('_icon') }}</th>
          <th>{{ $t('_tagName') }}</th>
          <th>{{ $t('_onlyOwnVisible') }}</th>
          <th>{{ $t('_createAt') }}</th>
          <th>{{ $t('_action') }}</th>
        </tr>
      </thead>
      <tbody>
        @for (item of data; track item; let idx = $index) {
          <tr>
            <td
              [nzChecked]="checkedIds.has(item.title || '')"
            (nzCheckedChange)="
              itemChecked.emit({ id: item.title || '', checked: $event })
            "
            ></td>
            <td>
              <app-logo [src]="item.icon || ''" [name]="item.title || ''" />
            </td>
            <td>{{ item.title }}</td>
            <td>
              @if (item.ownVisible) {
                <i
                  nz-icon
                  nzType="check"
                  nzTheme="outline"
                ></i>
              }
            </td>
            <td>{{ item.createdAt }}</td>
            <td class="select-none">
              <a (click)="moveUp.emit(idx)">{{ $t('_moveUp') }}</a>
              <a (click)="moveDown.emit(idx)" class="ml-2.5">{{
                $t('_moveDown')
              }}</a>
              <a (click)="edit.emit({ data: item, idx })" class="ml-2.5">{{
                $t('_edit')
              }}</a>
              @if (showMove) {
                <a
                  (click)="move.emit({ data: item, idx })"
                  class="ml-2.5"
                  >{{ $t('_move') }}</a
                  >
                }
                <a
                  nz-popconfirm
                  [nzPopconfirmTitle]="$t('_delWarn')"
                  nzPopconfirmPlacement="bottom"
                  (nzOnConfirm)="delete.emit(idx)"
                  class="color-red ml-2.5"
                  >
                  {{ $t('_del') }}
                </a>
              </td>
            </tr>
          }
        </tbody>
      </nz-table>
    `,
})
export class CategoryTableComponent {
  @Input() data: NavCategory[] = []
  @Input() checkedIds: Set<string> = new Set()
  @Input() checkedAll = false
  @Input() showMove = false

  @Output() allChecked = new EventEmitter<boolean>()
  @Output() itemChecked = new EventEmitter<{ id: string; checked: boolean }>()
  @Output() moveUp = new EventEmitter<number>()
  @Output() moveDown = new EventEmitter<number>()
  @Output() edit = new EventEmitter<{ data: NavCategory; idx: number }>()
  @Output() move = new EventEmitter<{ data: NavCategory; idx: number }>()
  @Output() delete = new EventEmitter<number>()

  $t = $t
}
