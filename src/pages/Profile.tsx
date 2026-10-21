import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, Shield, Lock, Trash2, X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, changePassword, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPass !== confirmPass) {
      setError('New passwords do not match.')
      return
    }

    setLoading(true)
    const res = await changePassword(oldPass, newPass)
    setLoading(false)

    if (res.success) {
      setSuccess('Password updated successfully.')
      setOldPass('')
      setNewPass('')
      setConfirmPass('')
      setTimeout(() => setShowPasswordModal(false), 1200)
    } else {
      setError(res.error || 'Failed to change password')
    }
  }

  const handleDeleteAccount = async () => {
    await deleteAccount()
    navigate('/')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center">
            <User size={28} className="text-primary-500" />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{user?.email}</div>
            <div className="text-sm text-slate-500">ID: {user?.id}</div>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
          <Row icon={<Mail size={15} />} label="Email" value={user?.email || ''} />
          <Row icon={<Shield size={15} />} label="Status" value={user?.verified ? 'Verified' : 'Unverified'} />
          <Row icon={<Calendar size={15} />} label="Member since" value={memberSince} />
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            setShowPasswordModal(true)
            setError('')
            setSuccess('')
          }}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-left transition"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Lock size={16} className="text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white text-sm">Change password</div>
            <div className="text-xs text-slate-500">Update your account password</div>
          </div>
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-red-200 dark:border-red-900/40 hover:border-red-300 dark:hover:border-red-800/60 text-left transition"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <Trash2 size={16} className="text-red-500 dark:text-red-400" />
          </div>
          <div>
            <div className="font-medium text-red-600 dark:text-red-400 text-sm">Delete account</div>
            <div className="text-xs text-slate-500">Permanently remove your account and data</div>
          </div>
        </button>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {error && <div className="px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">{error}</div>}
              {success && <div className="px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">{success}</div>}

              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1.5">Current password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-primary-500 text-slate-900 dark:text-white text-sm transition"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1.5">New password</label>
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-primary-500 text-slate-900 dark:text-white text-sm transition"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1.5">Confirm new password</label>
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-primary-500 text-slate-900 dark:text-white text-sm transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-medium transition"
              >
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete account?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                This will permanently delete your account, numbers, and messages. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
                >
                  Delete forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="px-6 py-4 flex items-center gap-4">
      <div className="text-slate-500">{icon}</div>
      <div className="flex-1 text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-sm text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}