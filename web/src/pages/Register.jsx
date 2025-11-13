import React, { useState, useEffect, useMemo } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { registerAdopter, registerStaff } = useAuth()
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

  const isStaffMode = useMemo(() => mode === 'staff', [mode])

  const validate = () => {
    const nextFieldErrors = {}
    if (!email.trim()) nextFieldErrors.email = 'Email is required.'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextFieldErrors.email = 'Enter a valid email.'
    if (!password.trim()) nextFieldErrors.password = 'Password is required.'
    if (password && password.trim().length < 6) nextFieldErrors.password = 'Password must be at least 6 characters.'
    if (isStaffMode) {
      const numericShelterId = Number(shelterId)
      if (!shelterId || Number.isNaN(numericShelterId) || numericShelterId <= 0) {
        nextFieldErrors.shelterId = 'Shelter is required for staff accounts.'
      }
    }
    setFieldErrors(nextFieldErrors)
    return Object.keys(nextFieldErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      if (mode === 'adopter') {
        await registerAdopter({ email: email.trim(), password: password.trim() })
        setSuccess('Adopter account created. You can now log in.')
      } else {
        const payload = { email: email.trim(), password: password.trim(), shelterId: Number(shelterId) }
        await registerStaff(payload)
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
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(120deg, #b7e28f 0%, #8ddeac 38%, #8fd8d9 70%, #9fd6ff 100%)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) 1.1fr',
        borderRadius: 24,
        boxShadow: '0 12px 32px rgba(84, 135, 104, 0.15)',
        overflow: 'hidden',
        background: '#fff',
        maxWidth: 900,
        width: '100%',
      }}>
        <div style={{ position: 'relative', minHeight: 420, background: `url('https://images.unsplash.com/photo-1558944351-cbcbf2525c72?auto=format&fit=crop&w=800&q=80') center/cover` }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(18, 61, 27, 0.6), rgba(18, 61, 27, 0.4))',
            color: '#fff',
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}>
            <div>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999, padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                <span role="img" aria-hidden>🐾</span> Happy Tails
              </div>
              <h2 style={{ fontSize: '1.9rem', margin: '18px 0 12px' }}>Create Account</h2>
              <p style={{ maxWidth: 320, fontSize: '1rem', lineHeight: 1.6 }}>
                Join our community of pet lovers and help animals find their forever homes.
              </p>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
              {['Browse hundreds of adoptable pets', 'Smart matching quiz system', 'Track applications and favorites'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                  <span role="img" aria-hidden>✅</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', background: '#f1efe6', borderRadius: 999, padding: 6, marginBottom: 28 }}>
            <button
              type="button"
              onClick={() => setMode('adopter')}
              style={{
                border: 'none',
                background: mode === 'adopter' ? '#fff' : 'transparent',
                padding: '10px 18px',
                borderRadius: 999,
                fontWeight: 600,
                color: mode === 'adopter' ? '#253b2f' : '#5e7263',
                cursor: 'pointer',
              }}
            >
              Adopter
            </button>
            <button
              type="button"
              onClick={() => setMode('staff')}
              style={{
                border: 'none',
                background: mode === 'staff' ? '#fff' : 'transparent',
                padding: '10px 18px',
                borderRadius: 999,
                fontWeight: 600,
                color: mode === 'staff' ? '#253b2f' : '#5e7263',
                cursor: 'pointer',
              }}
            >
              Shelter Staff
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ borderRadius: 10, border: '1px solid #d6e2d6', padding: '12px 16px', fontSize: '1rem', background: '#fff', fontFamily: 'inherit' }}
              />
              {fieldErrors.email && <span style={{ color: '#d64545', fontSize: '0.85rem' }}>{fieldErrors.email}</span>}
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              Password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ borderRadius: 10, border: '1px solid #d6e2d6', padding: '12px 16px', fontSize: '1rem', background: '#fff', fontFamily: 'inherit' }}
              />
              {fieldErrors.password && <span style={{ color: '#d64545', fontSize: '0.85rem' }}>{fieldErrors.password}</span>}
            </label>
            {isStaffMode && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                Shelter
                {shelters && shelters.length > 0 ? (
                  <select
                    value={shelterId}
                    onChange={e => setShelterId(e.target.value)}
                    required
                    style={{ borderRadius: 10, border: '1px solid #d6e2d6', padding: '12px 16px', fontSize: '1rem', background: '#fff', fontFamily: 'inherit' }}
                  >
                    <option value="">Select your shelter</option>
                    {shelters.map((shelter) => {
                      const value = shelter.shelterId ?? shelter.id
                      const label = shelter.name ?? shelter.shelterName ?? `Shelter ${value}`
                      return (
                        <option key={value ?? label} value={value ?? ''}>
                          {label}
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={shelterId}
                    onChange={e => setShelterId(e.target.value)}
                    placeholder="Enter shelter id (ask admin)"
                    style={{ borderRadius: 10, border: '1px solid #d6e2d6', padding: '12px 16px', fontSize: '1rem', background: '#fff', fontFamily: 'inherit' }}
                  />
                )}
                {fieldErrors.shelterId && <span style={{ color: '#d64545', fontSize: '0.85rem' }}>{fieldErrors.shelterId}</span>}
                <span style={{ fontSize: '0.85rem', color: '#5e7263' }}>If you don't have a shelter id, ask your shelter administrator.</span>
              </label>
            )}
            {error && <div style={{ color: '#d64545', fontSize: '0.95rem' }}>{error}</div>}
            {success && <div style={{ color: '#78c977', fontSize: '0.95rem' }}>{success}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{ border: 'none', borderRadius: 999, padding: '12px 28px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', background: '#78c977', color: '#fff', boxShadow: '0 6px 12px rgba(120, 201, 119, 0.35)', marginBottom: 16 }}
            >
              {loading ? 'Creating…' : mode === 'adopter' ? 'Create adopter account' : 'Create staff account'}
            </button>
            <div style={{ textAlign: 'center', color: '#5e7263', marginTop: 8 }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: '#4f8a3a', fontWeight: 600 }}>Log in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
