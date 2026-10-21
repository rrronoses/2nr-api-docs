import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Phone, MessageSquare, User, LayoutDashboard, LogOut, Bell, Menu, X } from 'lucide-react'
import { useState } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const NavContent = () => (
    <>
      <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
            2nr
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white tracking-tight">2nr</div>
            <div className="text-xs text-slate-500">+48 Second Number</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
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
    </>
  )

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 flex-col shrink-0 transition-colors">
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <NavContent />
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        <header className="h-14 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10 transition-colors">
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="md:hidden font-semibold text-slate-900 dark:text-white">2nr</div>
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
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
          </div>
        </header>
        <div className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}