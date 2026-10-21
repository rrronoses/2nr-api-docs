import { Link } from 'react-router-dom'
import { MessageSquare, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Messages() {
  const { messages } = useAuth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
        <p className="text-slate-400 mt-1">SMS inbox for all your numbers</p>
      </div>

      <div className="space-y-2">
        {messages.map((msg) => (
          <Link
            key={msg.id}
            to={`/messages/${msg.id}`}
            className="block bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 hover:bg-slate-900/80 transition group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                msg.read ? 'bg-slate-800' : 'bg-primary-500/15'
              }`}>
                <MessageSquare size={18} className={msg.read ? 'text-slate-500' : 'text-primary-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      msg.read ? 'text-slate-300' : 'text-white'
                    }`}>
                      {msg.from}
                    </span>
                    {!msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {new Date(msg.createdAt).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">{msg.body}</p>
                <div className="text-xs text-slate-600 mt-1.5">to {msg.number}</div>
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 mt-3 shrink-0 transition" />
            </div>
          </Link>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
            <MessageSquare size={40} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">No messages yet</p>
            <p className="text-slate-600 text-sm mt-1">Reserve a number to start receiving SMS</p>
          </div>
        )}
      </div>
    </div>
  )
}