import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import DiscoverPage from './pages/DiscoverPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import './index.css'

function Header() {
  const token = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('happytails_token')) } catch (e) { return null }
  }, [])

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-emerald-700">Happy Tails</Link>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-sm text-slate-700">Discover</Link>
          {/* Show an explicit Profile link when logged in for discoverability */}
          {token && <Link to="/profile" className="text-sm text-slate-700">Profile</Link>}
          <ProfileMenu />
        </nav>
      </div>
    </header>
  )
}

function ProfileMenu() {
  const [open, setOpen] = React.useState(false)
  const token = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('happytails_token')) } catch (e) { return null }
  }, [])

  function decodeJwt(tokenStr) {
    try {
      const parts = tokenStr.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      return payload
    } catch (e) { return null }
  }

  const payload = React.useMemo(() => token ? decodeJwt(token) : null, [token])
  const initial = payload && payload.sub ? payload.sub.charAt(0).toUpperCase() : (token ? 'U' : '?')

  function logout() {
    localStorage.removeItem('happytails_token')
    // reload so header updates
    window.location.href = '/'
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">{initial}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow py-1">
          {token ? (
            <>
              <Link to="/profile" className="block px-3 py-2 text-sm text-slate-700">Profile</Link>
              <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-rose-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 text-sm text-slate-700">Login</Link>
              <Link to="/register" className="block px-3 py-2 text-sm text-slate-700">Register</Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<DiscoverPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
