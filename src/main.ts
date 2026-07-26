import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { CommonService } from 'src/services/common';
import { JumpService } from 'src/services/jump';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { CheckOutline, CopyOutline, ShareAltOutline, EllipsisOutline, LoadingOutline, UploadOutline, MinusOutline, PlusOutline, StopOutline } from '@ant-design/icons-angular/icons';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';
import config from '../nav.config.json';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

const icons: IconDefinition[] = [
  CheckOutline,
  CopyOutline,
  ShareAltOutline,
  EllipsisOutline,
  LoadingOutline,
  UploadOutline,
  MinusOutline,
  PlusOutline,
  StopOutline,
]

bootstrapApplication(AppComponent, {
    providers: [
        // 全局仅保留根级服务/注册类模块；其余 zorro 模块由 standalone 组件
        // 各自 imports 内聚（随 lazy chunk 按需加载），不再进入首屏 bundle。
        // NzModalModule 必须保留：根级 WebManagementService 与 fixbar 均注入
        // NzModalService（该服务由模块提供，非 providedIn root）
        importProvidersFrom(NzMessageModule, NzNotificationModule, NzModalModule, NzIconModule.forRoot(icons)),
        provideRouter(routes, ...(config.hashMode ? [withHashLocation()] : [])),
        { provide: NZ_I18N, useValue: zh_CN },
        CommonService,
        JumpService,
        provideAnimations(),
    ]
})
  .catch(err => console.error(err));
