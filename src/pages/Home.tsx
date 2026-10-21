import { Link } from 'react-router-dom'
import { Phone, Shield, MessageSquare, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-white text-sm">
              2nr
            </div>
            <span className="font-semibold text-white">2nr</span>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition"
          >
            Open App
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-sm mb-6">
          <Zap size={14} />
          Virtual Number Service
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Your second number,<br />
          <span className="text-primary-500">instantly</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Get temporary Polish mobile numbers for SMS verification, calls, and privacy.
          Powered by real-time API and modern infrastructure.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition"
          >
            Get Started Free
          </Link>
          <a
            href="#features"
            className="px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 font-medium transition"
          >
            Learn more
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Phone className="text-primary-500" size={24} />}
            title="Instant Numbers"
            description="Reserve real Polish mobile numbers in seconds. Valid for 3 days with full SMS & call support."
          />
          <FeatureCard
            icon={<MessageSquare className="text-primary-500" size={24} />}
            title="SMS Inbox"
            description="Receive verification codes and messages in real-time. Clean, organized inbox for every number."
          />
          <FeatureCard
            icon={<Shield className="text-primary-500" size={24} />}
            title="Privacy First"
            description="Keep your personal number private. Perfect for registrations, testing, and temporary needs."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 text-center text-slate-500 text-sm">
        <p>© 2026 2nr – Second Number. Built with React + TypeScript.</p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}