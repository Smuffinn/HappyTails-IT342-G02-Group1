import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DiscoverPage from './pages/DiscoverPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Applications from './pages/Applications'
import Shelter from './pages/Shelter'
import ShelterDashboard from './pages/ShelterDashboard'
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/shelter" element={<Shelter />} />
      <Route path="/shelter/dashboard" element={<ShelterDashboard />} />
    </Routes>
  )
}

export default App
