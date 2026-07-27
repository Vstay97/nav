// Copyright @ 2026-present Vstay97. All rights reserved.
// 死链/站点信息检测：供 GitHub Actions 定时任务调用（本地亦可手动执行）
import fs from 'node:fs'
import path from 'node:path'
import LZString from 'lz-string'
import { spiderWeb } from './util.mjs'

const dbPath = path.join('.', 'data', 'db.json')
const settingsPath = path.join('.', 'data', 'settings.json')

// 兼容过渡期：旧仓库的 db.json 可能仍是 LZString 压缩格式
const rawDb = fs.readFileSync(dbPath).toString().trim()
const db = rawDb.startsWith('[')
  ? JSON.parse(rawDb)
  : JSON.parse(LZString.decompressFromBase64(rawDb))
const settings = JSON.parse(fs.readFileSync(settingsPath).toString())

const { errorUrlCount } = await spiderWeb(db, settings)
settings.errorUrlCount = errorUrlCount

fs.writeFileSync(dbPath, JSON.stringify(db))
fs.writeFileSync(settingsPath, JSON.stringify(settings))
console.log(`爬虫完成，异常链接数：${errorUrlCount}`)
