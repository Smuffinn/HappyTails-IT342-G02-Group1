import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PetQuickView from '../modules/pets/PetQuickView.jsx';


export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, email, logout } = useAuth();
  const [authMessage, setAuthMessage] = useState('');
  const [quickViewPet, setQuickViewPet] = useState(null);

  const featuredPets = useMemo(
    () => [
      {
        name: 'Luna',
        breed: 'Golden Retriever',
        age: '2-4 years',
        img: 'https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=600',
        traits: ['Friendly', 'Playful'],
      },
      {
        name: 'Whiskers',
        breed: 'Tabby Mix',
        age: '1-3 years',
        img: 'data:image/webp;base64,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',
        traits: ['Independent', 'Calm'],
      },
      {
        name: 'Max',
        breed: 'Beagle',
        age: '4-6 years',
        img: 'https://images.pexels.com/photos/972482/pexels-photo-972482.jpeg?auto=compress&cs=tinysrgb&w=600',
        traits: ['Curious', 'Friendly'],
      },
      {
        name: 'Snowball',
        breed: 'Dwarf',
        age: '1-3 years',
        img: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=600',
        traits: ['Gentle', 'Quiet'],
      },
      {
        name: 'Charlie',
        breed: 'Labrador Mix',
        age: '3-5 years',
        img: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=600',
        traits: ['Loyal', 'Calm'],
      },
      {
        name: 'Twisty',
        breed: 'Parakeet',
        age: '1 year',
        img: 'https://th.bing.com/th/id/OIP.JeOlLIi6w8hKJhrKieIjIAHaEK?w=331&h=186&c=7&r=0&o=7&cb=ucfimgc2&pid=1.7&rm=3',
        traits: ['Social', 'Cheerful'],
      },
    ],
    [],
  );

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
    if (isAuthenticated) {
      navigate(path);
      return;
    }
    setAuthMessage('Please log in to continue.');
    navigate('/login', { state: { from: path } });
  };

  const goToDiscover = () => {
    navigate('/discover');
  };

  return (
    <div style={{ background: 'var(--gradient-soft)', minHeight: '100vh' }}>
      <header style={{ background: '#f8f4ed', padding: '18px 0', borderBottom: '1px solid #e0e4d6', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#4f8a3a' }}>Happy Tails</span>
            <span style={{ color: '#5e7263', fontSize: 13 }}>Find Your Forever Friend</span>
          </button>
          <nav style={{ display: 'flex', gap: 32, fontSize: 15, alignItems: 'center' }}>
            <button type="button" onClick={goToDiscover} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Discover Pets</button>
            <button type="button" onClick={() => requireAuth('/quiz')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Take Quiz</button>
            {isStaff ? (
              <button type="button" onClick={() => requireAuth('/shelter/pets')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Shelter Dashboard</button>
            ) : (
              <button type="button" onClick={() => requireAuth('/profile')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Profile</button>
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
              <button
                type="button"
                onClick={() => requireAuth('/quiz')}
                style={{ border: '1.5px solid var(--color-cta)', color: '#253b2f', borderRadius: 999, fontWeight: 600, padding: '12px 32px', background: 'transparent', cursor: 'pointer' }}
              >
                Take Matching Quiz
              </button>
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
              <div key={`${pet.name}-${index}`} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 28px rgba(84,135,104,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 320 }}>
                <img src={pet.img} alt={pet.name} onError={handleImageError} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{pet.name}</div>
                  <div style={{ color: '#5e7263', fontSize: 14, marginBottom: 8 }}>{pet.breed} - {pet.age}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {pet.traits.map(trait => <span key={trait} style={{ background: '#f1efe6', borderRadius: 999, padding: '4px 12px', fontWeight: 600, fontSize: 13 }}>{trait}</span>)}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #f1efe6', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#4f8a3a', fontSize: 15 }}>Ready for adoption</span>
                  <button
                    type="button"
                    onClick={() => setQuickViewPet({ ...pet, imageUrl: pet.img })}
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
  );
}

