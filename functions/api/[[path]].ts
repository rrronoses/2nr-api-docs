/**
 * Cloudflare Pages Function
 * Bound automatically to: https://2nr.pages.dev/api/*
 * Proxies to: https://api.2nr.xyz/*
 */

export const onRequest = async (context: EventContext<any, any, any>) => {
  const request = context.request
  const url = new URL(request.url)

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-auth-token, Authorization, Cookie',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // /api/auth/login  →  https://api.2nr.xyz/auth/login
  const path = url.pathname.replace(/^\/api/, '') || '/'
  const target = `https://api.2nr.xyz${path}${url.search}`

  // Headers matching official Android app (from HAR captures)
  const headers = new Headers()
  headers.set('User-Agent', 'okhttp/4.10.0')
  headers.set('Accept', 'application/json')
  headers.set('Accept-Encoding', 'gzip')
  headers.set('Content-Type', 'application/json; charset=UTF-8')

  const token =
    request.headers.get('x-auth-token') ||
    (request.headers.get('cookie') || '').match(/(?:^|;\s*)token=([^;]+)/)?.[1]

  if (token) {
    headers.set('Cookie', `token=${token}; x-app-version=52`)
    headers.set('x-auth-token', token)
  }

  let body: ArrayBuffer | undefined
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
    const ct = upstream.headers.get('content-type') || ''

    // Cloudflare WAF block page from api.2nr.xyz
    if (
      ct.includes('text/html') ||
      preview.includes('Attention Required') ||
      preview.includes('you have been blocked') ||
      preview.includes('cf-error-details') ||
      preview.includes('Just a moment') ||
      preview.includes('cf-browser-verification')
    ) {
      return Response.json(
        {
          error:
            'api.2nr.xyz Cloudflare WAF blocked this request (datacenter IP). Official Android app still works on mobile networks.',
          code: 'CF_WAF_BLOCKED',
          ray: preview.match(/Cloudflare Ray ID:.*?([a-f0-9]{16})/i)?.[1] || null,
        },
        {
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': url.origin,
            'Access-Control-Allow-Credentials': 'true',
          },
        }
      )
    }

    const out = new Headers()
    out.set('Content-Type', ct.includes('json') ? ct : 'application/json; charset=utf-8')
    out.set('Access-Control-Allow-Origin', url.origin)
    out.set('Access-Control-Allow-Credentials', 'true')
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
  } catch (e: any) {
    return Response.json(
      {
        error: 'Proxy failed to reach api.2nr.xyz',
        message: e?.message || 'Unknown error',
        code: 'PROXY_ERROR',
      },
      {
        status: 502,
        headers: {
          'Access-Control-Allow-Origin': url.origin,
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    )
  }
}
