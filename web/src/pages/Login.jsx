import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const redirectTo = useMemo(() => {
    const fallback = '/'
    if (location.state?.from) return location.state.from
    return fallback
  }, [location.state])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login({ email, password, rememberMe })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

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
        <div style={{ position: 'relative', minHeight: 420, background: `url('https://images.unsplash.com/photo-1601758066184-07c7110b074f?auto=format&fit=crop&w=800&q=80') center/cover` }}>
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
              <h2 style={{ fontSize: '1.9rem', margin: '18px 0 12px' }}>Welcome Back</h2>
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
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ borderRadius: 10, border: '1px solid #d6e2d6', padding: '12px 16px', fontSize: '1rem', background: '#fff', fontFamily: 'inherit' }}
              />
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', color: '#5e7263' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                Remember me
              </label>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f8a3a',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>
            {error && <div style={{ color: '#d64545', fontSize: '0.95rem' }}>{error}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{ border: 'none', borderRadius: 999, padding: '12px 28px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', background: '#78c977', color: '#fff', boxShadow: '0 6px 12px rgba(120, 201, 119, 0.35)', marginBottom: 16 }}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
            <div style={{ textAlign: 'center', color: '#5e7263', marginTop: 8 }}>
              Don’t have an account?{' '}
              <a href="/register" style={{ color: '#4f8a3a', fontWeight: 600 }}>Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
