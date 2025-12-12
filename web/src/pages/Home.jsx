import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PetQuickView from '../modules/pets/PetQuickView.jsx'
import { petService } from '../services/petservice'


export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, isStaff } = useAuth()
  const [authMessage, setAuthMessage] = useState('')
  const [quickViewPet, setQuickViewPet] = useState(null)
  const [featuredPets, setFeaturedPets] = useState([])

  useEffect(() => {
    let mounted = true
    async function loadFeaturedPets() {
      try {
        const pets = await petService.getAllPets()
        if (!mounted) return
        setFeaturedPets(Array.isArray(pets) ? pets.slice(0, 6) : [])
      } catch (err) {
        setFeaturedPets([])
      }
    }
    loadFeaturedPets()
    return () => {
      mounted = false
    }
  }, [])

  const heroImages = useMemo(
    () => [
      'https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=700',
      'https://images.pexels.com/photos/7210751/pexels-photo-7210751.jpeg?auto=compress&cs=tinysrgb&w=700',
      'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=700',
      'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=700',
    ],
    [],
  )

  const handleImageError = (event) => {
    event.currentTarget.src =
      'https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=600'
    event.currentTarget.onerror = null
  }

  const successStories = useMemo(
    () => [
      {
        name: 'Sarah Johnson',
        location: 'Adopter · Cebu City',
        story:
          '“Happy Tails made the adoption process so easy. We adore Luna and she has brought so much joy to our home.”',
        rating: 5,
        photo:
          'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
      {
        name: 'Michael Cruz',
        location: 'Adopter · Mandaue',
        story:
          '“The matching quiz helped us find a pet that truly suits our lifestyle. Max is the perfect adventure buddy.”',
        rating: 5,
        photo:
          'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
      {
        name: 'Emily Rodriguez',
        location: 'Happy Paws Shelter · Cebu City',
        story:
          '“Our shelter profiles have never looked better. Adopters can easily discover our pets and submit complete applications.”',
        rating: 5,
        photo:
          'https://images.pexels.com/photos/4666753/pexels-photo-4666753.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
      {
        name: 'David Williams',
        location: 'Adopter · Lapu-Lapu',
        story:
          '“We found the right dog for us in no time and the staff were so helpful throughout the process. Thank you!”',
        rating: 5,
        photo:
          'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
    ],
    [],
  )

  const featuredPetsDisplay = useMemo(() => {
    if (featuredPets.length >= 6) return featuredPets;
    const needed = 6 - featuredPets.length;
    return [...featuredPets, ...featuredPets.slice(0, needed)];
  }, [featuredPets]);

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
            {featuredPetsDisplay.map((pet, index) => (
              <div key={pet.id ?? `${pet.name}-${index}`} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 28px rgba(84,135,104,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 320 }}>
                <img src={pet.imageUrl || pet.img} alt={pet.name} onError={handleImageError} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{pet.name}</div>
                  <div style={{ color: '#5e7263', fontSize: 14, marginBottom: 8 }}>{pet.breed} - {pet.age}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(pet.tags || pet.traits || []).map(trait => (
                      <span key={trait} style={{ background: '#f1efe6', borderRadius: 999, padding: '4px 12px', fontWeight: 600, fontSize: 13 }}>{trait}</span>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #f1efe6', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#4f8a3a', fontSize: 15 }}>
                    {pet.status === 'Adopted' ? 'Adopted' : 'Ready for adoption'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickViewPet({ ...pet, imageUrl: pet.imageUrl || pet.img })}
                    style={{ background: 'var(--color-cta)', color: '#fff', borderRadius: 999, fontWeight: 600, padding: '8px 22px', border: 'none', cursor: 'pointer' }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
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
