import { Phone, MessageSquare, Wallet, Clock } from 'lucide-react'

const stats = [
  { label: 'Active Numbers', value: '3', icon: Phone, color: 'text-primary-400' },
  { label: 'Unread Messages', value: '1', icon: MessageSquare, color: 'text-blue-400' },
  { label: 'Balance', value: '0.00', icon: Wallet, color: 'text-emerald-400' },
  { label: 'Days Left', value: '2', icon: Clock, color: 'text-amber-400' },
]

const recentNumbers = [
  { number: '459 197 008', name: 'Gag', expires: '24 Oct 2026', status: 'active' },
  { number: '450 417 115', name: 'Babhw', expires: '24 Oct 2026', status: 'active' },
  { number: '732 078 107', name: 'Hwhahhw', expires: '24 Oct 2026', status: 'active' },
]

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back. Here's an overview of your account.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Numbers */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Your Numbers</h2>
          <span className="text-xs text-slate-500">3 active</span>
        </div>
        <div className="divide-y divide-slate-800">
          {recentNumbers.map((n) => (
            <div key={n.number} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <Phone size={16} className="text-primary-400" />
                </div>
                <div>
                  <div className="font-medium text-white">{n.number}</div>
                  <div className="text-sm text-slate-400">{n.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-300">Expires {n.expires}</div>
                <div className="text-xs text-emerald-400 mt-0.5">Active</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}