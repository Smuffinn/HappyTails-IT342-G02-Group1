import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { QUIZ_CATEGORIES } from '../data/quizConfig'

const STORAGE_KEY = 'happytails_quiz_payload'

const cardStyle = {
  background: '#fff',
  borderRadius: 26,
  padding: '32px clamp(22px, 6vw, 48px)',
  boxShadow: '0 16px 40px rgba(84,135,104,0.12)',
  display: 'grid',
  gap: 24,
}

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 14px',
  borderRadius: 999,
  background: '#f1efe6',
  color: '#4f8a3a',
  fontWeight: 600,
  fontSize: 13,
}

export default function QuizResults() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isStaff } = useAuth()
  const [payload, setPayload] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isStaff) {
      navigate('/profile', { replace: true })
      return
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) {
        setError('We couldn\'t find your quiz answers. Please retake the quiz to see your matches.')
        return
      }
      const parsed = JSON.parse(raw)
      setPayload(parsed)
    } catch (err) {
      console.error('Unable to read quiz results', err)
      setError('Something went wrong while loading your quiz results. Please try again.')
    }
  }, [isStaff, location.key, navigate])

  const topCategories = useMemo(() => {
    if (!payload?.topCategories) return []
    return payload.topCategories
      .map((categoryId) => QUIZ_CATEGORIES[categoryId])
      .filter(Boolean)
  }, [payload])

  const rankedTotals = useMemo(() => {
    if (!payload?.totals) return []
    return Object.entries(payload.totals)
      .map(([categoryId, score]) => ({
        category: QUIZ_CATEGORIES[categoryId],
        score,
      }))
      .filter(({ category }) => Boolean(category))
      .sort((a, b) => b.score - a.score)
  }, [payload])

  const handleRetake = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      // ignore
    }
    navigate('/quiz/questions', { replace: true })
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div className="surface-card" style={{ maxWidth: 520, padding: '36px 40px', display: 'grid', gap: 20, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.9rem', color: '#253b2f' }}>Let’s try that again</h1>
          <p style={{ margin: 0, color: '#5e7263' }}>{error}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button type="button" className="btn btn-primary" onClick={handleRetake}>
              Retake quiz
            </button>
            <Link to="/discover" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Browse pets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!payload || !topCategories.length) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div className="surface-card" style={{ maxWidth: 520, padding: '36px 40px', display: 'grid', gap: 18, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#253b2f' }}>Ready to meet your match?</h1>
          <p style={{ margin: 0, color: '#5e7263' }}>
            Take the Happy Tails quiz to see pet personalities tailored to your lifestyle.
          </p>
          <button type="button" className="btn btn-primary" onClick={handleRetake}>
            Start the quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)' }}>
      <main style={{ maxWidth: 1024, margin: '0 auto', padding: '48px clamp(24px, 6vw, 72px)', display: 'grid', gap: 32 }}>
        <header style={{ display: 'grid', gap: 14 }}>
          <span className="badge">Your Happy Tails Matches</span>
          <h1 style={{ margin: 0, fontSize: '2.4rem', color: '#253b2f' }}>Here’s who will thrive with you</h1>
          <p style={{ margin: 0, color: '#5e7263', fontSize: '1.05rem', lineHeight: 1.7 }}>
            These profiles balance your energy, home environment, and the type of companionship you love. Explore the
            highlights and try the suggested filters to browse adoptable pets that fit your vibe.
          </p>
        </header>

        <section style={{ display: 'grid', gap: 24 }}>
          {topCategories.map((category) => (
            <article key={category.id} style={cardStyle}>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ ...chipStyle, background: 'rgba(120, 201, 119, 0.14)' }}>Match</span>
                  <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#253b2f' }}>{category.title}</h2>
                </div>
                <p style={{ margin: 0, color: '#5e7263', fontSize: '1.05rem', lineHeight: 1.7 }}>{category.description}</p>
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                <strong style={{ color: '#4f8a3a' }}>Why it works:</strong>
                <ul style={{ margin: 0, paddingLeft: 20, color: '#5e7263', display: 'grid', gap: 8 }}>
                  {category.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>

              {category.suggestedFilters && (
                <div style={{ display: 'grid', gap: 12 }}>
                  <strong style={{ color: '#4f8a3a' }}>Suggested filters:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {Object.entries(category.suggestedFilters).map(([filterKey, filterValue]) => (
                      <span key={filterKey} style={chipStyle}>
                        {filterKey === 'minAgeLabel'
                          ? `Age: ${filterValue}+`
                          : `${filterKey[0].toUpperCase()}${filterKey.slice(1)}: ${filterValue}`}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/discover"
                    className="btn btn-outline"
                    style={{ maxWidth: 200, textAlign: 'center', textDecoration: 'none' }}
                  >
                    Explore matching pets
                  </Link>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="surface-card" style={{ borderRadius: 24, padding: '26px clamp(20px, 5vw, 40px)', display: 'grid', gap: 12, color: '#5e7263' }}>
          <h2 style={{ marginTop: 0, color: '#253b2f', fontSize: '1.2rem' }}>Full results snapshot</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {rankedTotals.map(({ category, score }) => (
              <div key={category.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: '0 0 220px', fontWeight: 600, color: '#253b2f' }}>{category.title}</div>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: '#edf1e3', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: `${(score / (payload?.answers?.length * 3 || 1)) * 100}%`, background: '#78c977', height: '100%' }} />
                </div>
                <span style={{ fontWeight: 600, color: '#4f8a3a', minWidth: 32, textAlign: 'right' }}>{score}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={handleRetake}>
            Retake quiz
          </button>
          <Link to="/discover" className="btn btn-outline" style={{ textDecoration: 'none' }}>
            Start browsing pets
          </Link>
          <Link to="/profile" className="btn btn-outline" style={{ textDecoration: 'none' }}>
            Update my adopter profile
          </Link>
        </section>
      </main>
    </div>
  )
}
