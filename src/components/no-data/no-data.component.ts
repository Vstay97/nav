// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component, ChangeDetectionStrategy } from '@angular/core'
import { $t } from 'src/locale'
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
    standalone: true,
    imports: [
        NzEmptyComponent,
        NzButtonComponent,
        NzWaveDirective,
        ɵNzTransitionPatchDirective,
    ],
})
export class NoDataComponent {
  $t = $t

  goBack = () => {
    history.go(-1)
  }
}
