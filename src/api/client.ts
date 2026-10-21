// Use same-origin proxy to avoid CORS
// Browser → /api/... → Cloudflare Function → https://api.2nr.xyz/...
const BASE = '/api'

export type ApiResult<T = any> = {
  ok: boolean
  data?: T
  error?: string
  status?: number
}

function getToken(): string | null {
  return localStorage.getItem('2nr_token')
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('2nr_token', token)
  else localStorage.removeItem('2nr_token')
}

async function request<T = any>(
  path: string,
  body: Record<string, any>,
  opts: { auth?: boolean } = { auth: true }
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
    }

    const token = getToken()
    if (opts.auth && token) {
      headers['x-auth-token'] = token
      headers['Cookie'] = `token=${token}; x-app-version=52`
    }

    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    })

    // Try to capture token from response headers
    const setCookie = res.headers.get('set-cookie')
    if (setCookie) {
      const match = setCookie.match(/token=([^;]+)/)
      if (match) setToken(match[1])
    }

    let data: any = null
    const text = await res.text()
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }

    if (!res.ok) {
      const errMsg =
        data?.error ||
        data?.message ||
        (typeof data === 'string' ? data : null) ||
        `Request failed (${res.status})`
      return { ok: false, error: errMsg, status: res.status, data }
    }

    // Token inside body
    if (data?.token) setToken(data.token)
    if (data?.result?.token) setToken(data.result.token)
    if (Array.isArray(data) && data[0]?.token) setToken(data[0].token)

    return { ok: true, data, status: res.status }
  } catch (e: any) {
    return {
      ok: false,
      error: e?.message?.includes('Failed to fetch')
        ? 'Network error. Please check your connection and try again.'
        : e?.message || 'Network error',
    }
  }
}

// ── Auth ──────────────────────────────────────────────

export async function apiRegister(email: string, password: string) {
  return request(
    '/auth/register',
    {
      id: 103,
      email,
      password,
      terms_version: '1',
    },
    { auth: false }
  )
}

export async function apiLogin(email: string, password: string) {
  return request(
    '/auth/login',
    {
      id: 101,
      email,
      password,
      language: 'en',
    },
    { auth: false }
  )
}

export async function apiConfirmEmail(email: string, token: string) {
  return request(
    '/auth/confirm',
    {
      id: 104,
      email,
      token,
    },
    { auth: false }
  )
}

export async function apiChangePassword(
  password: string,
  password_confirm: string,
  old_password: string
) {
  return request('/auth/password', {
    id: 105,
    password,
    password_confirm,
    old_password,
  })
}

export async function apiLogout() {
  const res = await request('/auth/logout', { id: 102 })
  setToken(null)
  return res
}

// ── User ──────────────────────────────────────────────

export async function apiGetUserDetails() {
  return request('/user/getUserDetails', { id: 203 })
}

export async function apiDeactivate() {
  return request('/user/deactivate', { id: 206 })
}

// ── Numbers ───────────────────────────────────────────

export async function apiGetUserNumbers() {
  return request('/numbers/getUserNumbers', { id: 302 })
}

export async function apiReserveNumber(payload: {
  name: string
  number_id?: number
  integrity_token?: string
  nonce?: string
}) {
  return request('/numbers/reserveNumber', {
    id: 301,
    query: {
      availability_days: [1, 2, 3, 4, 5, 6, 7],
      color: '#E63147',
      hour_from: null,
      hour_to: null,
      marketing: true,
      name: payload.name || 'My Number',
      number_id: payload.number_id,
      integrity_token: payload.integrity_token || '',
      nonce: payload.nonce || btoa(String(Date.now())).replace(/=/g, ''),
    },
  })
}

export async function apiRemoveNumber(number_id: number) {
  return request('/numbers/removeNumber', {
    id: 304,
    query: { number_id },
  })
}

// ── SMS ───────────────────────────────────────────────

export async function apiGetUnreadCount() {
  return request('/sms/getUnreadMessageCount', { id: 411 })
}

export async function apiGetMessages() {
  return request('/sms/get', { id: 400 })
}

export async function apiGetMessagesFiltered(number_id: number, phone?: string) {
  return request('/sms/get', {
    id: 409,
    query: { number_id, phone },
  })
}

export async function apiMarkAsRead(message_ids: (string | number)[]) {
  return request('/sms/markAsRead', {
    id: 410,
    query: { message_id: message_ids },
  })
}

// ── Shop ──────────────────────────────────────────────

export async function apiGetShopItems() {
  return request('/shop/getShopItems', { id: 507 })
}
