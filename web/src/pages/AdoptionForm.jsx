import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { authService } from '../services/auth'
import { petService } from '../services/petservice'
import applicationService from '../services/applicationService'

const textFieldStyles = {
  width: '100%',
  borderRadius: 18,
  border: '1px solid rgba(120, 201, 119, 0.35)',
  padding: '14px 18px',
  fontFamily: 'inherit',
  fontSize: '1rem',
  color: 'var(--color-text)',
  background: 'rgba(255, 255, 255, 0.94)',
  resize: 'vertical',
  lineHeight: 1.55,
  minHeight: 110,
}

export default function AdoptionForm() {
  const { initializing, isAuthenticated, isAdopter } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const petIdParam = searchParams.get('petId')
  const petId = petIdParam ? Number(petIdParam) : null

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [pet, setPet] = useState(null)
  const [profileSnapshot, setProfileSnapshot] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState({
    personalInfo: '',
    residenceDetails: '',
    petExperience: '',
    supplementary: '',
  })

  useEffect(() => {
    if (initializing) return

    if (!petId) {
      navigate('/discover', { replace: true })
      return
    }

    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: { from: `/adoption-form?petId=${petId}` },
      })
      return
    }

    if (!isAdopter) {
      navigate('/', { replace: true })
      return
    }

    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [profileData, petData] = await Promise.all([
          authService.getProfile(),
          petService.getPetById(petId),
        ])

        if (!active) return

        if (!petData) {
          setError('We could not find that pet. Please choose another companion.')
          setLoading(false)
          return
        }

        const snapshot = {
          personalInfo: profileData?.profilePersonalInfo || '',
          residenceDetails: profileData?.profileResidenceDetails || '',
          petExperience: profileData?.profilePetExperience || '',
        }

        setProfileSnapshot(snapshot)
        setForm((prev) => ({
          ...prev,
          personalInfo: snapshot.personalInfo,
          residenceDetails: snapshot.residenceDetails,
          petExperience: snapshot.petExperience,
        }))
        setPet(petData)
      } catch (err) {
        const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to load adoption form.'
        if (active) setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [initializing, isAuthenticated, isAdopter, petId, navigate])

  const hasProfileChanges = useMemo(() => {
    if (!profileSnapshot) return false
    return (
      form.personalInfo !== profileSnapshot.personalInfo ||
      form.residenceDetails !== profileSnapshot.residenceDetails ||
      form.petExperience !== profileSnapshot.petExperience
    )
  }, [form, profileSnapshot])

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!petId || submitting) return

    setSubmitting(true)
    setError(null)
    setStatusMessage(null)

    const trimmedPersonal = form.personalInfo.trim()
    const trimmedResidence = form.residenceDetails.trim()
    const trimmedExperience = form.petExperience.trim()
    const trimmedSupplementary = form.supplementary.trim()

    const nextErrors = {}
    if (!trimmedPersonal) nextErrors.personalInfo = 'Please provide your personal information.'
    if (!trimmedResidence) nextErrors.residenceDetails = 'Please describe your home environment.'
    if (!trimmedExperience) nextErrors.petExperience = 'Let shelters know about your experience with animals.'

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setSubmitting(false)
      return
    }

    try {
      if (hasProfileChanges) {
        await authService.updateProfile({
          profilePersonalInfo: trimmedPersonal,
          profileResidenceDetails: trimmedResidence,
          profilePetExperience: trimmedExperience,
        })
        setStatusMessage('Your profile has been updated for this application.')
        setProfileSnapshot({
          personalInfo: trimmedPersonal,
          residenceDetails: trimmedResidence,
          petExperience: trimmedExperience,
        })
      }

      const summary = [
        `Personal Information:\n${trimmedPersonal}`,
        `Residence Details:\n${trimmedResidence}`,
        `Pet Experience:\n${trimmedExperience}`,
        trimmedSupplementary ? `Additional Notes:\n${trimmedSupplementary}` : null,
      ]
        .filter(Boolean)
        .join('\n\n')

      await applicationService.submitApplication(petId, summary)

      const successPayload = {
        petName: pet?.name || 'your chosen pet',
        petImage: pet?.imageUrl || null,
        timestamp: Date.now(),
      }

      try {
        sessionStorage.setItem('happytails_last_adoption', JSON.stringify(successPayload))
      } catch (storageError) {
        // ignore storage failures
      }

      navigate('/adoption-success', {
        replace: true,
        state: successPayload,
      })
    } catch (err) {
      const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to submit application. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="surface-card" style={{ padding: '32px 40px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Loading adoption form…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div className="surface-card" style={{ maxWidth: 520, padding: '36px 40px', textAlign: 'center', display: 'grid', gap: 20 }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#253b2f' }}>We hit a snag</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{error}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/discover')}>
              Back to Discover
            </button>
            <button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)' }}>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px clamp(24px, 6vw, 72px)', display: 'grid', gap: 32 }}>
        <header style={{ display: 'grid', gap: 12 }}>
          <span className="badge">Adoption Application</span>
          <h1 style={{ margin: 0, fontSize: '2.3rem', color: '#253b2f' }}>Almost there!</h1>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 16 }}>
            Review your saved application details and share a quick note with the shelter. Updating this form will
            also refresh your adopter profile for future applications.
          </p>
        </header>

        {pet && (
          <section className="surface-card" style={{ padding: '24px 28px', borderRadius: 24, display: 'grid', gap: 18 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <img
                src={pet.imageUrl || '/vite.svg'}
                alt={pet.name}
                style={{ width: 110, height: 110, borderRadius: 20, objectFit: 'cover' }}
              />
              <div style={{ display: 'grid', gap: 6 }}>
                <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#253b2f' }}>{pet.name}</h2>
                <p style={{ margin: 0, color: '#5e7263' }}>{[pet.breed, pet.age, pet.raw?.species].filter(Boolean).join(' • ')}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {(pet.tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} style={{ background: '#f1efe6', borderRadius: 999, padding: '6px 16px', fontWeight: 600, fontSize: 13, color: '#4f8a3a' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Link to={`/discover`} style={{ fontSize: 14, color: '#4f8a3a', fontWeight: 600, textDecoration: 'none' }}>
              ← Choose a different pet
            </Link>
          </section>
        )}

        <form className="surface-card" onSubmit={handleSubmit} style={{ padding: '32px clamp(24px, 6vw, 48px)', borderRadius: 28, display: 'grid', gap: 24 }}>
          {statusMessage && (
            <div style={{ borderRadius: 18, padding: '14px 18px', background: 'rgba(122, 192, 91, 0.16)', color: '#2a5f24', fontWeight: 600 }}>
              {statusMessage}
            </div>
          )}

          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <label htmlFor="personalInfo" style={{ display: 'block', fontWeight: 600, color: 'var(--color-text)' }}>
                Personal information
              </label>
              <p style={{ margin: '6px 0 10px', fontSize: 14, color: 'var(--color-text-muted)' }}>
                Include your name, age, household members, and anything the shelter should know about you.
              </p>
              <textarea
                id="personalInfo"
                style={textFieldStyles}
                value={form.personalInfo}
                onChange={handleChange('personalInfo')}
              />
              {fieldErrors.personalInfo && (
                <div style={{ color: '#d64545', fontSize: 13, marginTop: 6 }}>{fieldErrors.personalInfo}</div>
              )}
            </div>

            <div>
              <label htmlFor="residenceDetails" style={{ display: 'block', fontWeight: 600, color: 'var(--color-text)' }}>
                Residence details
              </label>
              <p style={{ margin: '6px 0 10px', fontSize: 14, color: 'var(--color-text-muted)' }}>
                Describe your home, outdoor space, and daily schedule so the shelter can ensure a great match.
              </p>
              <textarea
                id="residenceDetails"
                style={textFieldStyles}
                value={form.residenceDetails}
                onChange={handleChange('residenceDetails')}
              />
              {fieldErrors.residenceDetails && (
                <div style={{ color: '#d64545', fontSize: 13, marginTop: 6 }}>{fieldErrors.residenceDetails}</div>
              )}
            </div>

            <div>
              <label htmlFor="petExperience" style={{ display: 'block', fontWeight: 600, color: 'var(--color-text)' }}>
                Pet care experience
              </label>
              <p style={{ margin: '6px 0 10px', fontSize: 14, color: 'var(--color-text-muted)' }}>
                Share any experience you have caring for pets, training, or working with shelters.
              </p>
              <textarea
                id="petExperience"
                style={textFieldStyles}
                value={form.petExperience}
                onChange={handleChange('petExperience')}
              />
              {fieldErrors.petExperience && (
                <div style={{ color: '#d64545', fontSize: 13, marginTop: 6 }}>{fieldErrors.petExperience}</div>
              )}
            </div>

            <div>
              <label htmlFor="supplementary" style={{ display: 'block', fontWeight: 600, color: 'var(--color-text)' }}>
                Additional message to the shelter (optional)
              </label>
              <textarea
                id="supplementary"
                style={{ ...textFieldStyles, minHeight: 120 }}
                placeholder="Share any questions, references, or special requests."
                value={form.supplementary}
                onChange={handleChange('supplementary')}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ padding: '14px 28px', fontSize: 16, borderRadius: 999 }}
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              disabled={submitting}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>

        <section className="surface-card" style={{ padding: '26px clamp(20px, 5vw, 40px)', borderRadius: 24, color: 'var(--color-text-muted)', fontSize: 14 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: '1.2rem', color: 'var(--color-text)' }}>What happens next?</h2>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
            <li>The shelter will review your application and reach out via email within 1-3 business days.</li>
            <li>You can track updates on the <Link to="/applications" style={{ color: '#4f8a3a', fontWeight: 600 }}>My Applications</Link> page.</li>
            <li>Need to adjust your profile later? Visit the <Link to="/profile" style={{ color: '#4f8a3a', fontWeight: 600 }}>Profile</Link> page anytime.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
