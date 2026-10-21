import { Link } from 'react-router-dom'
import { Phone, MessageSquare, Wallet, Clock, ArrowRight, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, numbers, messages } = useAuth()
  const unread = messages.filter((m) => !m.read).length

  const stats = [
    { label: 'Active Numbers', value: numbers.length.toString(), icon: Phone, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { label: 'Unread Messages', value: unread.toString(), icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Balance', value: '0.00', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Account Age', value: user ? Math.max(1, Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000)) + 'd' : '—', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, {user?.email.split('@')[0]}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon size={15} className={s.color} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Numbers preview */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
            <h2 className="font-semibold text-white">Your Numbers</h2>
            <Link to="/numbers" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {numbers.length === 0 ? (
            <div className="p-8 text-center">
              <Phone size={28} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-500 text-sm mb-4">No numbers yet</p>
              <Link
                to="/numbers"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition"
              >
                <Plus size={14} /> Reserve Number
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {numbers.slice(0, 3).map((n) => (
                <div key={n.id} className="px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white tracking-wide">
                      {n.number.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}
                    </div>
                    <div className="text-xs text-slate-500">{n.name}</div>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages preview */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Messages</h2>
            <Link to="/messages" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No messages yet
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {messages.slice(0, 3).map((m) => (
                <Link
                  key={m.id}
                  to={`/messages/${m.id}`}
                  className="block px-5 py-3.5 hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white text-sm">{m.from}</span>
                    {!m.read && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{m.body}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}