import React, { useEffect, useMemo, useState } from 'react'
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
    gender: 'Female',
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
    gender: 'Female',
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
    gender: 'Male',
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
    gender: 'Female',
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
    gender: 'Female',
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
    gender: 'Male',
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
    gender: 'Male',
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
    gender: 'Unknown',
    imageUrl: pet8,
    tags: ['Cheerful', 'Active'],
  },
]

export default function DiscoverPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quickViewPet, setQuickViewPet] = useState(null)

  const [filterName, setFilterName] = useState('')
  const [filterSpecies, setFilterSpecies] = useState('')
  const [filterBreed, setFilterBreed] = useState('')
  const [filterAge, setFilterAge] = useState('')
  const [filterSize, setFilterSize] = useState('')
  const [filterGender, setFilterGender] = useState('')

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
    return () => {
      mounted = false
    }
  }, [])

  const sourcePets = useMemo(() => (pets.length ? pets : mockPets), [pets])

  const toTitleCase = (value) => value.replace(/\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  const buildOptions = useMemo(() => {
    const makeOptions = (values, formatter, fallbackValues = []) => {
      const map = new Map()
      const ingest = (collection) => {
        collection.forEach((val) => {
          if (!val) return
          const raw = String(val).trim()
          if (!raw) return
          const key = raw.toLowerCase()
          if (!map.has(key)) {
            map.set(key, formatter ? formatter(raw) : raw)
          }
        })
      }
      ingest(fallbackValues)
      ingest(values)
      return Array.from(map.entries()).map(([value, label]) => ({ value, label }))
    }

    const species = makeOptions(
      sourcePets.map((pet) => pet?.species || pet?.raw?.species),
      (raw) => toTitleCase(raw),
    )
    const breeds = makeOptions(
      sourcePets.map((pet) => pet?.breed || pet?.raw?.breed),
      (raw) => toTitleCase(raw),
    )
    const ages = makeOptions(sourcePets.map((pet) => pet?.age || pet?.raw?.age))
    const sizes = makeOptions(
      sourcePets.map((pet) => pet?.size || pet?.raw?.size),
      (raw) => toTitleCase(raw),
      ['Small', 'Medium', 'Large'],
    )
    const genders = makeOptions(
      sourcePets.map((pet) => pet?.gender || pet?.raw?.gender),
      (raw) => toTitleCase(raw),
      ['Male', 'Female', 'Unknown'],
    )

    return {
      species,
      breeds,
      ages,
      sizes,
      genders,
    }
  }, [sourcePets])

  const filteredPets = useMemo(() => {
    const name = filterName.trim().toLowerCase()
    const species = filterSpecies.trim().toLowerCase()
    const breed = filterBreed.trim().toLowerCase()
    const age = filterAge.trim().toLowerCase()
    const size = filterSize.trim().toLowerCase()
    const gender = filterGender.trim().toLowerCase()

    return sourcePets.filter((pet) => {
      const petName = (pet?.name || '').toLowerCase()
      const petSpecies = (pet?.species || pet?.raw?.species || '').toLowerCase()
      const petBreed = (pet?.breed || pet?.raw?.breed || '').toLowerCase()
      const petAge = (pet?.age || pet?.raw?.age || '').toLowerCase()
      const petSize = (pet?.size || pet?.raw?.size || '').toLowerCase()
      const petGender = (pet?.gender || pet?.raw?.gender || '').toLowerCase()

      if (name && !petName.includes(name)) return false
      if (species && !petSpecies.includes(species)) return false
      if (breed && !petBreed.includes(breed)) return false
      if (age && !petAge.includes(age)) return false
      if (size && !petSize.includes(size)) return false
      if (gender && !petGender.includes(gender)) return false

      return true
    })
  }, [sourcePets, filterName, filterSpecies, filterBreed, filterAge, filterSize, filterGender])

  const clearFilters = () => {
    setFilterName('')
    setFilterSpecies('')
    setFilterBreed('')
    setFilterAge('')
    setFilterSize('')
    setFilterGender('')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 0 32px', display: 'grid', gap: 24 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#253b2f', margin: 0 }}>Discover Pets</h1>
          <p style={{ color: '#5e7263', margin: '8px 0 0', fontSize: 16 }}>Browse adoptable pets waiting for their forever home.</p>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          style={filterBarStyle}
        >
          <FilterControl label="Pet name">
            <input
              type="text"
              value={filterName}
              onChange={(event) => setFilterName(event.target.value)}
              placeholder="Search name"
              className="input"
              style={controlInputStyle}
            />
          </FilterControl>

          <FilterControl label="Species">
            <select
              value={filterSpecies}
              onChange={(event) => setFilterSpecies(event.target.value)}
              style={controlInputStyle}
            >
              <option value="">All</option>
              {buildOptions.species.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterControl>

          <FilterControl label="Breed">
            <select
              value={filterBreed}
              onChange={(event) => setFilterBreed(event.target.value)}
              style={controlInputStyle}
            >
              <option value="">All</option>
              {buildOptions.breeds.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterControl>

          <FilterControl label="Age">
            <select
              value={filterAge}
              onChange={(event) => setFilterAge(event.target.value)}
              style={controlInputStyle}
            >
              <option value="">All</option>
              {buildOptions.ages.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterControl>

          <FilterControl label="Size">
            <select
              value={filterSize}
              onChange={(event) => setFilterSize(event.target.value)}
              style={controlInputStyle}
            >
              <option value="">All</option>
              {buildOptions.sizes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterControl>

          <FilterControl label="Gender">
            <select
              value={filterGender}
              onChange={(event) => setFilterGender(event.target.value)}
              style={controlInputStyle}
            >
              <option value="">All</option>
              {buildOptions.genders.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterControl>

          <button
            type="button"
            className="btn btn-outline"
            onClick={clearFilters}
            style={clearButtonStyle}
          >
            Clear filters
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
                      {pet.tags && pet.tags.length
                        ? pet.tags.map((trait) => (
                            <span key={trait} style={{ background: '#f1efe6', borderRadius: 999, padding: '4px 12px', fontWeight: 600, fontSize: 13 }}>{trait}</span>
                          ))
                        : null}
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
    </div>
  )
}

const filterBarStyle = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 10px 26px rgba(84,135,104,0.12)',
  padding: '18px clamp(18px, 5vw, 36px)',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 16,
}

const controlInputStyle = {
  borderRadius: 12,
  padding: '10px 14px',
  border: '1px solid rgba(84,135,104,0.3)',
  fontSize: 14,
  lineHeight: 1.4,
  background: '#fff',
  width: '100%',
  minWidth: 150,
}

const clearButtonStyle = {
  marginLeft: 'auto',
  padding: '10px 20px',
  fontSize: 14,
}

function FilterControl({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 6, color: '#4f8a3a', fontSize: 12, fontWeight: 600, flex: '1 1 0', minWidth: 170 }}>
      <span style={{ textTransform: 'uppercase', letterSpacing: 0.45 }}>{label}</span>
      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </label>
  )
}
