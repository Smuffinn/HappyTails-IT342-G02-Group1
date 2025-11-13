import React, { useState, useEffect } from 'react'
import { authService } from '../services/auth'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [mode, setMode] = useState('adopter') // 'adopter' | 'staff'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shelterId, setShelterId] = useState('')
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      if (mode === 'adopter') {
        await authService.registerAdopter({ email, password })
        setSuccess('Adopter account created. You can now log in.')
      } else {
        // register shelter staff
        const payload = { email, password }
        if (shelterId) payload.shelterId = Number(shelterId)
        await authService.registerStaff(payload)
        setSuccess('Shelter staff account created. You can now log in.')
      }
      setTimeout(() => navigate('/login'), 900)
    } catch (err) {
      // backend may return { errors: { field: message } } or { error: message }
      setFieldErrors({})
      if (err && err.errors) {
        setFieldErrors(err.errors)
        setError(null)
      } else {
        setError(err?.message || (err && err.error) || JSON.stringify(err) || String(err))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    // Load shelters for the staff signup dropdown. If the endpoint fails,
    // keep the field as manual numeric input fallback.
    api
      .get('/shelters')
      .then((res) => {
        if (!mounted) return
        setShelters(res.data || [])
      })
      .catch(() => {
        // ignore errors; fallback to manual input
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>

      {/* mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('adopter')}
          type="button"
          className={`px-3 py-2 rounded-md border ${mode === 'adopter' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700'}`}
        >
          Adopter
        </button>
        <button
          onClick={() => setMode('staff')}
          type="button"
          className={`px-3 py-2 rounded-md border ${mode === 'staff' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700'}`}
        >
          Shelter Staff
        </button>
      </div>

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
          {fieldErrors.email && <div className="text-rose-600 text-sm mt-1">{fieldErrors.email}</div>}
        </label>

        <label className="block">
          <span className="text-sm text-slate-600">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
          />
          {fieldErrors.password && <div className="text-rose-600 text-sm mt-1">{fieldErrors.password}</div>}
        </label>

        {mode === 'staff' && (
          <label className="block">
            <span className="text-sm text-slate-600">Shelter</span>
            {shelters && shelters.length > 0 ? (
              <select
                value={shelterId}
                onChange={(e) => setShelterId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Select your shelter</option>
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={shelterId}
                onChange={(e) => setShelterId(e.target.value)}
                placeholder="Enter shelter id (ask admin)"
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-emerald-200"
              />
            )}
            {fieldErrors.shelterId && <div className="text-rose-600 text-sm mt-1">{fieldErrors.shelterId}</div>}
            <p className="text-xs text-slate-400 mt-1">If you don't have a shelter id, ask your shelter administrator.</p>
          </label>
        )}

        {error && <div className="text-rose-600 text-sm">{error}</div>}
        {success && <div className="text-emerald-600 text-sm">{success}</div>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? 'Creating…' : mode === 'adopter' ? 'Create adopter account' : 'Create staff account'}
          </button>
          <a href="/login" className="text-sm text-emerald-600">Already have an account?</a>
        </div>
      </form>
    </main>
  )
}
