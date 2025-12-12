import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { petService } from '../services/petservice'
import PetQuickView from '../modules/pets/PetQuickView.jsx'


export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, isStaff } = useAuth()
  const [authMessage, setAuthMessage] = useState('')
  const [quickViewPet, setQuickViewPet] = useState(null)
  const [featuredPets, setFeaturedPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadPets() {
      try {
        const data = await petService.getAllPets()
        if (!mounted) return
        const pets = Array.isArray(data) ? data.slice(0, 6) : []
        setFeaturedPets(pets)
      } catch (err) {
        setFeaturedPets([])
      } finally {
        setLoading(false)
      }
    }
    loadPets()
    return () => {
      mounted = false
    }
  }, [])

  const heroImages = useMemo(
    () => [
      'https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=700',
      'https://images.pexels.com/photos/7210751/pexels-photo-7210751.jpeg?auto=compress&cs=tinysrgb&w=700',
      'https://th.bing.com/th/id/OIP.JeOlLIi6w8hKJhrKieIjIAHaEK?w=331&h=186&c=7&r=0&o=7&cb=ucfimgc2&pid=1.7&rm=3',
      'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=700',
    ],
    [],
  );

  const handleImageError = (event) => {
    event.currentTarget.src = 'https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=600';
    event.currentTarget.onerror = null;
  };

  const successStories = useMemo(
    () => [
      {
        name: 'Sarah Johnson',
        location: 'Adopter · Cebu City',
        story:
          '“Happy Tails made the adoption process so easy. We adore Luna and she has brought so much joy to our home.”',
        rating: 5,
        photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
      {
        name: 'Michael Cruz',
        location: 'Adopter · Mandaue',
        story:
          '“The matching quiz helped us find a pet that truly suits our lifestyle. Max is the perfect adventure buddy.”',
        rating: 5,
        photo: 'data:image/webp;base64,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',
      },
      {
        name: 'Emily Rodriguez',
        location: 'Happy Paws Shelter · Cebu City',
        story:
          '“Our shelter profiles have never looked better. Adopters can easily discover our pets and submit complete applications.”',
        rating: 5,
        photo: 'https://images.pexels.com/photos/4666753/pexels-photo-4666753.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
      {
        name: 'David Williams',
        location: 'Adopter · Lapu-Lapu',
        story:
          '“We found the right dog for us in no time and the staff were so helpful throughout the process. Thank you!”',
        rating: 5,
        photo: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
    ],
    [],
  );


  const successStoriesDisplay = useMemo(() => {
    if (successStories.length >= 6) return successStories;
    const needed = 6 - successStories.length;
    return [...successStories, ...successStories.slice(0, needed)];
  }, [successStories]);

  const requireAuth = (path) => {
    if (isStaff) {
      setAuthMessage('Shelter accounts manage adoptions through the profile instead of the adopter quiz.')
      navigate('/profile')
      return
    }

    if (isAuthenticated) {
      navigate(path)
      return
    }
    setAuthMessage('Please log in to continue.')
    navigate('/login', { state: { from: path } })
  }

  const goToDiscover = () => {
    navigate('/discover')
  }

  return (
    <div style={{ background: 'var(--gradient-soft)' }}>
      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '40px clamp(20px, 5vw, 72px)' }}>
        {/* Hero Section */}
        <section style={{ display: 'flex', gap: 48, alignItems: 'center', marginBottom: 48 }}>
          <div style={{ flex: 1 }}>
            <div style={{ background: 'var(--color-accent-light)', borderRadius: 999, display: 'inline-block', padding: '8px 18px', fontWeight: 600, marginBottom: 20 }}>
              <span role="img" aria-hidden>🦴</span> Find Your Perfect Match
            </div>
            <h1 style={{ fontSize: '2.8rem', margin: '0 0 16px', fontWeight: 700, color: '#253b2f' }}>Every Pet Deserves a Loving Home</h1>
            <p style={{ color: '#5e7263', fontSize: '1.1rem', marginBottom: 24 }}>
              Connect with shelter animals looking for their forever families. Our smart matching quiz and curated profiles make it simple to find a companion that fits your lifestyle.
            </p>
            {authMessage && (
              <div style={{ marginBottom: 16, color: '#4f8a3a', fontWeight: 600 }}>{authMessage}</div>
            )}
            <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
              <button
                type="button"
                onClick={goToDiscover}
                style={{ background: 'var(--color-cta)', color: '#fff', borderRadius: 999, fontWeight: 600, padding: '12px 32px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 12px rgba(120, 201, 119, 0.20)' }}
              >
                Discover Pets
              </button>
              {isStaff ? (
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  style={{ border: '1.5px solid var(--color-cta)', color: '#253b2f', borderRadius: 999, fontWeight: 600, padding: '12px 32px', background: 'transparent', cursor: 'pointer' }}
                >
                  Manage Shelter Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => requireAuth('/quiz')}
                  style={{ border: '1.5px solid var(--color-cta)', color: '#253b2f', borderRadius: 999, fontWeight: 600, padding: '12px 32px', background: 'transparent', cursor: 'pointer' }}
                >
                  Take Matching Quiz
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 40, marginTop: 16 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 22 }}>500+</div>
                <div style={{ color: '#5e7263', fontSize: 15 }}>Pets adopted</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 22 }}>50+</div>
                <div style={{ color: '#5e7263', fontSize: 15 }}>Partner shelters</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 22 }}>98%</div>
                <div style={{ color: '#5e7263', fontSize: 15 }}>Happy families</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)' }}>
            {heroImages.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`Pet ${index + 1}`}
                onError={handleImageError}
                style={{ width: '100%', borderRadius: 16, objectFit: 'cover', gridColumn: index % 2 === 0 ? '1/2' : '2/3', gridRow: index < 2 ? '1/2' : '2/3' }}
              />
            ))}
          </div>
        </section>
        {/* Featured Pets */}
        <section style={{ background: '#f9f6ef', borderRadius: 28, padding: '40px clamp(28px, 6vw, 72px)', marginBottom: 56 }}>
          <h2 style={{ fontSize: '2.1rem', margin: '0 0 12px', color: '#253b2f' }}>Featured Pets</h2>
          <p style={{ color: '#5e7263', margin: '0 0 32px', fontSize: 16 }}>Meet some of our adorable pets looking for homes</p>
          <div style={{ display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#5e7263' }}>Loading featured pets…</div>
            ) : featuredPets.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#5e7263' }}>No pets available yet.</div>
            ) : (
              featuredPets.map((pet, index) => (
                <div key={pet.id ?? `${pet.name}-${index}`} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 28px rgba(84,135,104,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 320 }}>
                  {pet.imageUrl ? (
                    <img src={pet.imageUrl} alt={pet.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: 160, background: 'linear-gradient(135deg, #e8f5e9 0%, #f1efe6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🐾</div>
                  )}
                  <div style={{ padding: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{pet.name}</div>
                    <div style={{ color: '#5e7263', fontSize: 14, marginBottom: 8 }}>{pet.breed} - {pet.age}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {pet.tags?.map(tag => <span key={tag} style={{ background: '#f1efe6', borderRadius: 999, padding: '4px 12px', fontWeight: 600, fontSize: 13 }}>{tag}</span>)}
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
              ))
            )}
            {quickViewPet && (
              <PetQuickView pet={quickViewPet} onClose={() => setQuickViewPet(null)} />
            )}
          </div>
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <button
              type="button"
              onClick={goToDiscover}
              style={{ border: '1.5px solid var(--color-cta)', color: '#253b2f', borderRadius: 999, fontWeight: 600, padding: '12px 32px', background: 'transparent', cursor: 'pointer' }}
            >
              Browse All Pets
            </button>
          </div>
        </section>
        {/* Success Stories */}
        <section style={{ margin: '72px 0', background: '#fff', borderRadius: 28, padding: '48px clamp(28px, 6vw, 72px)', boxShadow: '0 12px 40px rgba(84,135,104,0.12)' }}>
          <h2 style={{ textAlign: 'center', color: '#253b2f', fontSize: '2.1rem', marginBottom: 12 }}>Success Stories</h2>
          <p style={{ textAlign: 'center', color: '#5e7263', fontSize: 16, marginBottom: 36 }}>Happy families, happy tails. Hear from adopters and shelters who found their perfect match.</p>
          <div style={{ display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {successStoriesDisplay.map((story, index) => (
              <div key={`${story.name}-${index}`} style={{ background: '#f9f6ef', borderRadius: 20, padding: 28, display: 'grid', gap: 16, boxShadow: '0 6px 18px rgba(84,135,104,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={story.photo} alt={story.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: 16 }}>{story.name}</strong>
                    <span style={{ color: '#5e7263', fontSize: 13 }}>{story.location}</span>
                  </div>
                </div>
                <div style={{ color: '#78c977', fontWeight: 700, fontSize: 20 }}>{'★'.repeat(story.rating)}{'☆'.repeat(5 - story.rating)}</div>
                <p style={{ fontSize: 15, lineHeight: 1.7 }}>{story.story}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 44, textAlign: 'center', fontWeight: 600, color: '#253b2f' }}>
            Ready to write your own success story?{' '}
            <button
              type="button"
              onClick={goToDiscover}
              style={{ color: '#4f8a3a', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Start exploring pets →
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
