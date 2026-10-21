import { MessageSquare, CheckCircle } from 'lucide-react'

const messages = [
  {
    id: '82674150',
    number: '459074453',
    from: 'IMO',
    body: '<#> Your imo verification code is 2584.\nDO NOT share with anyone else to prevent account being compromised.\nLGIS0nvV16S',
    createdAt: '2026-10-21T07:06:01.015Z',
    read: true,
  },
  {
    id: '82674100',
    number: '459197008',
    from: 'WhatsApp',
    body: 'Your WhatsApp code is 847291. Do not share this code with anyone.',
    createdAt: '2026-10-21T06:42:18.000Z',
    read: true,
  },
  {
    id: '82674050',
    number: '450417115',
    from: 'Telegram',
    body: 'Telegram code: 593014\n\nDo not give this code to anyone, even if they say they are from Telegram!',
    createdAt: '2026-10-20T19:15:33.000Z',
    read: true,
  },
]

export default function Messages() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 mt-1">SMS inbox for all your numbers</p>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare size={16} className="text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-white">{msg.from}</div>
                  <div className="text-xs text-slate-500">to {msg.number}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {msg.read && <CheckCircle size={14} className="text-emerald-500" />}
                {new Date(msg.createdAt).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line pl-13">
              {msg.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}