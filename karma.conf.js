// Karma 配置：自动解析 Playwright 缓存的 Chromium 作为 CHROME_BIN
const fs = require('fs')
const path = require('path')
const os = require('os')

function resolveChromium() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN
  }
  const base =
    process.platform === 'darwin'
      ? path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright')
      : path.join(os.homedir(), '.cache', 'ms-playwright')
  const candidates = []
  try {
    const dirs = fs
      .readdirSync(base)
      .filter((d) => /^chromium-\d+$/.test(d))
      .sort()
      .reverse()
    for (const d of dirs) {
      for (const sub of ['chrome-mac-arm64', 'chrome-mac', 'chrome-linux']) {
        candidates.push(
          path.join(
            base,
            d,
            sub,
            process.platform === 'linux'
              ? 'chrome'
              : 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
          )
        )
      }
    }
  } catch {
    // ignore
  }
  return candidates.find((p) => fs.existsSync(p))
}

const chromeBin = resolveChromium()
if (chromeBin) {
  process.env.CHROME_BIN = chromeBin
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    restartOnFileChange: true,
  })
}
