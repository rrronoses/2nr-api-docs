import { Link } from 'react-router-dom'
import { Phone, Shield, MessageSquare, Zap, ArrowRight, Check, Ban } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 border-b border-slate-200 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-primary-500/30">
              2nr
            </div>
            <span className="font-semibold text-slate-900 dark:text-white tracking-tight">2nr</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link to="/login" className="px-3 sm:px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
              Log in
            </Link>
            <Link
              to="/register"
              className="px-3 sm:px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition shadow-lg shadow-primary-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-28 pb-16 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs sm:text-sm mb-6 sm:mb-8">
          <Zap size={14} />
          Polish (+48) Virtual Numbers
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-4 sm:mb-6">
          Your second number,<br />
          <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
            ready in seconds
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
          Get temporary <strong className="text-slate-700 dark:text-slate-300">+48 Polish</strong> mobile numbers for SMS verification and privacy.
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap px-2">
          <Link
            to="/register"
            className="group px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition shadow-xl shadow-primary-500/25 flex items-center gap-2 text-sm sm:text-base"
          >
            Create free account
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition" />
          </Link>
          <Link
            to="/login"
            className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 font-medium transition text-sm sm:text-base"
          >
            Log in
          </Link>
        </div>

        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 flex-wrap px-2">
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> +48 only</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Real email</span>
          <span className="flex items-center gap-1.5"><Ban size={14} className="text-amber-500" /> Not for TG / WA</span>
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-28">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <Feature
            icon={<Phone className="text-primary-500" size={22} />}
            title="+48 Polish Numbers"
            desc="Reserve real Polish mobile numbers. Valid for about 3 days with SMS support."
          />
          <Feature
            icon={<MessageSquare className="text-primary-500" size={22} />}
            title="SMS Inbox"
            desc="Receive verification codes in a clean inbox. Open and manage messages easily."
          />
          <Feature
            icon={<Shield className="text-primary-500" size={22} />}
            title="Privacy"
            desc="Keep your personal number private. Good for many services — not Telegram or WhatsApp."
          />
        </div>

        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex gap-3 text-sm text-amber-900 dark:text-amber-200/90">
          <Ban size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <strong>Important:</strong> Numbers from this service are commonly banned on <strong>Telegram</strong> and <strong>WhatsApp</strong>. Do not expect them to work for TG or WA registration / verification.
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/50 py-6 sm:py-8 text-center text-slate-500 text-xs sm:text-sm">
        © 2026 2nr — +48 virtual numbers · Powered by api.2nr.xyz
      </footer>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-4 group-hover:scale-105 transition">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}