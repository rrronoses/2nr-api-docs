/**
 * Cloudflare Pages Function – proxies /api/* → https://api.2nr.xyz/*
 */

interface Env {}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)

  // Preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(url.origin),
    })
  }

  const targetPath = url.pathname.replace(/^\/api/, '') || '/'
  const targetUrl = `https://api.2nr.xyz${targetPath}${url.search}`

  // Build headers that closely match the official Android app (from HAR)
  const headers = new Headers()
  headers.set('User-Agent', 'okhttp/4.10.0')
  headers.set('Accept', 'application/json')
  headers.set('Accept-Encoding', 'gzip')
  headers.set('Content-Type', 'application/json; charset=UTF-8')
  headers.set('Connection', 'Keep-Alive')

  // Forward auth token
  const incomingCookie = context.request.headers.get('cookie') || ''
  const authToken =
    context.request.headers.get('x-auth-token') ||
    extractTokenFromCookie(incomingCookie)

  if (authToken) {
    headers.set('Cookie', `token=${authToken}; x-app-version=52`)
    headers.set('x-auth-token', authToken)
  }

  let body: ArrayBuffer | undefined
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    body = await context.request.arrayBuffer()
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: context.request.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      redirect: 'manual',
      // cf options – try to reduce bot score issues
      cf: {
        cacheTtl: 0,
        cacheEverything: false,
      },
    })

    const contentType = upstream.headers.get('content-type') || ''
    const resBody = await upstream.arrayBuffer()
    const textPreview = new TextDecoder().decode(resBody.slice(0, 500))

    // Detect Cloudflare block / challenge HTML pages
    if (
      contentType.includes('text/html') ||
      textPreview.includes('Attention Required') ||
      textPreview.includes('you have been blocked') ||
      textPreview.includes('cf-error-details') ||
      textPreview.includes('Just a moment')
    ) {
      return json(
        {
          error:
            'API blocked by Cloudflare protection. The server is rejecting requests from this hosting environment (datacenter IP). The official mobile app may still work.',
          code: 'CF_BLOCKED',
          status: upstream.status,
        },
        403,
        url.origin
      )
    }

    const resHeaders = new Headers()
    resHeaders.set('Content-Type', contentType || 'application/json; charset=utf-8')
    Object.entries(corsHeaders(url.origin)).forEach(([k, v]) => resHeaders.set(k, v))

    // Forward useful headers
    const setCookie = upstream.headers.get('set-cookie')
    if (setCookie) {
      resHeaders.set('Set-Cookie', setCookie)
      // Also expose token in a readable header for the SPA
      const match = setCookie.match(/token=([^;]+)/)
      if (match) {
        resHeaders.set('x-auth-token', match[1])
        resHeaders.set('Access-Control-Expose-Headers', 'x-auth-token, set-cookie')
      }
    }

    return new Response(resBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: resHeaders,
    })
  } catch (err: any) {
    return json(
      {
        error: 'Proxy error',
        message: err?.message || 'Failed to reach api.2nr.xyz',
        code: 'PROXY_ERROR',
      },
      502,
      url.origin
    )
  }
}

function extractTokenFromCookie(cookie: string): string | null {
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/)
  return match ? match[1] : null
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token, Authorization, Cookie',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }
}

function json(data: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  })
}
