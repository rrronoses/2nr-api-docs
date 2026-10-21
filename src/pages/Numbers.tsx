import { useState } from 'react'
import { Phone, Plus, Trash2, Copy, Check, X, AlertTriangle, Ban } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Numbers() {
  const { numbers, reserveNumber, deleteNumber, refreshNumbers } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const formatNumber = (n: string) => {
    const digits = n.replace(/\D/g, '')
    // Display as +48 XXX XXX XXX
    if (digits.length === 9) return `+48 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
    if (digits.startsWith('48') && digits.length === 11)
      return `+48 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
    return n.startsWith('+') ? n : `+48 ${n}`
  }

  const handleCopy = (id: number, number: string) => {
    const full = number.replace(/\D/g, '').length === 9 ? `+48${number}` : number
    navigator.clipboard.writeText(full.startsWith('+') ? full : `+48${number.replace(/\D/g, '')}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleReserve = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    const res = await reserveNumber(name.trim() || 'My Number')
    setLoading(false)
    if (res.success) {
      setSuccess('Number reserved successfully!')
      setName('')
      setTimeout(() => {
        setShowModal(false)
        setSuccess('')
      }, 1200)
    } else {
      setError(res.error || 'Failed to reserve number')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this number?')) return
    const res = await deleteNumber(id)
    if (!res.success) alert(res.error || 'Failed to delete')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Numbers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Polish (+48) virtual mobile numbers only</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setError(''); setSuccess('') }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition shadow-lg shadow-primary-500/20 w-full sm:w-auto"
        >
          <Plus size={16} />
          Reserve Number
        </button>
      </div>

      {/* Important warnings */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <Ban size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200/90">
            <strong>Telegram & WhatsApp:</strong> These numbers are frequently banned / blocked on Telegram and WhatsApp. They usually do <strong>not</strong> work for TG or WA account verification.
          </div>
        </div>
        <div className="flex gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <AlertTriangle size={18} className="text-slate-500 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-600 dark:text-slate-400">
            All numbers are <strong>+48 (Poland)</strong> only. Reservation from the website may fail because the official API requires Android Play Integrity attestation.
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {numbers.map((n) => (
          <div
            key={n.id}
            className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition group"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: (n.color || '#E63147') + '18' }}
              >
                <Phone size={18} style={{ color: n.color || '#E63147' }} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg tracking-wide truncate">
                  {formatNumber(n.number)}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                  {n.name}
                  {n.reservationTo && (
                    <> · Expires {new Date(n.reservationTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 self-end sm:self-center">
              <button
                onClick={() => handleCopy(n.id, n.number)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Copy +48 number"
              >
                {copiedId === n.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
              <button
                onClick={() => handleDelete(n.id)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                title="Delete number"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {numbers.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-slate-100/50 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
            <Phone size={40} className="mx-auto mb-4 text-slate-400 dark:text-slate-600" />
            <p className="text-slate-500 mb-5">No +48 numbers yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition"
            >
              <Plus size={16} /> Reserve your first number
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">Reserve +48 Number</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              {error && (
                <div className="px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
                  {success}
                </div>
              )}

              <div className="flex gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
                <Ban size={14} className="shrink-0 mt-0.5" />
                Not suitable for Telegram or WhatsApp (numbers are banned there).
              </div>

              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1.5">Display name (optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Banking, Shopping..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-primary-500 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 transition"
                  autoFocus
                />
              </div>
              <p className="text-xs text-slate-500">
                You will receive a Polish (+48) mobile number, active for ~3 days.
              </p>
              <button
                onClick={handleReserve}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-medium transition"
              >
                {loading ? 'Reserving...' : 'Reserve +48 Number'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}