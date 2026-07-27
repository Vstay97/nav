// Copyright @ 2026-present Vstay97. All rights reserved.
// 死链/站点信息检测：供 GitHub Actions 定时任务调用（本地亦可手动执行）
import fs from 'node:fs'
import path from 'node:path'
import { spiderWeb } from './util.mjs'

const dbPath = path.join('.', 'data', 'db.json')
const settingsPath = path.join('.', 'data', 'settings.json')

const db = JSON.parse(fs.readFileSync(dbPath).toString())
const settings = JSON.parse(fs.readFileSync(settingsPath).toString())

const { errorUrlCount } = await spiderWeb(db, settings)
settings.errorUrlCount = errorUrlCount

fs.writeFileSync(dbPath, JSON.stringify(db))
fs.writeFileSync(settingsPath, JSON.stringify(settings))
console.log(`爬虫完成，异常链接数：${errorUrlCount}`)
