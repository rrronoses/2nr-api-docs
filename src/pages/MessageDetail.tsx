import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function MessageDetail() {
  const { id } = useParams()
  const { messages, markMessageRead } = useAuth()
  const navigate = useNavigate()
  const msg = messages.find((m) => m.id === id)

  useEffect(() => {
    if (msg && !msg.read) {
      markMessageRead(msg.id)
    }
  }, [msg])

  if (!msg) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 mb-4">Message not found</p>
        <button onClick={() => navigate('/messages')} className="text-primary-400 hover:underline">
          Back to messages
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Link
        to="/messages"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={16} />
        Back to messages
      </Link>

      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center">
            <MessageSquare size={20} className="text-primary-400" />
          </div>
          <div>
            <div className="font-semibold text-white text-lg">{msg.from}</div>
            <div className="text-sm text-slate-500">
              to {msg.number} ·{' '}
              {new Date(msg.createdAt).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <p className="text-slate-200 leading-relaxed whitespace-pre-line text-[15px]">
            {msg.body}
          </p>
        </div>
      </div>
    </div>
  )
}