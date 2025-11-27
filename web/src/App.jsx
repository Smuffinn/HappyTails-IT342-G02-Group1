import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import DiscoverPage from './pages/DiscoverPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Applications from './pages/Applications'
import Shelter from './pages/Shelter'
import ShelterDashboard from './pages/ShelterDashboard'
import AdoptionForm from './pages/AdoptionForm.jsx'
import AdoptionSuccess from './pages/AdoptionSuccess.jsx'
import QuizIntro from './pages/QuizIntro.jsx'
import QuizQuestions from './pages/QuizQuestions.jsx'
import QuizResults from './pages/QuizResults.jsx'
import ShelterDashboard from './pages/ShelterDashboard.jsx'
import './index.css'

function AppShell() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/adoption-form" element={<AdoptionForm />} />
        <Route path="/adoption-success" element={<AdoptionSuccess />} />
        <Route path="/quiz" element={<QuizIntro />} />
        <Route path="/quiz/questions" element={<QuizQuestions />} />
        <Route path="/quiz/results" element={<QuizResults />} />
        <Route path="/shelter/dashboard" element={<ShelterDashboard />} />
      </Route>
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

