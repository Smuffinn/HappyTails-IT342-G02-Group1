import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ background: '#163522', color: '#def7dd', marginTop: 80 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          gap: 48,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          padding: '48px clamp(18px, 4vw, 40px) 24px',
        }}
      >
        <div style={{ flex: 1, minWidth: 200, maxWidth: 340 }}>
          <h4 style={{ marginBottom: 16, fontSize: 18 }}>Happy Tails</h4>
          <p style={{ color: '#b5e6c9', fontSize: 15, lineHeight: 1.6 }}>
            Connecting loving families with shelter animals since 2025. Discover your next best friend
            and build your adoption story with us.
          </p>
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <h4 style={{ marginBottom: 16, fontSize: 17 }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, color: '#b5e6c9' }}>
            <li><Link to="/discover" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Discover Pets</Link></li>
            <li><Link to="/quiz" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Take Quiz</Link></li>
            <li><Link to="/profile" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Profile</Link></li>
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <h4 style={{ marginBottom: 16, fontSize: 17 }}>Resources</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, color: '#b5e6c9' }}>
            <li>Adoption Guide</li>
            <li>Shelter Partners</li>
            <li>Volunteer</li>
            <li>Contact Support</li>
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <h4 style={{ marginBottom: 16, fontSize: 17 }}>Stay Connected</h4>
          <p style={{ color: '#b5e6c9', fontSize: 15, lineHeight: 1.6 }}>
            Get updates on new pets, events, and adoption drives directly to your inbox.
          </p>
          <form style={{ display: 'flex', gap: 8, marginTop: 12 }} onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              style={{
                flex: 1,
                borderRadius: 999,
                border: '1px solid rgba(222, 247, 221, 0.5)',
                padding: '10px 16px',
                background: '#14311d',
                color: '#def7dd',
              }}
            />
            <button
              type="submit"
              style={{
                borderRadius: 999,
                border: 'none',
                padding: '10px 20px',
                background: '#78c977',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Join
            </button>
          </form>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(222, 247, 221, 0.1)', padding: '18px 0', textAlign: 'center', color: '#b5e6c9', fontSize: 14 }}>
        © {currentYear} Happy Tails. All rights reserved. · Privacy Policy · Terms of Service · Cookie Policy
      </div>
    </footer>
  )
}
