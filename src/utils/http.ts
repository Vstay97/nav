// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// Modified by Vstay97, 2026

import axios from 'axios'
import NProgress from 'nprogress'
import config from '../../nav.config.json'
import { notify } from 'src/services/notify'
import { getToken } from '../utils/user'

const httpInstance = axios.create({
  timeout: 60000 * 3,
  baseURL: config.gitRepoUrl.includes('gitee.com')
    ? 'https://gitee.com/api/v5'
    : 'https://api.github.com',
})

function startLoad() {
  NProgress.start()
}

function stopLoad() {
  NProgress.done()
}

httpInstance.interceptors.request.use(
  function (config) {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `token ${token}`
    }
    startLoad()
    return config
  },
  function (error) {
    stopLoad()
    return Promise.reject(error)
  }
)

httpInstance.interceptors.response.use(
  function (res) {
    stopLoad()
    return res
  },
  function (error) {
    const status =
      error.status || error.response?.data?.status || error.code || ''
    const errorMsg = error.response?.data?.message || error.message || ''
    notify({
      type: 'error',
      title: 'Error：' + status,
      content: errorMsg,
    })
    stopLoad()
    return Promise.reject(error)
  }
)

export default httpInstance
