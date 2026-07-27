// Copyright @ 2026-present Vstay97. All rights reserved.
// GET /webinfo?url=<目标站> → { title?, description?, url? }（url 为图标地址）

export interface Env {
  ALLOWED_ORIGIN: string
}

const corsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
})

const PRIVATE_HOSTS = ['localhost']
const PRIVATE_IP =
  /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|::1|fc|fd)/i

function isForbiddenTarget(u: URL): boolean {
  const h = u.hostname.toLowerCase()
  return (
    PRIVATE_HOSTS.includes(h) ||
    PRIVATE_IP.test(h) ||
    h.endsWith('.internal') ||
    h.endsWith('.local')
  )
}

function json(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN || '*'
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    const reqUrl = new URL(request.url)
    if (reqUrl.pathname !== '/webinfo') {
      return json({ message: 'Not Found' }, 404, origin)
    }

    let target: URL
    try {
      target = new URL(reqUrl.searchParams.get('url') || '')
      if (target.protocol !== 'http:' && target.protocol !== 'https:') {
        throw new Error('bad protocol')
      }
    } catch {
      return json({ message: 'invalid url' }, 400, origin)
    }
    if (isForbiddenTarget(target)) {
      return json({ message: 'forbidden host' }, 400, origin)
    }

    let titleTag = ''
    let ogTitle = ''
    let metaDesc = ''
    let ogDesc = ''
    let icon = ''
    let iconApple = ''
    // 只取第一个 <title>（head 中）；页面 SVG 内的 <title> 会混入噪声
    let titleDone = false

    try {
      const res = await fetch(target.toString(), {
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
      })
      if (!res.ok) {
        return json({ message: `upstream ${res.status}` }, 502, origin)
      }

      await new HTMLRewriter()
        .on('title', {
          text(t) {
            if (!titleDone) titleTag += t.text
          },
          element(el) {
            el.onEndTag(() => {
              titleDone = true
            })
          },
        })
        .on('meta', {
          element(el) {
            const content = el.getAttribute('content') || ''
            if (!content) return
            const name = el.getAttribute('name')?.toLowerCase()
            const prop = el.getAttribute('property')?.toLowerCase()
            if (name === 'description' && !metaDesc) metaDesc = content
            if (prop === 'og:title' && !ogTitle) ogTitle = content
            if (prop === 'og:description' && !ogDesc) ogDesc = content
          },
        })
        .on('link', {
          element(el) {
            const href = el.getAttribute('href')
            if (!href) return
            const rel = (el.getAttribute('rel') || '').toLowerCase()
            if (!rel.includes('icon')) return
            const abs = new URL(href, target).toString()
            if (!abs.startsWith('http')) return
            if (rel.includes('apple-touch-icon')) {
              if (!iconApple) iconApple = abs
            } else if (!icon) {
              icon = abs
            }
          },
        })
        .transform(res)
        .text()
    } catch (e: any) {
      return json({ message: e?.message || 'fetch failed' }, 502, origin)
    }

    const title = (titleTag || ogTitle).trim()
    const description = (metaDesc || ogDesc).trim()
    const finalIcon = iconApple || icon || `${target.origin}/favicon.ico`

    const data: Record<string, string> = {}
    if (title) data.title = title
    if (description) data.description = description
    data.url = finalIcon
    return json(data, 200, origin)
  },
}
