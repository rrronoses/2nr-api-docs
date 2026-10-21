import { useState } from 'react'
import { Phone, Plus, Trash2, Copy, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Numbers() {
  const { numbers, reserveNumber, deleteNumber } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const formatNumber = (n: string) => n.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')

  const handleCopy = (id: number, number: string) => {
    navigator.clipboard.writeText(number)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleReserve = () => {
    reserveNumber(name.trim() || 'My Number')
    setName('')
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this number?')) {
      deleteNumber(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Numbers</h1>
          <p className="text-slate-400 mt-1">Manage your virtual mobile numbers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition shadow-lg shadow-primary-500/20"
        >
          <Plus size={16} />
          Reserve Number
        </button>
      </div>

      <div className="space-y-3">
        {numbers.map((n) => (
          <div
            key={n.id}
            className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between hover:border-slate-700 transition group"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: n.color + '18' }}
              >
                <Phone size={20} style={{ color: n.color }} />
              </div>
              <div>
                <div className="font-semibold text-white text-lg tracking-wide">
                  {formatNumber(n.number)}
                </div>
                <div className="text-sm text-slate-500 mt-0.5">
                  {n.name} · Expires{' '}
                  {new Date(n.reservationTo).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
              <button
                onClick={() => handleCopy(n.id, n.number)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Copy number"
              >
                {copiedId === n.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <button
                onClick={() => handleDelete(n.id)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                title="Delete number"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {numbers.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
            <Phone size={40} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-5">No numbers yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition"
            >
              <Plus size={16} /> Reserve your first number
            </button>
          </div>
        )}
      </div>

      {/* Reserve Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Reserve a Number</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Display name (optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. WhatsApp, Banking..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-primary-500 text-white text-sm placeholder:text-slate-600 transition"
                  autoFocus
                />
              </div>
              <p className="text-xs text-slate-500">
                A random Polish mobile number will be assigned and stay active for 3 days.
              </p>
              <button
                onClick={handleReserve}
                className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition"
              >
                Reserve Number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}