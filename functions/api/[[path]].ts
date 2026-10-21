/**
 * Cloudflare Pages Function – proxies /api/* → https://api.2nr.xyz/*
 * Fixes CORS by making the browser talk same-origin.
 */

interface Env {}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)

  // /api/auth/login → https://api.2nr.xyz/auth/login
  const targetPath = url.pathname.replace(/^\/api/, '') || '/'
  const targetUrl = `https://api.2nr.xyz${targetPath}${url.search}`

  // Clone headers, drop hop-by-hop ones
  const headers = new Headers()
  context.request.headers.forEach((value, key) => {
    const k = key.toLowerCase()
    if (
      k === 'host' ||
      k === 'cf-connecting-ip' ||
      k === 'cf-ray' ||
      k === 'cf-visitor' ||
      k === 'cdn-loop' ||
      k === 'connection' ||
      k === 'content-length'
    ) {
      return
    }
    headers.set(key, value)
  })

  // Ensure JSON content type for POST bodies
  if (!headers.has('content-type') && context.request.method !== 'GET') {
    headers.set('Content-Type', 'application/json; charset=UTF-8')
  }

  // Forward cookie / token headers if present
  const authToken =
    context.request.headers.get('x-auth-token') ||
    extractTokenFromCookie(context.request.headers.get('cookie') || '')

  if (authToken) {
    headers.set('Cookie', `token=${authToken}; x-app-version=52`)
    headers.set('x-auth-token', authToken)
  }

  headers.set('User-Agent', 'okhttp/4.10.0')
  headers.set('Accept', 'application/json')

  let body: ArrayBuffer | undefined
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    body = await context.request.arrayBuffer()
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: context.request.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      redirect: 'follow',
    })

    // Build response headers – allow browser to read them
    const resHeaders = new Headers()
    upstream.headers.forEach((value, key) => {
      const k = key.toLowerCase()
      // Skip encoding / length that can break the response
      if (k === 'content-encoding' || k === 'transfer-encoding' || k === 'content-length') return
      resHeaders.set(key, value)
    })

    // CORS for same-origin is not needed, but add permissive headers anyway
    resHeaders.set('Access-Control-Allow-Origin', url.origin)
    resHeaders.set('Access-Control-Allow-Credentials', 'true')
    resHeaders.set('Access-Control-Expose-Headers', 'set-cookie, x-auth-token')

    // Forward Set-Cookie so frontend can store token if needed
    const setCookie = upstream.headers.get('set-cookie')
    if (setCookie) {
      resHeaders.set('Set-Cookie', setCookie)
    }

    const resBody = await upstream.arrayBuffer()

    // Handle preflight
    if (context.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': url.origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-auth-token, Authorization, Cookie',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    return new Response(resBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: resHeaders,
    })
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: 'Proxy error',
        message: err?.message || 'Failed to reach api.2nr.xyz',
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': url.origin,
        },
      }
    )
  }
}

function extractTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/)
  return match ? match[1] : null
}
