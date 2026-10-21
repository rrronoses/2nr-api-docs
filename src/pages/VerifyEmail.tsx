import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import { Mail, CheckCircle, ArrowRight } from 'lucide-react'

export default function VerifyEmail() {
  const { user, verifyEmail } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) handleVerify(token)
  }, [searchParams])

  const handleVerify = async (token: string) => {
    if (!token.trim()) {
      setError('Please enter the verification token from your email.')
      return
    }
    setLoading(true)
    setError('')
    const res = await verifyEmail(token.trim())
    setLoading(false)
    if (res.success) {
      setStatus('success')
      setTimeout(() => navigate('/dashboard'), 1500)
    } else {
      setStatus('error')
      setError(res.error || 'Verification failed')
    }
  }

  if (user?.verified || status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email verified!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 relative py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-500/15 flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-primary-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
          We sent a verification link to<br />
          <span className="text-slate-900 dark:text-white font-medium">{user?.email || localStorage.getItem('2nr_pending_email')}</span>
        </p>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left mb-6 shadow-lg">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Open the email and click the link, or paste the verification token below.
          </p>

          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Paste verification token"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-primary-500 text-slate-900 dark:text-white text-sm mb-3 transition"
          />

          <button
            onClick={() => handleVerify(tokenInput)}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-medium transition flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Verify email'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Already verified?{' '}
          <Link to="/login" className="text-primary-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}