import { User, Mail, Calendar, Shield } from 'lucide-react'

export default function Profile() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 mt-1">Your account details</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center">
            <User size={28} className="text-primary-400" />
          </div>
          <div>
            <div className="text-lg font-semibold text-white">pinkjaquith@maxxspace.com</div>
            <div className="text-sm text-slate-400">User ID: 19202010</div>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          <InfoRow icon={<Mail size={16} />} label="Email" value="pinkjaquith@maxxspace.com" />
          <InfoRow icon={<Shield size={16} />} label="Status" value="Active · Not verified" />
          <InfoRow icon={<Calendar size={16} />} label="Member since" value="21 Oct 2026" />
          <InfoRow icon={<User size={16} />} label="Role" value="Standard User" />
        </div>
      </div>

      <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Pricing (internal units)</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">SMS</span>
            <span className="text-white font-mono">1 000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">MMS</span>
            <span className="text-white font-mono">5 000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Activation</span>
            <span className="text-white font-mono">290 000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Call / sec</span>
            <span className="text-white font-mono">17</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="px-6 py-4 flex items-center gap-4">
      <div className="text-slate-500">{icon}</div>
      <div className="flex-1 text-sm text-slate-400">{label}</div>
      <div className="text-sm text-white">{value}</div>
    </div>
  )
}