import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { petService } from '../services/petservice'
import PetQuickView from '../modules/pets/PetQuickView.jsx'
import pet1 from '../assets/pet1.jpg'
import pet2 from '../assets/pet2.jpg'
import pet3 from '../assets/pet3.jpg'
import pet4 from '../assets/pet4.jpg'
import pet5 from '../assets/pet5.jpg'
import pet6 from '../assets/pet6.jpg'
import pet7 from '../assets/pet7.jpg'
import pet8 from '../assets/pet8.jpg'

const mockPets = [
  {
    id: 1,
    name: 'Luna',
    breed: 'Golden Retriever',
    age: '2 years',
    size: 'large',
    species: 'Dog',
    imageUrl: pet1,
    tags: ['Friendly', 'Playful'],
  },
  {
    id: 2,
    name: 'Whiskers',
    breed: 'Tabby Mix',
    age: '3 years',
    size: 'medium',
    species: 'Cat',
    imageUrl: pet3,
    tags: ['Independent', 'Calm'],
  },
  {
    id: 3,
    name: 'Max',
    breed: 'Beagle',
    age: '4 years',
    size: 'medium',
    species: 'Dog',
    imageUrl: pet2,
    tags: ['Curious', 'Friendly'],
  },
  {
    id: 4,
    name: 'Mittens',
    breed: 'Siamese',
    age: '1 year',
    size: 'small',
    species: 'Cat',
    imageUrl: pet4,
    tags: ['Vocal', 'Social'],
  },
  {
    id: 5,
    name: 'Bella',
    breed: 'French Bulldog',
    age: '3 years',
    size: 'small',
    species: 'Dog',
    imageUrl: pet5,
    tags: ['Affectionate', 'Playful'],
  },
  {
    id: 6,
    name: 'Charlie',
    breed: 'Labrador Mix',
    age: '5 years',
    size: 'large',
    species: 'Dog',
    imageUrl: pet6,
    tags: ['Loyal', 'Calm'],
  },
  {
    id: 7,
    name: 'Hoppy',
    breed: 'Lop-Eared',
    age: '2 years',
    size: 'small',
    species: 'Rabbit',
    imageUrl: pet7,
    tags: ['Gentle', 'Quiet'],
  },
  {
    id: 8,
    name: 'Tweety',
    breed: 'Canary',
    age: '1 year',
    size: 'small',
    species: 'Bird',
    imageUrl: pet8,
    tags: ['Cheerful', 'Active'],
  },
]

export default function DiscoverPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isStaff, email, logout } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [quickViewPet, setQuickViewPet] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState(new Set())
  const [selectedSizes, setSelectedSizes] = useState(new Set())
  const [selectedLifeStages, setSelectedLifeStages] = useState(new Set())

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

  const sourcePets = useMemo(() => (pets.length ? pets : mockPets), [pets])

  const speciesOptions = useMemo(() => {
    const unique = new Set()
    sourcePets.forEach((pet) => {
      if (pet?.species) unique.add(pet.species)
    })
    return Array.from(unique)
  }, [sourcePets])

  const sizeOptions = useMemo(() => {
    const unique = new Set()
    sourcePets.forEach((pet) => {
      if (pet?.size) unique.add(pet.size)
    })
    return Array.from(unique)
  }, [sourcePets])

  const deriveLifeStage = useCallback((ageLabel) => {
    if (!ageLabel) return 'Adult'
    const match = String(ageLabel).match(/(\d+(?:\.\d+)?)/)
    const value = match ? parseFloat(match[1]) : null
    if (value === null || Number.isNaN(value)) return 'Adult'
    if (value < 1) return 'Puppy'
    if (value >= 1 && value < 3) return 'Juvenile'
    if (value >= 3 && value < 7) return 'Adult'
    return 'Senior'
  }, [])

  const lifeStageOptions = useMemo(() => {
    const unique = new Set()
    sourcePets.forEach((pet) => unique.add(deriveLifeStage(pet?.age)))
    return Array.from(unique)
  }, [sourcePets, deriveLifeStage])

  const toggleSetValue = (setter) => (value) => {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    })
  }

  const clearFilters = useCallback(() => {
    setSelectedSpecies(new Set())
    setSelectedSizes(new Set())
    setSelectedLifeStages(new Set())
    setSearchTerm('')
  }, [])

  const filteredPets = useMemo(() => {
    return sourcePets.filter((pet) => {
      const matchesSearch = (() => {
        if (!searchTerm.trim()) return true
        const norm = searchTerm.trim().toLowerCase()
        return (
          (pet.name && pet.name.toLowerCase().includes(norm)) ||
          (pet.breed && pet.breed.toLowerCase().includes(norm)) ||
          (pet.species && pet.species.toLowerCase().includes(norm))
        )
      })()

      const matchesSpecies = selectedSpecies.size === 0 || (pet.species && selectedSpecies.has(pet.species))

      const matchesSize = selectedSizes.size === 0 || (pet.size && selectedSizes.has(pet.size))

      const stage = deriveLifeStage(pet.age)
      const matchesLifeStage = selectedLifeStages.size === 0 || selectedLifeStages.has(stage)

      return matchesSearch && matchesSpecies && matchesSize && matchesLifeStage
    })
  }, [sourcePets, searchTerm, selectedSpecies, selectedSizes, selectedLifeStages, deriveLifeStage])

  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault()
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
                <FilterSection
                  label="Species"
                  options={speciesOptions}
                  selected={selectedSpecies}
                  onToggle={toggleSetValue(setSelectedSpecies)}
                />
                <FilterSection
                  label="Life Stage"
                  options={lifeStageOptions}
                  selected={selectedLifeStages}
                  onToggle={toggleSetValue(setSelectedLifeStages)}
                />
                <FilterSection
                  label="Size"
                  options={sizeOptions}
                  selected={selectedSizes}
                  onToggle={toggleSetValue(setSelectedSizes)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn btn-outline"
                    style={{ padding: '8px 20px', fontSize: 14 }}
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', fontSize: 14 }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Search Bar */}
        <form
          style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(84,135,104,0.04)', padding: '14px 24px', margin: '0 32px 24px 32px' }}
          onSubmit={handleSearchSubmit}
        >
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, breed, or species..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 17, background: 'transparent', color: '#253b2f' }}
          />
          <button
            type="submit"
            style={{ background: 'var(--color-cta)', color: '#fff', borderRadius: 999, fontWeight: 600, padding: '8px 22px', border: 'none', fontSize: 15, cursor: 'pointer' }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Pet Grid */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 48px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5e7263' }}>Loading pets…</div>
        ) : filteredPets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5e7263' }}>
            No pets match your filters yet. Try adjusting the search or filters.
          </div>
        ) : (
          <>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginTop: 8 }}>
              {filteredPets.map((pet, index) => (
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

function FilterSection({ label, options, selected, onToggle }) {
  if (!options?.length) return null
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontWeight: 600, color: '#333', fontSize: 15, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {options.map((option) => {
          const isActive = selected.has(option)
          const className = isActive ? 'chip is-active' : 'chip'
          return (
            <button
              type="button"
              key={option}
              className={className}
              onClick={() => onToggle(option)}
              style={{ cursor: 'pointer', background: 'transparent' }}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
