import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function AdoptionSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const [payload, setPayload] = useState(() => {
    if (location.state && typeof location.state === 'object') return location.state
    try {
      const stored = sessionStorage.getItem('happytails_last_adoption')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      return null
    }
  })

  useEffect(() => {
    if (!payload) return
    try {
      sessionStorage.setItem('happytails_last_adoption', JSON.stringify(payload))
    } catch (error) {
      // ignore storage issues
    }
  }, [payload])

  const petName = useMemo(() => payload?.petName || 'your new companion', [payload])
  const headline = useMemo(() => `Application sent for ${petName}!`, [petName])

  if (!payload) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div className="surface-card" style={{ maxWidth: 520, padding: '36px 40px', display: 'grid', gap: 18, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: '#253b2f' }}>We can&apos;t find that confirmation</h1>
          <p style={{ margin: 0, color: '#5e7263' }}>
            It looks like this page was accessed directly. Please submit a new adoption application to see the success summary.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Link to="/discover" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Browse pets
            </Link>
            <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Back home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const submittedAt = payload?.timestamp ? new Date(payload.timestamp) : null
  const submittedDisplay = submittedAt ? submittedAt.toLocaleString() : 'just now'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)' }}>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '60px clamp(24px, 6vw, 80px)', display: 'grid', gap: 28 }}>
        <header style={{ display: 'grid', gap: 16, textAlign: 'center' }}>
          <span className="badge">Adoption application sent</span>
          <h1 style={{ margin: 0, fontSize: '2.6rem', color: '#253b2f' }}>{headline}</h1>
          <p style={{ margin: '0 auto', color: '#5e7263', fontSize: '1.05rem', maxWidth: 640 }}>
            Thank you for opening your heart to {petName}. A shelter team member will review your details shortly and follow-up within 1-3 business days.
          </p>
        </header>

        <section className="surface-card" style={{ padding: '32px clamp(24px, 6vw, 48px)', borderRadius: 28, display: 'grid', gap: 24 }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 140, height: 140, borderRadius: 28, overflow: 'hidden', background: '#f1efe6', display: 'grid', placeItems: 'center', boxShadow: '0 18px 36px rgba(84,135,104,0.18)' }}>
              {payload?.petImage ? (
                <img src={payload.petImage} alt={petName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span role="img" aria-label="Celebration" style={{ fontSize: 48 }}>🎉</span>
              )}
            </div>
            <div style={{ display: 'grid', gap: 10, minWidth: 200 }}>
              <div style={{ color: '#4f8a3a', fontWeight: 700, fontSize: 15 }}>What happens next?</div>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#5e7263', display: 'grid', gap: 8, fontSize: 15, lineHeight: 1.6 }}>
                <li>A shelter coordinator reviews your application and history.</li>
                <li>Expect a call or email within the next few days to chat about compatibility.</li>
                <li>If it&apos;s a match, you&apos;ll schedule a meet-and-greet and finalize adoption paperwork.</li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14, padding: '18px 22px', borderRadius: 20, background: 'rgba(120,201,119,0.12)', color: '#2a5f24' }}>
            <strong style={{ fontSize: 16 }}>Application summary</strong>
            <div style={{ fontSize: 14 }}>Submitted on {submittedDisplay}</div>
            <p style={{ margin: 0, color: '#2a5f24', lineHeight: 1.6 }}>
              Keep an eye on your inbox (and spam folder) for updates. Feel free to reach out to the shelter if you need to share additional information.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link to="/discover" className="btn btn-primary" style={{ textDecoration: 'none', minWidth: 180 }}>
              Browse more pets
            </Link>
            <button
              type="button"
              className="btn btn-outline"
              style={{ minWidth: 180 }}
              onClick={() => navigate('/profile')}
            >
              View my profile
            </button>
          </div>
        </section>

        <section className="surface-card" style={{ padding: '28px clamp(22px, 5vw, 40px)', borderRadius: 26, display: 'grid', gap: 16, color: '#5e7263' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 26 }}>💡</span>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#253b2f' }}>Helpful tips while you wait</h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 10 }}>
            <li>Gather vet references or landlord approvals—shelters often request them.</li>
            <li>Prep a cozy space at home with essentials like food bowls, bedding, and enrichment toys.</li>
            <li>Review our adoption FAQs to know what to expect during meet-and-greets.</li>
          </ul>
          <Link to="/resources" style={{ color: '#4f8a3a', fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
            Explore adoption resources →
          </Link>
        </section>
      </main>
    </div>
  )
}
