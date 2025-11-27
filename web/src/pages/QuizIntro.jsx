import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const cardStyle = {
  background: '#fff',
  borderRadius: 24,
  padding: '36px clamp(24px, 6vw, 48px)',
  boxShadow: '0 16px 40px rgba(84, 135, 104, 0.14)',
  display: 'grid',
  gap: 28,
}

const pillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 999,
  padding: '8px 18px',
  background: '#f1efe6',
  fontWeight: 600,
  color: '#4f8a3a',
}

export default function QuizIntro() {
  const navigate = useNavigate()
  const { isStaff } = useAuth()

  useEffect(() => {
    if (isStaff) {
      navigate('/profile', { replace: true })
    }
  }, [isStaff, navigate])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)' }}>
      <main style={{ maxWidth: 1024, margin: '0 auto', padding: '56px clamp(24px, 7vw, 80px)', display: 'grid', gap: 32 }}>
        <section style={cardStyle}>
          <div style={{ display: 'grid', gap: 16 }}>
            <span style={pillStyle}>
              <span role="img" aria-hidden>
                🐾
              </span>
              Happy Tails Match Quiz
            </span>
            <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#253b2f', letterSpacing: '-0.5px' }}>
              Discover the pet that matches your lifestyle
            </h1>
            <p style={{ margin: 0, color: '#5e7263', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 680 }}>
              Ten quick questions help us understand your routines, home setup, and what makes your heart light up.
              We&apos;ll highlight the pet personalities that thrive with your energy level and daily rhythm, then guide
              you to browse adoptable companions tailored to you.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 18 }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#253b2f' }}>How it works</h2>
            <ol style={{ margin: 0, paddingLeft: 24, color: '#5e7263', display: 'grid', gap: 10 }}>
              <li>Answer ten lifestyle questions – it takes about 3 minutes.</li>
              <li>We translate your answers into five adopter profiles.</li>
              <li>View your matches with tips and suggested search filters.</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/quiz/questions')}
              style={{ padding: '14px 30px', fontSize: 16, borderRadius: 999 }}
            >
              Start the quiz
            </button>
            <Link
              to="/discover"
              className="btn btn-outline"
              style={{ padding: '14px 28px', fontSize: 16, borderRadius: 999, textDecoration: 'none' }}
            >
              Browse pets first
            </Link>
          </div>
        </section>

        <section className="surface-card" style={{ borderRadius: 24, padding: '28px clamp(20px, 5vw, 40px)' }}>
          <h2 style={{ marginTop: 0, color: '#253b2f', fontSize: '1.4rem' }}>What we consider</h2>
          <div style={{ display: 'grid', gap: 12, color: '#5e7263' }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <strong style={{ color: '#4f8a3a' }}>Energy &amp; routine</strong>
              <span>Spare time, activity level, and how structured your days feel.</span>
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
              <strong style={{ color: '#4f8a3a' }}>Home environment</strong>
              <span>Your living space, nearby outdoors, and household members.</span>
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
              <strong style={{ color: '#4f8a3a' }}>Desired connection</strong>
              <span>The kind of companionship, play, or calm presence you love most.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
