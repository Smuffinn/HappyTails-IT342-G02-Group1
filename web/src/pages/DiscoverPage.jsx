import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { petService } from '../services/petservice'
import PetQuickView from '../modules/pets/PetQuickView.jsx'

	const mockPets = [
	{
		id: 1,
		name: 'Luna',
		breed: 'Golden Retriever',
		age: '2 years',
		size: 'large',
    imageUrl: 'https://th.bing.com/th/id/OIP.hp6wntBrX3zPMbVAhZoQWwHaE8?w=225&h=150&c=6&o=7&cb=ucfimgc2&pid=1.7&rm=3',
		tags: ['Friendly', 'Playful'],
	},
	{
		id: 2,
		name: 'Whiskers',
		breed: 'Tabby Mix',
		age: '3 years',
		size: 'medium',
		imageUrl: 'https://th.bing.com/th/id/OIP.AnRS1uTadgQyx81IvPDPBwHaIt?w=160&h=189&c=7&r=0&o=7&cb=ucfimgc2&pid=1.7&rm=3',
		tags: ['Independent', 'Calm'],
	},
	{
		id: 3,
		name: 'Max',
		breed: 'Beagle',
		age: '4 years',
		size: 'medium',
		imageUrl: 'https://th.bing.com/th/id/OIP.XjToZ5NEW-BeUEt1vpOs2QAAAA?w=266&h=180&c=7&r=0&o=7&cb=ucfimgc2&pid=1.7&rm=3',
		tags: ['Curious', 'Friendly'],
	},
	{
		id: 4,
		name: 'Mittens',
		breed: 'Siamese',
		age: '1 year',
		size: 'small',
		imageUrl: 'https://th.bing.com/th/id/OIP.dY3AAJfRysMpKAKDumWsXgHaE8?w=291&h=194&c=7&r=0&o=7&cb=ucfimgc2&pid=1.7&rm=3',
		tags: ['Vocal', 'Social'],
	},
	{
		id: 5,
		name: 'Bella',
		breed: 'French Bulldog',
		age: '3 years',
		size: 'small',
		imageUrl: 'https://th.bing.com/th/id/OIP.nRHf8xBDkSYBFZniCuwrKAHaEo?w=284&h=180&c=7&r=0&o=7&cb=ucfimgc2&pid=1.7&rm=3',
		tags: ['Affectionate', 'Playful'],
	},
	{
		id: 6,
		name: 'Charlie',
		breed: 'Labrador Mix',
		age: '5 years',
		size: 'large',
		imageUrl: 'https://th.bing.com/th/id/OIP.Ogz6aSgh_DXZhIl-yD-KGAHaFA?w=222&h=150&c=6&o=7&cb=ucfimgc2&pid=1.7&rm=3',
		tags: ['Loyal', 'Calm'],
	},
]

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, email, logout } = useAuth();
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [quickViewPet, setQuickViewPet] = useState(null)

  const featuredPetsDisplay = useMemo(() => {
    if (pets.length >= 6) return pets;
    const needed = 6 - pets.length;
    return [...pets, ...pets.slice(0, needed)];
  }, [pets]);

  useEffect(() => {
    let mounted = true
    async function loadPets() {
      try {
        const data = await petService.getAllPets()
        if (!mounted) return
        setPets(Array.isArray(data) && data.length > 0 ? data : mockPets)
      } catch (err) {
        setError(err)
        setPets(mockPets)
      } finally {
        setLoading(false)
      }
    }
    loadPets()
    return () => { mounted = false }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header Bar */}
      <header style={{ background: '#f8f4ed', padding: '18px 0', borderBottom: '1px solid #e0e4d6', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#4f8a3a' }}>Happy Tails</span>
            <span style={{ color: '#5e7263', fontSize: 13 }}>Find Your Forever Friend</span>
          </button>
          <nav style={{ display: 'flex', gap: 32, fontSize: 15, alignItems: 'center' }}>
            <button type="button" onClick={() => navigate('/discover')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Discover Pets</button>
            <button type="button" onClick={() => navigate('/quiz')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Take Quiz</button>
            {isStaff ? (
              <button type="button" onClick={() => navigate('/shelter/pets')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Shelter Dashboard</button>
            ) : (
              <button type="button" onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Profile</button>
            )}
            {isAuthenticated ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '0.9rem', color: '#5e7263' }}>{email}</span>
                <button type="button" onClick={logout} style={{ background: 'none', border: '1px solid rgba(79, 138, 58, 0.3)', color: '#4f8a3a', fontWeight: 600, cursor: 'pointer', borderRadius: 999, padding: '8px 18px' }}>Logout</button>
              </div>
            ) : (
              <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#4f8a3a', fontWeight: 600, cursor: 'pointer' }}>Login</button>
            )}
          </nav>
        </div>
      </header>

      {/* Page Title and Filter Bar */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 0 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, padding: '0 32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#253b2f', margin: 0 }}>Discover Pets</h1>
            <p style={{ color: '#5e7263', margin: 0, fontSize: 16 }}>Browse adoptable pets waiting for their forever home.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              style={{ background: '#fff', border: '1px solid #e0e4d6', borderRadius: 999, padding: '8px 22px', color: '#253b2f', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
              onClick={() => setFilterOpen(true)}
            >
              Filter
            </button>
          </div>
          {filterOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.12)', zIndex: 1001 }} onClick={() => setFilterOpen(false)}>
              <div style={{ position: 'absolute', top: 90, right: 80, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(84,135,104,0.16)', padding: 32, minWidth: 340, minHeight: 340, zIndex: 1002, display: 'flex', flexDirection: 'column', gap: 24 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setFilterOpen(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#5e7263', cursor: 'pointer' }}>&times;</button>
                <h3 style={{ margin: 0, color: '#253b2f', fontWeight: 700, fontSize: 17, marginBottom: 18 }}>Filters</h3>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, color: '#333', fontSize: 15, marginBottom: 8 }}>Species</div>
                  <div style={{ display: 'flex', gap: 22, marginBottom: 6 }}>
                    <span className="chip">Dog</span>
                    <span className="chip">Cat</span>
                    <span className="chip">Rabbit</span>
                    <span className="chip">Bird</span>
                  </div>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, color: '#333', fontSize: 15, marginBottom: 8 }}>Life Stage</div>
                  <div style={{ display: 'flex', gap: 22, marginBottom: 6 }}>
                    <span className="chip">Puppy</span>
                    <span className="chip">Juvenile</span>
                    <span className="chip">Adult</span>
                    <span className="chip">Senior</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#333', fontSize: 15, marginBottom: 8 }}>Size</div>
                  <div style={{ display: 'flex', gap: 22 }}>
                    <span className="chip">Small</span>
                    <span className="chip">Medium</span>
                    <span className="chip">Large</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(84,135,104,0.04)', padding: '14px 24px', margin: '0 32px 24px 32px' }}>
          <input placeholder="Search by name or breed..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 17, background: 'transparent', color: '#253b2f' }} />
          <button style={{ background: 'var(--color-cta)', color: '#fff', borderRadius: 999, fontWeight: 600, padding: '8px 22px', border: 'none', fontSize: 15, cursor: 'pointer' }}>Search</button>
        </div>
      </div>

      {/* Pet Grid */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 48px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5e7263' }}>Loading pets…</div>
        ) : (
          <>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginTop: 8 }}>
              {featuredPetsDisplay.map((pet, index) => (
                <div key={pet.id ?? pet.name ?? index} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 28px rgba(84,135,104,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 320 }}>
                  <img src={pet.imageUrl} alt={pet.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  <div style={{ padding: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{pet.name}</div>
                    <div style={{ color: '#5e7263', fontSize: 14, marginBottom: 8 }}>{pet.breed} - {pet.age}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {pet.tags && pet.tags.length ? pet.tags.map(trait => <span key={trait} style={{ background: '#f1efe6', borderRadius: 999, padding: '4px 12px', fontWeight: 600, fontSize: 13 }}>{trait}</span>) : null}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #f1efe6', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#4f8a3a', fontSize: 15 }}>Ready for adoption</span>
                    <button
                      type="button"
                      onClick={() => setQuickViewPet(pet)}
                      style={{ background: 'var(--color-cta)', color: '#fff', borderRadius: 999, fontWeight: 600, padding: '8px 22px', border: 'none', cursor: 'pointer' }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </section>
            {quickViewPet && (
              <PetQuickView pet={quickViewPet} onClose={() => setQuickViewPet(null)} />
            )}
          </>
        )}
        {error && (
          <div style={{ marginTop: 24, color: '#d64545', textAlign: 'center', fontSize: 15 }}>Unable to load live pets (using local samples).</div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#163522', color: '#def7dd', padding: '48px 0 24px', marginTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 48, justifyContent: 'space-between', flexWrap: 'wrap', padding: '0 32px' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h4 style={{ marginBottom: 16, fontSize: 17 }}>Happy Tails</h4>
            <p style={{ color: '#b5e6c9', fontSize: 15 }}>Connecting loving families with shelter animals since 2025. Discover your next best friend and build your adoption story with us.</p>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <h4 style={{ marginBottom: 16, fontSize: 17 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#b5e6c9', fontSize: 15 }}>
              <li><a href="/discover" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Discover Pets</a></li>
              <li><a href="/quiz" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Take Quiz</a></li>
              <li><a href="/profile" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Profile</a></li>
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <h4 style={{ marginBottom: 16, fontSize: 17 }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#b5e6c9', fontSize: 15 }}>
              <li>Adoption Guide</li>
              <li>Shelter Partners</li>
              <li>Volunteer</li>
              <li>Contact Support</li>
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h4 style={{ marginBottom: 16, fontSize: 17 }}>Stay Connected</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#b5e6c9', fontSize: 15 }}>
              <li>Get updates on new pets</li>
              <li>Submit your adoption story</li>
              <li>Newsletter Signup</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 36, textAlign: 'center', color: '#b5e6c9', fontSize: 14 }}>
          © {new Date().getFullYear()} Happy Tails. All rights reserved. · Privacy Policy · Terms of Service · Cookie Policy
        </div>
      </footer>
    </div>
  )
}
