import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { CommonService } from 'src/services/common';
import { JumpService } from 'src/services/jump';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { CheckOutline, CopyOutline, ShareAltOutline, EllipsisOutline, LoadingOutline, UploadOutline, MinusOutline, PlusOutline, StopOutline } from '@ant-design/icons-angular/icons';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
        importProvidersFrom(NzModalModule, NzInputModule, NzRadioModule, NzSelectModule, NzMessageModule, NzNotificationModule, NzFormModule, NzEmptyModule, NzButtonModule, ReactiveFormsModule, NzPopconfirmModule, NzDropDownModule, NzToolTipModule, NzCardModule, NzIconModule.forRoot(icons), NzGridModule, NzLayoutModule, NzMenuModule, NzTableModule, NzTabsModule, NzTagModule, NzRateModule, NzCheckboxModule, NzPopoverModule, NzSliderModule, NzSpinModule, NzDrawerModule, NzColorPickerModule, NzCarouselModule, NzTimePickerModule, NzDatePickerModule, NzSwitchModule, DragDropModule, FormsModule),
        provideRouter(routes, ...(config.hashMode ? [withHashLocation()] : [])),
        { provide: NZ_I18N, useValue: zh_CN },
        CommonService,
        JumpService,
        provideAnimations(),
    ]
})
  .catch(err => console.error(err));
