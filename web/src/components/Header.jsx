import React, { useMemo } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 28,
  fontSize: 15,
}

const navLinkBaseStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  padding: '4px 0',
  textDecoration: 'none',
  color: '#5e7263',
}

const navLinkActiveStyle = {
  color: '#253b2f',
  borderBottom: '2px solid #4f8a3a',
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isStaff, logout, email } = useAuth()

  const navItems = useMemo(() => {
    const items = [
      { to: '/', label: 'Home' },
      { to: '/discover', label: 'Discover Pets' },
    ]

    if (isStaff) {
      items.push({ to: '/applications', label: 'Shelter Applications' })
      items.push({ to: '/shelter/dashboard', label: 'Shelter Dashboard' })
      items.push({ to: '/profile', label: 'Profile' })
    } else {
      items.push({ to: '/applications', label: 'My Applications' })
      items.push({ to: '/profile', label: 'Profile' })
      items.push({ to: '/quiz', label: 'Quiz' })
    }

    return items
  }, [isStaff])

  const handleLogout = () => {
    logout()
  }

  return (
    <header
      style={{
        background: '#f8f4ed',
        borderBottom: '1px solid #e0e4d6',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '18px clamp(18px, 4vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 20, color: '#4f8a3a' }}>Happy Tails</span>
          <span style={{ color: '#5e7263', fontSize: 13 }}>Caring for every paw</span>
        </button>

        <nav style={navContainerStyle}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...navLinkBaseStyle,
                ...(isActive ? navLinkActiveStyle : {}),
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isAuthenticated ? (
            <>
              <span style={{ fontSize: '0.9rem', color: '#5e7263' }}>{email}</span>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid rgba(79, 138, 58, 0.3)',
                  color: '#4f8a3a',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: 999,
                  padding: '8px 18px',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link
                to="/login"
                style={{
                  ...navLinkBaseStyle,
                  color: location.pathname === '/login' ? '#253b2f' : '#4f8a3a',
                  borderBottom: location.pathname === '/login' ? '2px solid #4f8a3a' : 'none',
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: '1px solid rgba(79,138,58,0.3)',
                }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                style={{
                  background: '#78c977',
                  color: '#fff',
                  borderRadius: 999,
                  fontWeight: 600,
                  padding: '8px 22px',
                  textDecoration: 'none',
                  boxShadow: '0 6px 12px rgba(120, 201, 119, 0.35)',
                }}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
