// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component, effect } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
import { SETTING_PATH } from 'src/constants'
import { dataProvider } from 'src/providers'
import { navStore } from 'src/store/nav.store'
import { ISettings } from 'src/types'
import { compilerTemplate } from 'src/utils/util'
import { componentTitleMap } from '../component/types'
import footTemplate from 'src/components/footer/template'
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { UploadComponent, IUploadChangePayload } from '../../../components/upload/index.component';
import { NzInputDirective, NzAutosizeDirective } from 'ng-zorro-antd/input';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzRadioGroupComponent, NzRadioComponent } from 'ng-zorro-antd/radio';
import { NzPopoverDirective } from 'ng-zorro-antd/popover';
import { NzCheckboxComponent, NzCheckboxGroupComponent } from 'ng-zorro-antd/checkbox';
import { NzTabSetComponent, NzTabComponent } from 'ng-zorro-antd/tabs';
import { BannerTableComponent } from 'src/components/banner-table/index.component';
import { NzSliderComponent } from 'ng-zorro-antd/slider';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe';

// 额外添加的字段，但不添加到配置中
const extraForm: Record<string, any> = {
  footTemplate: '',
  componentOptions: [],
}

@Component({
    selector: 'system-setting',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NzFormDirective,
        NzRowDirective,
        NzFormItemComponent,
        NzColDirective,
        NzFormLabelComponent,
        NzFormControlComponent,
        UploadComponent,
        NzInputDirective,
        NzSelectComponent,
        NzOptionComponent,
        NzRadioGroupComponent,
        NzRadioComponent,
        NzPopoverDirective,
        NzAutosizeDirective,
        NzCheckboxComponent,
        NzCheckboxGroupComponent,
        NzTabSetComponent,
        NzTabComponent,
        BannerTableComponent,
        NzSliderComponent,
        NzButtonComponent,
        NzWaveDirective,
        ɵNzTransitionPatchDirective,
        SafeHtmlPipe,
    ],
})
export class SystemSettingComponent {
  $t = $t
  validateForm!: FormGroup
  submitting: boolean = false
  tabActive = 0
  textareaSize = { minRows: 3, maxRows: 20 }

  get settings(): ISettings {
    return navStore.settings()
  }

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    const settings = navStore.settings()
    const components = navStore.components()
    extraForm['componentOptions'] = components.map((item) => {
      const checked = settings.components.some(
        (c) => item.type === c.type && item.id === c.id
      )
      return {
        label: componentTitleMap[item.type],
        value: item.id,
        type: item.type,
        id: item.id,
        checked,
      }
    })
    const group: any = {
      ...extraForm,
      ...settings,
    }
    const groupPayload: any = {}
    for (const k in group) {
      groupPayload[k] = [group[k]]
    }
    this.validateForm = this.fb.group(groupPayload)

    effect(() => {
      const data = navStore.githubUserInfo()
      if (data) {
        this.validateForm
          .get('email')!
          .setValue(this.settings.email || data['email'] || '')
      }
    })
  }

  get cdnUrl(): string {
    return this.validateForm.get('gitHubCDN')?.value
  }

  get footTemplate(): string {
    return compilerTemplate(this.validateForm.get('footerContent')?.value || '')
  }

  onFootTemplateChange(v: string) {
    this.validateForm
      .get('footerContent')!
      .setValue(footTemplate[v]?.trim?.() || '')
  }

  onLogoChange(data: IUploadChangePayload | Event) {
    if ('cdn' in data) {
      this.settings.favicon = data.cdn || ''
    }
  }

  onShortcutImgChange(e: Event | IUploadChangePayload) {
    let url = ''
    if ('cdn' in e) {
      url = e.cdn
    } else {
      url = (e.target as HTMLInputElement)?.value?.trim() || ''
    }
    this.settings.shortcutThemeImages[0]['src'] = url
  }

  handleSubmit() {
    if (this.submitting) {
      return
    }

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        function filterImage(item: Record<string, any>) {
          return item['src']
        }
        const formValues = this.validateForm.value
        const values = {
          ...formValues,
          favicon: this.settings.favicon,
          simThemeImages: this.settings.simThemeImages.filter(filterImage),
          shortcutThemeImages:
            this.settings.shortcutThemeImages.filter(filterImage),
          sideThemeImages: this.settings.sideThemeImages.filter(filterImage),
          superImages: this.settings.superImages.filter(filterImage),
          lightImages: this.settings.lightImages.filter(filterImage),
          components: formValues.componentOptions
            .filter((item: any) => item.checked)
            .map((item: any) => ({ type: item.type, id: item.id })),
        }
        for (const k in extraForm) {
          delete values[k]
        }

        this.submitting = true
        dataProvider.updateFileContent({
          message: 'update settings',
          content: JSON.stringify(values),
          path: SETTING_PATH,
        })
          .then(() => {
            this.message.success($t('_saveSuccess'))
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }
}
