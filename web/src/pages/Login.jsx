import React, { useState } from 'react'
import authService, { getUserRoleFromToken } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await authService.login({ email, password })
      // backend now returns { token, tokenType }
      const token = res?.token || res
      if (token) {
        localStorage.setItem('happytails_token', JSON.stringify(token))
      }
      
      // Determine redirect based on user role
      // Give a moment for localStorage to be ready
      setTimeout(() => {
        const role = getUserRoleFromToken()
        if (role === 'staff') {
          navigate('/') // Staff goes to Discover/Applications page
        } else {
          navigate('/profile') // Adopters go to Profile
        }
      }, 100)
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Log in</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-slate-600">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-600">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        {error && <div className="text-rose-600 text-sm">{error}</div>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
          <a href="/register" className="text-sm text-emerald-600">Create account</a>
        </div>
      </form>
    </main>
  )
}
