import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import DiscoverPage from './pages/DiscoverPage'
import Login from './pages/Login'
import Register from './pages/Register'
import './index.css'

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-emerald-700">Happy Tails</Link>
        <nav className="space-x-4">
          <Link to="/" className="text-sm text-slate-700">Discover</Link>
          <Link to="/login" className="text-sm text-slate-700">Login</Link>
          <Link to="/register" className="text-sm text-slate-700">Register</Link>
        </nav>
      </div>
    </header>
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
      </Routes>
    </BrowserRouter>
  )
}
