import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Phone, MessageSquare, User, LayoutDashboard, LogOut, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/numbers', icon: Phone, label: 'Numbers' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Layout() {
  const { user, messages, logout } = useAuth()
  const navigate = useNavigate()
  const unread = messages.filter((m) => !m.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 flex flex-col shrink-0 transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
              2nr
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white tracking-tight">2nr</div>
              <div className="text-xs text-slate-500">Second Number</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.to === '/messages' && unread > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-medium">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="h-14 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-end gap-2 px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10 transition-colors">
          {unread > 0 && (
            <button
              onClick={() => navigate('/messages')}
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500" />
            </button>
          )}
          <ThemeToggle />
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}