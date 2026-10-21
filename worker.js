/**
 * Cloudflare Worker – proxy for api.2nr.xyz
 *
 * Bind this worker to a route, e.g.:
 *   2nr.pages.dev/api/*
 * or a custom domain.
 *
 * Browser:  POST https://2nr.pages.dev/api/auth/login
 * Worker:   POST https://api.2nr.xyz/auth/login
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: cors(url.origin),
      })
    }

    // Strip /api prefix → upstream path
    // /api/auth/login  →  /auth/login
    let path = url.pathname
    if (path.startsWith('/api')) {
      path = path.slice(4) || '/'
    }
    if (!path.startsWith('/')) path = '/' + path

    const target = `https://api.2nr.xyz${path}${url.search}`

    // Match official Android app headers (from HAR)
    const headers = new Headers()
    headers.set('User-Agent', 'okhttp/4.10.0')
    headers.set('Accept', 'application/json')
    headers.set('Accept-Encoding', 'gzip')
    headers.set('Content-Type', 'application/json; charset=UTF-8')

    // Forward session token
    const cookie = request.headers.get('Cookie') || ''
    const tokenHeader = request.headers.get('x-auth-token')
    const tokenFromCookie = (cookie.match(/(?:^|;\s*)token=([^;]+)/) || [])[1]
    const token = tokenHeader || tokenFromCookie

    if (token) {
      headers.set('Cookie', `token=${token}; x-app-version=52`)
      headers.set('x-auth-token', token)
    }

    let body = null
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.arrayBuffer()
    }

    try {
      const upstream = await fetch(target, {
        method: request.method,
        headers,
        body: body && body.byteLength ? body : undefined,
        redirect: 'manual',
      })

      const raw = await upstream.arrayBuffer()
      const preview = new TextDecoder().decode(raw.slice(0, 800))
      const contentType = upstream.headers.get('content-type') || ''

      // Cloudflare WAF / challenge page from api.2nr.xyz
      if (
        contentType.includes('text/html') ||
        preview.includes('Attention Required') ||
        preview.includes('you have been blocked') ||
        preview.includes('cf-error-details') ||
        preview.includes('Just a moment') ||
        preview.includes('cf-browser-verification')
      ) {
        return json(
          {
            error:
              'api.2nr.xyz blocked this request (Cloudflare WAF / datacenter IP). Use the official Android app.',
            code: 'CF_WAF_BLOCKED',
          },
          403,
          url.origin
        )
      }

      const out = new Headers()
      out.set(
        'Content-Type',
        contentType.includes('json') ? contentType : 'application/json; charset=utf-8'
      )
      Object.entries(cors(url.origin)).forEach(([k, v]) => out.set(k, v))
      out.set('Access-Control-Expose-Headers', 'x-auth-token, set-cookie')

      const setCookie = upstream.headers.get('set-cookie')
      if (setCookie) {
        out.set('Set-Cookie', setCookie)
        const m = setCookie.match(/token=([^;]+)/)
        if (m) out.set('x-auth-token', m[1])
      }

      return new Response(raw, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: out,
      })
    } catch (err) {
      return json(
        {
          error: 'Proxy failed to reach api.2nr.xyz',
          message: err && err.message ? err.message : 'Unknown error',
          code: 'PROXY_ERROR',
        },
        502,
        url.origin
      )
    }
  },
}

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token, Authorization, Cookie',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...cors(origin),
    },
  })
}
