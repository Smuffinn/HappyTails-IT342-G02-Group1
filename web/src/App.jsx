import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import DiscoverPage from './pages/DiscoverPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Applications from './pages/Applications'
import './index.css'

function Header() {
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

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/applications" element={<Applications />} />
    </Routes>
  )
}
