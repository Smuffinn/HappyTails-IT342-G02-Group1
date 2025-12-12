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
  const { initializing, isStaff } = useAuth()

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
  const [dragActive, setDragActive] = useState(false)

  const [statusMessage, setStatusMessage] = useState(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      setPetFormError('Please upload image files (JPG, PNG, GIF, etc.)')
      return
    }

    // Convert files to base64 or URLs
    const filePromises = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result
          // Validate base64 string is complete and properly formatted
          if (result && typeof result === 'string' && result.startsWith('data:')) {
            resolve(result)
          } else {
            resolve(null)
          }
        }
        reader.onerror = () => {
          resolve(null)
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(filePromises).then((dataUrls) => {
      const currentPhotos = petForm.photos ? petForm.photos.split(',').map((p) => p.trim()) : []
      const allPhotos = [...currentPhotos, ...dataUrls].filter(Boolean)
      setPetForm((prev) => ({ ...prev, photos: allPhotos.join(', ') }))
      setPetFormError(null)
    })
  }

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
    const formData = new FormData()

    // Add text fields
    formData.append('name', petForm.name.trim())
    formData.append('species', petForm.species.trim())
    if (petForm.breed.trim()) formData.append('breed', petForm.breed.trim())
    if (petForm.age.trim()) formData.append('age', petForm.age.trim())
    if (petForm.size.trim()) formData.append('size', petForm.size.trim())
    if (petForm.gender.trim()) formData.append('gender', petForm.gender.trim())
    formData.append('description', petForm.description.trim())
    if (petForm.temperament.trim()) formData.append('temperament', petForm.temperament.trim())

    // Add uploaded files (not base64 data URLs)
    if (petForm.photos) {
      const photoList = petForm.photos
        .split(',')
        .map((link) => link.trim())
        .filter(Boolean)
        .filter((photo) => {
          // Only include base64 data URLs (uploaded files)
          return photo.startsWith('data:image/')
        })

      photoList.forEach((photoDataUrl, index) => {
        // Convert base64 data URL to Blob
        const [mimeType, base64Data] = photoDataUrl.split(',')
        const mime = mimeType.split(':')[1].split(';')[0]
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: mime })

        // Create File object
        const file = new File([blob], `photo-${index + 1}.jpg`, { type: mime })
        formData.append('photos', file)
      })
    }

    return formData
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
                onChange={(e) => setStaffForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
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
                onChange={(e) => setShelterForm((prev) => ({ ...prev, contactInfo: e.target.value }))}
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
              <label>Age <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(text)</span></label>
              <input
                type="text"
                value={petForm.age}
                onChange={(e) => setPetForm((prev) => ({ ...prev, age: e.target.value }))}
                className="input"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
                placeholder="e.g. 2 years"
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Size <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(text)</span></label>
              <input
                type="text"
                value={petForm.size}
                onChange={(e) => setPetForm((prev) => ({ ...prev, size: e.target.value }))}
                className="input"
                placeholder="Small, Medium, Large"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label>Gender <span style={{ color: '#5e7263', fontSize: '0.85rem', fontWeight: 'normal' }}>(text)</span></label>
              <input
                type="text"
                value={petForm.gender}
                onChange={(e) => setPetForm((prev) => ({ ...prev, gender: e.target.value }))}
                className="input"
                placeholder="Male, Female, Unknown"
                style={{ borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(84,135,104,0.25)' }}
              />
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
                Upload images (JPG, PNG, GIF) or add image URLs. Base64 images are displayed locally but not sent to server.
              </div>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  borderRadius: 14,
                  border: `2px dashed ${dragActive ? '#4f8a3a' : 'rgba(84,135,104,0.25)'}`,
                  padding: '28px 20px',
                  textAlign: 'center',
                  background: dragActive ? 'rgba(79, 138, 58, 0.08)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📸</div>
                  <div style={{ fontWeight: 600, color: '#253b2f', marginBottom: '4px' }}>
                    Drop photos here or click to browse
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#5e7263' }}>
                    Drag and drop images or select multiple files (JPG, PNG, GIF)
                  </div>
                </label>
              </div>

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
                          {photo.startsWith('data:') ? (
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

        {pets.length > 0 && (
          <section className="surface-card" style={{ padding: '28px clamp(24px, 5vw, 40px)', borderRadius: 26, display: 'grid', gap: 18 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#253b2f' }}>Current pet listings</h2>
              <p style={{ margin: 0, color: '#5e7263' }}>Update statuses as applications arrive so adopters see accurate availability.</p>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {pets.map((pet) => (
                <article key={pet.id} style={{ borderRadius: 22, border: '1px solid rgba(84,135,104,0.15)', background: '#fff', padding: '20px 22px', display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#253b2f' }}>{pet.name}</h3>
                        <span style={{ ...chipStyle, background: 'rgba(84,135,104,0.12)', color: '#4f8a3a' }}>{pet.raw?.status || 'Unknown'}</span>
                      </div>
                      <span style={{ color: '#5e7263' }}>{[pet.breed, pet.age, pet.raw?.species].filter(Boolean).join(' • ')}</span>
                      <p style={{ margin: 0, color: '#5e7263' }}>{pet.raw?.description}</p>
                    </div>
                    {pet.imageUrl && (
                      <img src={pet.imageUrl} alt={pet.name} style={{ width: 100, height: 100, borderRadius: 16, objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <label style={{ fontSize: 14, color: '#5e7263' }}>Change status:</label>
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(pet.id, status)}
                        className="btn btn-outline"
                        style={{
                          borderColor: pet.raw?.status === status ? '#78c977' : 'rgba(84,135,104,0.25)',
                          color: pet.raw?.status === status ? '#2a5f24' : '#4f8a3a',
                          background: pet.raw?.status === status ? 'rgba(120,201,119,0.16)' : 'transparent',
                        }}
                      >
                        {status}
                      </button>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={() => handlePetEdit(pet)}>
                      Edit details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
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
