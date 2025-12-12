import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import shelterService from '../services/shelterService'
import { petService } from '../services/petservice'

const statusOptions = ['Available', 'Pending', 'Adopted']

const emptyPetForm = {
  name: '',
  species: '',
  breed: '',
  age: '',
  size: '',
  gender: '',
  description: '',
  temperament: '',
  photos: '',
}

export default function ShelterDashboard() {
  const navigate = useNavigate()
  const { initializing, isAuthenticated, isStaff } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [staffProfile, setStaffProfile] = useState(null)
  const [shelterProfile, setShelterProfile] = useState(null)
  const [pets, setPets] = useState([])

  const [staffForm, setStaffForm] = useState({ firstName: '', lastName: '', phoneNumber: '', email: '' })
  const [shelterForm, setShelterForm] = useState({ name: '', location: '', contactInfo: '' })

  const [petForm, setPetForm] = useState(emptyPetForm)
  const [editingPetId, setEditingPetId] = useState(null)
  const [petFormError, setPetFormError] = useState(null)

  const [statusMessage, setStatusMessage] = useState(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const removePhoto = (index) => {
    const photos = petForm.photos.split(',').map((p) => p.trim())
    photos.splice(index, 1)
    setPetForm((prev) => ({ ...prev, photos: photos.join(', ') }))
  }

  const petBelongsToShelter = (pet, shelterId) => {
    if (!shelterId) return false
    if (pet?.shelterId && Number(pet.shelterId) === Number(shelterId)) return true
    const rawShelterId = pet?.raw?.shelter?.shelterId ?? pet?.raw?.shelterId
    if (rawShelterId && Number(rawShelterId) === Number(shelterId)) return true
    return false
  }

  useEffect(() => {
    if (initializing) return
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: '/shelter/dashboard' } })
      return
    }
    if (!isStaff) {
      navigate('/', { replace: true })
      return
    }

    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [staff, shelter, allPets] = await Promise.all([
          shelterService.getMyStaffProfile(),
          shelterService.getMyShelter(),
          petService.getAllPets(),
        ])

        if (!mounted) return

        setStaffProfile(staff)
        setShelterProfile(shelter)
        setStaffForm((prev) => ({
          ...prev,
          firstName: staff?.firstName || '',
          lastName: staff?.lastName || '',
          phoneNumber: staff?.phoneNumber || '',
          email: staff?.email || '',
        }))
        setShelterForm({
          name: shelter?.name || '',
          location: shelter?.location || '',
          contactInfo: shelter?.contactInfo || '',
        })

        const shelterId = shelter?.shelterId
        const scopedPets = (allPets || []).filter((pet) => petBelongsToShelter(pet, shelterId))
        setPets(scopedPets)
      } catch (err) {
        const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to load shelter dashboard.'
        if (mounted) setError(message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [initializing, isStaff, navigate])

  const resetPetForm = () => {
    setPetForm(emptyPetForm)
    setEditingPetId(null)
    setPetFormError(null)
  }

  const refreshPets = async () => {
    try {
      const allPets = await petService.getAllPets()
      const shelterId = shelterProfile?.shelterId
      const scopedPets = (allPets || []).filter((pet) => petBelongsToShelter(pet, shelterId))
      setPets(scopedPets)
    } catch (err) {
      console.error('Unable to refresh pets', err)
    }
  }

  const handleStaffSave = async () => {
    try {
      if (staffForm.phoneNumber && !/^\d+$/.test(staffForm.phoneNumber)) {
        setError('Phone number must contain digits only.')
        return
      }

      const payload = {}
      if (staffForm.email && staffForm.email !== staffProfile?.email) payload.email = staffForm.email
      if (staffForm.password) payload.password = staffForm.password
      if (staffForm.firstName !== (staffProfile?.firstName || '')) payload.firstName = staffForm.firstName
      if (staffForm.lastName !== (staffProfile?.lastName || '')) payload.lastName = staffForm.lastName
      if (staffForm.phoneNumber !== (staffProfile?.phoneNumber || '')) payload.phoneNumber = staffForm.phoneNumber

      if (Object.keys(payload).length === 0) {
        setStatusMessage('No changes to update for staff profile.')
        setIsStatusModalOpen(true)
        return
      }

      const updated = await shelterService.updateMyStaffProfile(payload)
      setStaffProfile(updated)
      setStaffForm((prev) => ({ ...prev, password: '' }))
      setStatusMessage('Staff profile updated successfully.')
      setIsStatusModalOpen(true)
    } catch (err) {
      const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to update staff profile.'
      setError(message)
    }
  }

  const handleShelterSave = async () => {
    try {
      if (shelterForm.contactInfo && !/^\d+$/.test(shelterForm.contactInfo)) {
        setError('Contact information must contain digits only.')
        return
      }

      const payload = {
        name: shelterForm.name,
        location: shelterForm.location,
        contactInfo: shelterForm.contactInfo,
      }
      const updated = await shelterService.updateMyShelter(payload)
      setShelterProfile(updated)
      setStatusMessage('Shelter profile updated successfully.')
      setIsStatusModalOpen(true)
    } catch (err) {
      const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to update shelter profile.'
      setError(message)
    }
  }

  const handlePetEdit = (pet) => {
    setEditingPetId(pet.id)
    const base = pet.raw || pet
    setPetForm({
      name: base.name || '',
      species: base.species || '',
      breed: base.breed || '',
      age: base.age || '',
      size: base.size || '',
      gender: base.gender || '',
      description: base.description || '',
      temperament: base.temperament || '',
      photos: (() => {
        try {
          if (!base.photosJson) return ''
          const arr = typeof base.photosJson === 'string' ? JSON.parse(base.photosJson) : base.photosJson
          if (Array.isArray(arr)) return arr.join(', ')
          return ''
        } catch (error) {
          return ''
        }
      })(),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const buildPetRequest = () => {
    // Add text fields
    const payload = {
      name: petForm.name.trim(),
      species: petForm.species.trim(),
      breed: petForm.breed.trim() || '',
      age: petForm.age.trim() || '',
      size: petForm.size.trim() || '',
      gender: petForm.gender.trim() || '',
      description: petForm.description.trim(),
      temperament: petForm.temperament.trim() || '',
    }

    // Add uploaded files (not base64 data URLs)
    if (petForm.photos) {
      const photoList = petForm.photos
        .split(',')
        .map((link) => link.trim())
        .filter(Boolean)

      payload.photosJson = photoList.length > 0 ? JSON.stringify(photoList) : null
    } else {
      payload.photosJson = null
    }

    return payload
  }

  const handlePetSubmit = async (event) => {
    event.preventDefault()
    setPetFormError(null)

    if (!petForm.name.trim() || !petForm.species.trim() || !petForm.description.trim()) {
      setPetFormError('Name, species, and description are required to publish a pet.')
      return
    }

    const payload = buildPetRequest()

    try {
      if (editingPetId) {
        await petService.updatePet(editingPetId, payload)
        setStatusMessage('Pet details updated successfully.')
      } else {
        await petService.createPet(payload)
        setStatusMessage('New pet profile created and published.')
      }
      setIsStatusModalOpen(true)
      resetPetForm()
      await refreshPets()
    } catch (err) {
      const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to save pet details.'
      setPetFormError(message)
    }
  }

  const handleStatusChange = async (petId, status) => {
    try {
      await petService.updatePetStatus(petId, status)
      setStatusMessage(`Pet status updated to ${status}.`)
      setIsStatusModalOpen(true)
      await refreshPets()
    } catch (err) {
      const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to change pet status.'
      setError(message)
    }
  }

  const dashboardHeading = useMemo(() => {
    if (!shelterProfile) return 'Shelter dashboard'
    return `${shelterProfile.name || 'Shelter'} dashboard`
  }, [shelterProfile])

  const dismissStatusModal = () => {
    setIsStatusModalOpen(false)
    setStatusMessage(null)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--gradient-soft)' }}>
        <div className="surface-card" style={{ padding: '32px 40px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Loading shelter tools…</div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--gradient-soft)', minHeight: '100vh' }}>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '48px clamp(24px, 6vw, 72px)', display: 'grid', gap: 32 }}>
        <header style={{ display: 'grid', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: '2.4rem', color: '#253b2f' }}>{dashboardHeading}</h1>
          <p style={{ margin: 0, color: '#5e7263', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Update your team profile, refresh shelter info, and keep pet listings current so adopters always see the
            latest stories.
          </p>
        </header>

        {error && (
          <div style={{ background: 'rgba(210, 63, 87, 0.12)', color: '#812334', padding: '14px 18px', borderRadius: 18, fontWeight: 600 }}>
            {error}
          </div>
        )}

        {isStatusModalOpen && statusMessage && (
          <div
            role="alertdialog"
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(23, 37, 23, 0.35)',
              display: 'grid',
              placeItems: 'center',
              padding: '24px',
              zIndex: 999,
            }}
          >
            <div
              className="surface-card"
              style={{
                maxWidth: 420,
                width: '100%',
                padding: '28px 32px',
                borderRadius: 24,
                boxShadow: '0 18px 44px rgba(34, 68, 44, 0.28)',
                display: 'grid',
                gap: 18,
              }}
            >
              <div style={{ display: 'grid', gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#253b2f' }}>Changes saved</h2>
                <p style={{ margin: 0, color: '#5e7263', lineHeight: 1.6 }}>{statusMessage}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-primary" onClick={dismissStatusModal}>
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="surface-card" style={{ padding: '28px clamp(24px, 5vw, 40px)', borderRadius: 26, display: 'grid', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#253b2f' }}>Your staff profile</h2>
              <p style={{ margin: 0, color: '#5e7263' }}>Contact details help adopters and other volunteers reach you quickly. To change your password, visit your <button type="button" onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#4f8a3a', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>account profile</button>.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>First name</label>
              <input
                type="text"
                value={staffForm.firstName}
                onChange={(e) => setStaffForm((prev) => ({ ...prev, firstName: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Last name</label>
              <input
                type="text"
                value={staffForm.lastName}
                onChange={(e) => setStaffForm((prev) => ({ ...prev, lastName: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Phone number</label>
              <input
                type="tel"
                value={staffForm.phoneNumber}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={20}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, '')
                  setStaffForm((prev) => ({ ...prev, phoneNumber: next }))
                }}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Email</label>
              <input
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm((prev) => ({ ...prev, email: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleStaffSave}>
              Save staff profile
            </button>
          </div>
        </section>

        <section className="surface-card" style={{ padding: '28px clamp(24px, 5vw, 40px)', borderRadius: 26, display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#253b2f' }}>Shelter profile</h2>
            <p style={{ margin: 0, color: '#5e7263' }}>Keep information accurate so adopters know how to reach you.</p>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Shelter name</label>
              <input
                type="text"
                value={shelterForm.name}
                onChange={(e) => setShelterForm((prev) => ({ ...prev, name: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Location</label>
              <input
                type="text"
                value={shelterForm.location}
                onChange={(e) => setShelterForm((prev) => ({ ...prev, location: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Contact information</label>
              <input
                type="text"
                value={shelterForm.contactInfo}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={255}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, '')
                  setShelterForm((prev) => ({ ...prev, contactInfo: next }))
                }}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleShelterSave}>
              Save shelter details
            </button>
          </div>
        </section>

        <section className="surface-card" style={{ padding: '28px clamp(24px, 5vw, 40px)', borderRadius: 26, display: 'grid', gap: 24 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#253b2f' }}>{editingPetId ? 'Update pet listing' : 'Create a pet listing'}</h2>
            <p style={{ margin: 0, color: '#5e7263' }}>Share the story, personality, and adoption status of each pet in your care.</p>
          </div>

          {petFormError && (
            <div style={{ background: 'rgba(210, 63, 87, 0.12)', color: '#812334', padding: '12px 18px', borderRadius: 16, fontWeight: 600 }}>
              {petFormError}
            </div>
          )}

          <form onSubmit={handlePetSubmit} style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Pet name <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(text)</span></label>
              <input
                type="text"
                value={petForm.name}
                onChange={(e) => setPetForm((prev) => ({ ...prev, name: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
                required
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Species <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(text)</span></label>
              <input
                type="text"
                value={petForm.species}
                onChange={(e) => setPetForm((prev) => ({ ...prev, species: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
                placeholder="Dog, Cat, Rabbit…"
                required
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Breed <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(text)</span></label>
              <input
                type="text"
                value={petForm.breed}
                onChange={(e) => setPetForm((prev) => ({ ...prev, breed: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Age <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(number)</span></label>
              <input
                type="number"
                value={petForm.age}
                onChange={(e) => setPetForm((prev) => ({ ...prev, age: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
                placeholder="e.g. 2"
                min="0"
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Size <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(dropdown)</span></label>
              <select
                value={petForm.size}
                onChange={(e) => setPetForm((prev) => ({ ...prev, size: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              >
                <option value="">Select size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Gender <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(dropdown)</span></label>
              <select
                value={petForm.gender}
                onChange={(e) => setPetForm((prev) => ({ ...prev, gender: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Description <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(text)</span></label>
              <textarea
                value={petForm.description}
                onChange={(e) => setPetForm((prev) => ({ ...prev, description: e.target.value }))}
                style={{ ...textAreaStyle }}
                required
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Temperament <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(comma separated)</span></label>
              <textarea
                value={petForm.temperament}
                onChange={(e) => setPetForm((prev) => ({ ...prev, temperament: e.target.value }))}
                style={{ ...textAreaStyle, minHeight: 80 }}
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Photos (optional)</label>
              <div style={{ fontSize: '0.85rem', color: '#5e7263', marginBottom: 8 }}>
                Add public image URLs separated by commas.
              </div>
              <textarea
                value={petForm.photos}
                onChange={(e) => setPetForm((prev) => ({ ...prev, photos: e.target.value }))}
                style={{ ...textAreaStyle, minHeight: 90 }}
                placeholder="https://example.com/photo1.jpg, https://example.com/photo2.png"
              />

              {petForm.photos && (
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#253b2f' }}>
                    Uploaded photos ({petForm.photos.split(',').filter(Boolean).length})
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {petForm.photos
                      .split(',')
                      .map((photo) => photo.trim())
                      .filter(Boolean)
                      .map((photo, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center',
                            padding: '10px 12px',
                            background: 'rgba(84,135,104,0.08)',
                            borderRadius: 10,
                          }}
                        >
                          {photo.startsWith('data:') || photo.startsWith('http://') || photo.startsWith('https://') ? (
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 6, background: '#d0d0d0', display: 'grid', placeItems: 'center', fontSize: '1.2rem' }}>
                              🖼️
                            </div>
                          )}
                          <span style={{ flex: 1, wordBreak: 'break-all', fontSize: '0.9rem', color: '#5e7263' }}>
                            {photo.length > 60 ? `${photo.substring(0, 60)}...` : photo}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            style={{
                              background: 'rgba(210, 63, 87, 0.12)',
                              color: '#812334',
                              border: 'none',
                              borderRadius: 6,
                              padding: '6px 10px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary">
                {editingPetId ? 'Save pet changes' : 'Publish pet profile'}
              </button>
              {editingPetId && (
                <button type="button" className="btn btn-outline" onClick={resetPetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

      </main>
    </div>
  )
}

const textAreaStyle = {
  borderRadius: 16,
  padding: '12px 16px',
  border: '1px solid rgba(84,135,104,0.25)',
  lineHeight: 1.6,
  fontFamily: 'inherit',
  fontSize: '1rem',
  background: '#fff',
}

const chipStyle = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 999,
  fontSize: '0.85rem',
  fontWeight: 600,
}
