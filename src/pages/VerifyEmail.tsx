import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, CheckCircle, ArrowRight } from 'lucide-react'

export default function VerifyEmail() {
  const { user, verifyEmail } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState('')
  const [tokenInput, setTokenInput] = useState('')

  // Auto-verify if token is in URL
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      handleVerify(token)
    }
  }, [searchParams])

  const handleVerify = async (token: string) => {
    const res = await verifyEmail(token)
    if (res.success) {
      setStatus('success')
      setTimeout(() => navigate('/dashboard'), 1500)
    } else {
      setStatus('error')
      setError(res.error || 'Verification failed')
    }
  }

  // For demo: show the token so user can "click" it
  const demoToken = localStorage.getItem('2nr_verify_token') || ''

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No pending registration found.</p>
          <Link to="/register" className="text-primary-400 hover:underline">Register</Link>
        </div>
      </div>
    )
  }

  if (user.verified || status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email verified!</h1>
          <p className="text-slate-400 mb-6">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-primary-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-500/15 flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-primary-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          We sent a verification link to<br />
          <span className="text-white font-medium">{user.email}</span>
        </p>

        {/* Demo box – in real app this would be an actual email */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-left mb-6">
          <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Demo verification</div>
          <p className="text-sm text-slate-300 mb-4">
            Because this is a frontend-only demo, click the button below to simulate opening the email link.
          </p>
          <button
            onClick={() => handleVerify(demoToken)}
            className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition flex items-center justify-center gap-2"
          >
            Verify email address
            <ArrowRight size={16} />
          </button>
        </div>

        {status === 'error' && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <p className="text-xs text-slate-600">
          Didn't receive it? Check spam or{' '}
          <button onClick={() => window.location.reload()} className="text-primary-400 hover:underline">
            resend
          </button>
        </p>
      </div>
    </div>
  )
}