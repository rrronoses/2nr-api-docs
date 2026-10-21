import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import * as api from '../api/client'

export interface User {
  id: number
  email: string
  verified: boolean
  funds?: number
  status?: number
  createdAt?: string
  role_id?: number
}

export interface NumberItem {
  id: number
  number: string
  name: string
  color: string
  reservationFrom: string
  reservationTo: string
  status: number
  password?: string
}

export interface MessageItem {
  id: string
  numberId: number
  number: string
  from: string
  body: string
  createdAt: string
  read: boolean
}

interface AuthContextType {
  user: User | null
  numbers: NumberItem[]
  messages: MessageItem[]
  loading: boolean
  apiError: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>
  deleteAccount: () => Promise<{ success: boolean; error?: string }>
  reserveNumber: (name: string) => Promise<{ success: boolean; error?: string }>
  deleteNumber: (id: number) => Promise<{ success: boolean; error?: string }>
  refreshNumbers: () => Promise<void>
  refreshMessages: () => Promise<void>
  markMessageRead: (id: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function mapNumbers(raw: any[]): NumberItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((n) => ({
    id: n.number_id ?? n.id,
    number: String(n.number || ''),
    name: n.name || 'Number',
    color: n.color || '#E63147',
    reservationFrom: n.reservation_from || n.reservationFrom || '',
    reservationTo: n.reservation_to || n.reservationTo || '',
    status: n.status ?? 1,
    password: n.password,
  }))
}

function mapMessages(raw: any): MessageItem[] {
  const list = raw?.result || raw?.messages || (Array.isArray(raw) ? raw : [])
  if (!Array.isArray(list)) return []
  return list.map((m: any) => ({
    id: String(m.id),
    numberId: m.number_id ?? m.number?.number_id ?? 0,
    number: m.number?.number || m.number || m.dest_number || '',
    from: m.phone || m.from || m.dest_number || 'Unknown',
    body: m.body || '',
    createdAt: m.created_at || m.createdAt || new Date().toISOString(),
    read: m.status === 1 || m.read === true,
  }))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [numbers, setNumbers] = useState<NumberItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  // Restore session on load
  useEffect(() => {
    const token = localStorage.getItem('2nr_token')
    if (token) {
      refreshProfile().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const refreshProfile = async () => {
    const res = await api.apiGetUserDetails()
    if (res.ok && res.data) {
      const u = Array.isArray(res.data) ? res.data[0] : res.data
      if (u) {
        setUser({
          id: u.id,
          email: u.email,
          verified: u.verified === 1 || u.verified === true,
          funds: u.funds,
          status: u.status,
          createdAt: u.created_at,
          role_id: u.role_id,
        })
        setApiError(null)
        await Promise.all([refreshNumbers(), refreshMessages()])
        return
      }
    }
    // Token invalid
    if (res.status === 401 || res.status === 403) {
      api.setToken(null)
      setUser(null)
    }
  }

  const refreshNumbers = async () => {
    const res = await api.apiGetUserNumbers()
    if (res.ok) {
      setNumbers(mapNumbers(res.data))
    }
  }

  const refreshMessages = async () => {
    const res = await api.apiGetMessages()
    if (res.ok) {
      setMessages(mapMessages(res.data))
    }
  }

  const login = async (email: string, password: string) => {
    const res = await api.apiLogin(email, password)
    if (!res.ok) {
      return { success: false, error: res.error || 'Login failed' }
    }

    // Try to extract token from response body
    const token =
      res.data?.token ||
      res.data?.result?.token ||
      res.data?.[0]?.token
    if (token) api.setToken(token)

    // Some APIs set cookie only — try profile fetch
    await refreshProfile()

    if (!localStorage.getItem('2nr_token') && !user) {
      // Fallback: if body contains user, accept it
      const u = Array.isArray(res.data) ? res.data[0] : res.data?.user || res.data
      if (u?.email || u?.id) {
        setUser({
          id: u.id || 0,
          email: u.email || email,
          verified: true,
          funds: u.funds,
          createdAt: u.created_at,
        })
        return { success: true }
      }
      return {
        success: false,
        error:
          'Login response received but no session token. The API may block browser requests (CORS) or require the official app.',
      }
    }

    return { success: true }
  }

  const register = async (email: string, password: string) => {
    const res = await api.apiRegister(email, password)
    if (!res.ok) {
      return { success: false, error: res.error || 'Registration failed' }
    }

    setPendingEmail(email)
    localStorage.setItem('2nr_pending_email', email)

    // If API returns token immediately (auto-login)
    const token = res.data?.token || res.data?.result?.token
    if (token) {
      api.setToken(token)
      await refreshProfile()
    } else {
      // Create a temporary unverified user state so VerifyEmail page works
      setUser({
        id: 0,
        email,
        verified: false,
        createdAt: new Date().toISOString(),
      })
    }

    return { success: true }
  }

  const verifyEmail = async (token: string) => {
    const email = pendingEmail || localStorage.getItem('2nr_pending_email') || user?.email
    if (!email) return { success: false, error: 'No pending email found.' }

    const res = await api.apiConfirmEmail(email, token)
    if (!res.ok) {
      return { success: false, error: res.error || 'Verification failed' }
    }

    localStorage.removeItem('2nr_pending_email')
    setPendingEmail(null)

    const newToken = res.data?.token || res.data?.result?.token
    if (newToken) api.setToken(newToken)

    await refreshProfile()

    // Mark verified locally if profile didn't update yet
    setUser((prev) => (prev ? { ...prev, verified: true } : prev))

    return { success: true }
  }

  const logout = async () => {
    try {
      await api.apiLogout()
    } catch {}
    api.setToken(null)
    setUser(null)
    setNumbers([])
    setMessages([])
  }

  const changePassword = async (oldPass: string, newPass: string) => {
    const res = await api.apiChangePassword(newPass, newPass, oldPass)
    if (!res.ok) return { success: false, error: res.error || 'Failed to change password' }
    return { success: true }
  }

  const deleteAccount = async () => {
    const res = await api.apiDeactivate()
    api.setToken(null)
    setUser(null)
    setNumbers([])
    setMessages([])
    if (!res.ok) return { success: false, error: res.error }
    return { success: true }
  }

  const reserveNumber = async (name: string) => {
    // Real API requires Play Integrity token — will likely fail from browser
    const res = await api.apiReserveNumber({ name })
    if (!res.ok) {
      return {
        success: false,
        error:
          res.error ||
          'Could not reserve number. The official app requires device integrity (Play Integrity). Web clients are usually blocked.',
      }
    }
    await refreshNumbers()
    await refreshMessages()
    return { success: true }
  }

  const deleteNumber = async (id: number) => {
    const res = await api.apiRemoveNumber(id)
    if (!res.ok) return { success: false, error: res.error || 'Failed to delete number' }
    setNumbers((prev) => prev.filter((n) => n.id !== id))
    return { success: true }
  }

  const markMessageRead = async (id: string) => {
    await api.apiMarkAsRead([id])
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        numbers,
        messages,
        loading,
        apiError,
        login,
        register,
        verifyEmail,
        logout,
        changePassword,
        deleteAccount,
        reserveNumber,
        deleteNumber,
        refreshNumbers,
        refreshMessages,
        markMessageRead,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}