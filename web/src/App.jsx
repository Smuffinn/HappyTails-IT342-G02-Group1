import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DiscoverPage from './pages/DiscoverPage'
import Login from './pages/Login'
import Register from './pages/Register'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
