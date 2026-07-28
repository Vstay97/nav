// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { dataProvider, getCDN, imageBranch } from 'src/providers'

import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';

/** 上传完成后 emit 的载荷 */
export interface IUploadChangePayload {
  rawPath: string
  cdn: string
}

@Component({
    selector: 'app-upload',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
    ɵNzTransitionPatchDirective,
    NzIconDirective
],
})
export class UploadComponent {
  @Output() onChange = new EventEmitter<IUploadChangePayload>()

  $t = $t
  uploading: boolean = false
  // @ts-ignore
  id = `f${Date.now()}${parseInt(Math.random() * 1000000)}`

  constructor(private message: NzMessageService) {}

  onChangeFile(e: Event) {
    if (this.uploading) {
      return
    }

    const target = e.target as HTMLInputElement
    const { files } = target
    if (!files || files.length <= 0) return
    const file = files[0]

    if (!file.type.startsWith('image')) {
      return this.message.error($t('_notUpload'))
    }
    this.onUpload(file).finally(() => {
      target.value = ''
    })
  }

  onUpload(file: File) {
    const that = this
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onerror = reject
      fileReader.onload = function () {
        that.uploading = true
        const iconUrl = this.result as string
        const url = iconUrl.split(',')[1]
        // fileName 方便自动带上文件后缀
        const fileName = file.name.replace(/\s/gi, '')
        const path = `nav-${Date.now()}-${fileName}`

        dataProvider.createFile({
          branch: imageBranch || 'image',
          message: 'create image',
          content: url,
          isEncode: false,
          path,
        })
          .then((res) => {
            const params = {
              rawPath: path,
              cdn: res?.data?.imagePath || getCDN(path),
            }
            that.onChange.emit(params)
            that.message.success($t('_uploadSuccess'))
            resolve(params)
          })
          .catch(reject)
          .finally(() => {
            that.uploading = false
          })
      }
    })
  }
}
