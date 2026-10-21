import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface User {
  id: number
  email: string
  verified: boolean
  createdAt: string
}

export interface NumberItem {
  id: number
  number: string
  name: string
  color: string
  reservationFrom: string
  reservationTo: string
  status: number
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>
  deleteAccount: () => void
  reserveNumber: (name: string) => void
  deleteNumber: (id: number) => void
  markMessageRead: (id: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = '2nr_app_data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveData(data: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [numbers, setNumbers] = useState<NumberItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')

  useEffect(() => {
    const data = loadData()
    if (data?.user) {
      setUser(data.user)
      setNumbers(data.numbers || [])
      setMessages(data.messages || [])
      setPassword(data.password || '')
    }
    setLoading(false)
  }, [])

  const persist = (u: User | null, nums: NumberItem[], msgs: MessageItem[], pass: string) => {
    saveData({ user: u, numbers: nums, messages: msgs, password: pass })
  }

  const login = async (email: string, pass: string) => {
    const data = loadData()
    if (!data || data.user?.email !== email) {
      return { success: false, error: 'Account not found. Please register first.' }
    }
    if (data.password !== pass) {
      return { success: false, error: 'Incorrect password.' }
    }
    setUser(data.user)
    setNumbers(data.numbers || [])
    setMessages(data.messages || [])
    setPassword(pass)
    return { success: true }
  }

  const register = async (email: string, pass: string) => {
    const data = loadData()
    if (data?.user?.email === email) {
      return { success: false, error: 'Email already registered.' }
    }

    // Password complexity check (same as real API)
    const hasUpper = /[A-Z]/.test(pass)
    const hasLower = /[a-z]/.test(pass)
    const hasDigit = /[0-9]/.test(pass)
    const hasSpecial = /[?!@#$%^&*()<>+{}|_-]/.test(pass)
    if (pass.length < 6 || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      return {
        success: false,
        error: 'Password must be 6+ chars with uppercase, lowercase, number and special character.',
      }
    }

    const newUser: User = {
      id: Math.floor(Math.random() * 90000000) + 10000000,
      email,
      verified: false,
      createdAt: new Date().toISOString(),
    }

    // Simulate verification token
    const token = btoa(email + ':' + Date.now()).replace(/=/g, '')
    localStorage.setItem('2nr_verify_token', token)
    localStorage.setItem('2nr_pending_email', email)

    setUser(newUser)
    setPassword(pass)
    setNumbers([])
    setMessages([])
    persist(newUser, [], [], pass)

    return { success: true }
  }

  const verifyEmail = async (token: string) => {
    const stored = localStorage.getItem('2nr_verify_token')
    if (!stored || stored !== token) {
      return { success: false, error: 'Invalid or expired verification link.' }
    }

    if (!user) return { success: false, error: 'No pending registration.' }

    const verifiedUser = { ...user, verified: true }
    setUser(verifiedUser)
    persist(verifiedUser, numbers, messages, password)
    localStorage.removeItem('2nr_verify_token')
    localStorage.removeItem('2nr_pending_email')
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    // keep data in localStorage so user can log back in
  }

  const changePassword = async (oldPass: string, newPass: string) => {
    if (oldPass !== password) return { success: false, error: 'Current password is incorrect.' }
    if (newPass.length < 6) return { success: false, error: 'New password too short.' }
    setPassword(newPass)
    persist(user, numbers, messages, newPass)
    return { success: true }
  }

  const deleteAccount = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('2nr_verify_token')
    localStorage.removeItem('2nr_pending_email')
    setUser(null)
    setNumbers([])
    setMessages([])
    setPassword('')
  }

  const reserveNumber = (name: string) => {
    const prefixes = ['459', '450', '732', '501', '602', '783']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const rest = Math.floor(Math.random() * 900000 + 100000).toString()
    const number = prefix + rest

    const now = new Date()
    const to = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    const newNum: NumberItem = {
      id: Math.floor(Math.random() * 900000) + 10000,
      number,
      name: name || 'My Number',
      color: '#E63147',
      reservationFrom: now.toISOString(),
      reservationTo: to.toISOString(),
      status: 1,
    }

    const updated = [newNum, ...numbers]
    setNumbers(updated)

    // Add a sample welcome message
    const welcomeMsg: MessageItem = {
      id: Date.now().toString(),
      numberId: newNum.id,
      number: newNum.number,
      from: '2nr',
      body: `Welcome! Your number ${number} is now active for 3 days. You can receive SMS and calls.`,
      createdAt: now.toISOString(),
      read: false,
    }
    const updatedMsgs = [welcomeMsg, ...messages]
    setMessages(updatedMsgs)

    persist(user, updated, updatedMsgs, password)
  }

  const deleteNumber = (id: number) => {
    const updated = numbers.filter((n) => n.id !== id)
    setNumbers(updated)
    persist(user, updated, messages, password)
  }

  const markMessageRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m))
    setMessages(updated)
    persist(user, numbers, updated, password)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        numbers,
        messages,
        loading,
        login,
        register,
        verifyEmail,
        logout,
        changePassword,
        deleteAccount,
        reserveNumber,
        deleteNumber,
        markMessageRead,
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