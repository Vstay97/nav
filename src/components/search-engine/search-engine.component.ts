// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component, Input } from '@angular/core'
import {
  getDefaultSearchEngine,
  setDefaultSearchEngine,
  queryString,
} from '../../utils'
import { Router } from '@angular/router'
import { navStore } from 'src/store/nav.store'
import { ISearchEngineProps } from '../../types'
import { SearchType } from './index'
import { $t } from 'src/locale'
import { NgStyle } from '@angular/common';
import { NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective, NzInputDirective } from 'ng-zorro-antd/input';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzPopoverDirective } from 'ng-zorro-antd/popover';
import { LogoComponent } from '../logo/logo.component';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';

@Component({
    selector: 'app-search-engine',
    templateUrl: './search-engine.component.html',
    styleUrls: ['./search-engine.component.scss'],
    standalone: true,
    imports: [
    NzInputGroupComponent,
    ɵNzTransitionPatchDirective,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzInputDirective,
    ReactiveFormsModule,
    FormsModule,
    NzPopoverDirective,
    NgStyle,
    LogoComponent,
    NzSelectComponent,
    NzOptionComponent
],
})
export class SearchEngineComponent {
  @Input() size: 'small' | 'default' | 'large' = 'default'

  $t = $t
  currentEngine: ISearchEngineProps = getDefaultSearchEngine()
  SearchType = SearchType
  searchTypeValue = SearchType.All
  keyword = queryString().q

  get searchEngineList(): ISearchEngineProps[] {
    return navStore.searchEngineList()
  }

  constructor(private router: Router) {}

  get searchList() {
    return this.searchEngineList.filter((item) => !item.blocked)
  }

  inputFocus() {
    setTimeout(() => {
      document.getElementById('search-engine-input')?.focus?.()
    }, 100)
  }

  ngAfterViewInit() {
    this.inputFocus()
  }

  clickEngineItem(index: number) {
    document.body.click()
    this.currentEngine = this.searchList[index]
    this.inputFocus()
    setDefaultSearchEngine(this.currentEngine)
  }

  triggerSearch() {
    if (this.currentEngine.url) {
      window.open(this.currentEngine.url + this.keyword)
      return
    }

    const params = queryString()
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        ...params,
        q: this.keyword,
        type: this.searchTypeValue,
      },
    })
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.triggerSearch()
    }
  }
}
