import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Phone, MessageSquare, User, LayoutDashboard, LogOut } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/numbers', icon: Phone, label: 'Numbers' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center font-bold text-white">
              2nr
            </div>
            <div>
              <div className="font-semibold text-white">2nr</div>
              <div className="text-xs text-slate-400">Second Number</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}