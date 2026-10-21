import { useState } from 'react'
import { Phone, Plus, Trash2, Copy, Check } from 'lucide-react'

interface NumberItem {
  id: number
  number: string
  name: string
  color: string
  reservationFrom: string
  reservationTo: string
  status: number
}

const initialNumbers: NumberItem[] = [
  {
    id: 150911,
    number: '459197008',
    name: 'Gag',
    color: '#E63147',
    reservationFrom: '2026-10-21T07:40:17.000Z',
    reservationTo: '2026-10-24T07:40:17.000Z',
    status: 1,
  },
  {
    id: 130017,
    number: '450417115',
    name: 'Babhw',
    color: '#E63147',
    reservationFrom: '2026-10-21T07:40:31.000Z',
    reservationTo: '2026-10-24T07:40:31.000Z',
    status: 1,
  },
  {
    id: 20987,
    number: '732078107',
    name: 'Hwhahhw',
    color: '#E63147',
    reservationFrom: '2026-10-21T07:40:49.000Z',
    reservationTo: '2026-10-24T07:40:49.000Z',
    status: 1,
  },
]

export default function Numbers() {
  const [numbers, setNumbers] = useState(initialNumbers)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const formatNumber = (n: string) =>
    n.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')

  const handleCopy = (id: number, number: string) => {
    navigator.clipboard.writeText(number)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleRemove = (id: number) => {
    if (confirm('Remove this number?')) {
      setNumbers((prev) => prev.filter((n) => n.id !== id))
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Numbers</h1>
          <p className="text-slate-400 mt-1">Manage your virtual mobile numbers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition">
          <Plus size={16} />
          Reserve Number
        </button>
      </div>

      <div className="grid gap-4">
        {numbers.map((n) => (
          <div
            key={n.id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: n.color + '20' }}
              >
                <Phone size={20} style={{ color: n.color }} />
              </div>
              <div>
                <div className="font-semibold text-white text-lg tracking-wide">
                  {formatNumber(n.number)}
                </div>
                <div className="text-sm text-slate-400 mt-0.5">
                  {n.name} · Expires {new Date(n.reservationTo).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(n.id, n.number)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Copy number"
              >
                {copiedId === n.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <button
                onClick={() => handleRemove(n.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                title="Remove number"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {numbers.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Phone size={40} className="mx-auto mb-4 opacity-40" />
            <p>No numbers yet. Reserve your first one.</p>
          </div>
        )}
      </div>
    </div>
  )
}