import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { useAuth } from '../context/AuthContext.jsx'

const messageStyles = {
  base: {
    borderRadius: 16,
    padding: '14px 18px',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  success: {
    background: 'rgba(122, 192, 91, 0.16)',
    color: '#2a5f24',
  },
  error: {
    background: 'rgba(210, 63, 87, 0.12)',
    color: '#812334',
  },
}

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
  lineHeight: 1.5,
  minHeight: 100,
}

export default function Profile() {
  const navigate = useNavigate()
  const { initializing, isAuthenticated, isStaff, email, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    profilePersonalInfo: '',
    profileResidenceDetails: '',
    profilePetExperience: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})

  const userRoleLabel = useMemo(() => (isStaff ? 'Shelter Staff' : 'Adopter'), [isStaff])
  const isAdopter = useMemo(() => !isStaff, [isStaff])

  const profileSnapshot = useMemo(
    () => ({
      profilePersonalInfo: profile?.profilePersonalInfo ?? '',
      profileResidenceDetails: profile?.profileResidenceDetails ?? '',
      profilePetExperience: profile?.profilePetExperience ?? '',
    }),
    [profile],
  )

  const hasProfileContent = useMemo(
    () =>
      Object.values(profileSnapshot).every((value) =>
        typeof value === 'string' ? value.trim().length > 0 : Boolean(value),
      ),
    [profileSnapshot],
  )

  const hasUnsavedChanges = useMemo(() => {
    if (!editing) return false
    return (
      form.profilePersonalInfo !== profileSnapshot.profilePersonalInfo ||
      form.profileResidenceDetails !== profileSnapshot.profileResidenceDetails ||
      form.profilePetExperience !== profileSnapshot.profilePetExperience
    )
  }, [editing, form, profileSnapshot])

  const lastUpdatedDisplay = useMemo(() => {
    if (!profile?.updatedAt) return null
    try {
      return new Date(profile.updatedAt).toLocaleString()
    } catch (error) {
      return null
    }
  }, [profile?.updatedAt])

  const handleAuthFailure = useCallback(() => {
    logout()
    navigate('/login', { replace: true, state: { from: '/profile' } })
  }, [logout, navigate])

  const loadProfile = useCallback(
    async ({ skipLoadingState = false } = {}) => {
      if (!skipLoadingState) {
        setLoading(true)
      }
      setError(null)
      setStatusMessage(null)
      try {
        const data = await authService.getProfile()
        setProfile(data)
        setForm({
          profilePersonalInfo: data.profilePersonalInfo || '',
          profileResidenceDetails: data.profileResidenceDetails || '',
          profilePetExperience: data.profilePetExperience || '',
        })
        return data
      } catch (err) {
        const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to load profile.'
        if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('forbidden')) {
          handleAuthFailure()
          return null
        }
        setError(message)
        return null
      } finally {
        if (!skipLoadingState) {
          setLoading(false)
        }
      }
    },
    [handleAuthFailure],
  )

  useEffect(() => {
    if (initializing) return
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: '/profile' } })
      return
    }
    loadProfile()
  }, [initializing, isAuthenticated, navigate, loadProfile])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      const nextErrors = {}
      const trimmedPersonal = form.profilePersonalInfo.trim()
      const trimmedResidence = form.profileResidenceDetails.trim()
      const trimmedExperience = form.profilePetExperience.trim()

      if (!trimmedPersonal) {
        nextErrors.profilePersonalInfo = 'Please tell us a bit about yourself.'
      }
      if (!trimmedResidence) {
        nextErrors.profileResidenceDetails = 'Let shelters know about your living situation.'
      }
      if (!trimmedExperience) {
        nextErrors.profilePetExperience = 'Share your experience caring for animals.'
      }

      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors)
        setSaving(false)
        return
      }

      const payload = {
        profilePersonalInfo: trimmedPersonal,
        profileResidenceDetails: trimmedResidence,
        profilePetExperience: trimmedExperience,
      }

      await authService.updateProfile(payload)
      setStatusMessage('Profile updated successfully.')
      setEditing(false)
      setForm(payload)
      await loadProfile({ skipLoadingState: true })
      setFieldErrors({})
    } catch (err) {
      const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to update profile.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }, [form, loadProfile])

  const handleDelete = useCallback(async () => {
    const confirmed = window.confirm('Delete your account? This cannot be undone.')
    if (!confirmed) return
    setSaving(true)
    setError(null)
    try {
      await authService.deleteAccount()
      setStatusMessage('Account deleted.')
      logout()
    } catch (err) {
      const message = typeof err?.message === 'string' && err.message.trim().length > 0 ? err.message : 'Unable to delete account.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }, [logout])

  const renderAdoptedPets = () => {
    if (!profile?.adoptedPets?.length) return null
    return (
      <div className="surface-card" style={{ padding: '28px 32px', marginTop: 32 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: '1.3rem', color: 'var(--color-text)' }}>My Adopted Pets</h2>
        <p style={{ marginTop: 0, marginBottom: 18, color: 'var(--color-text-muted)' }}>
          A snapshot of the animals you&apos;ve welcomed into your home.
        </p>
        <div style={{ display: 'grid', gap: 16 }}>
          {profile.adoptedPets.map((pet) => (
            <div
              key={pet.petId ?? pet.name}
              style={{
                borderRadius: 18,
                border: '1px solid rgba(84,135,104,0.12)',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.9)',
                display: 'grid',
                gap: 4,
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{pet.name}</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                {pet.species} • {pet.breed}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#4f8a3a' }}>Status: {pet.status}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderAdopterForm = () => (
    <div style={{ display: 'grid', gap: 20 }}>
      {!editing ? (
        <div style={{ display: 'grid', gap: 18 }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Personal info</div>
            <div
              style={{
                marginTop: 8,
                background: 'var(--color-surface-alt)',
                borderRadius: 18,
                padding: '16px 18px',
                color: 'var(--color-text)',
                whiteSpace: 'pre-line',
              }}
            >
              {profile?.profilePersonalInfo || 'No personal info provided yet.'}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Residence details</div>
            <div
              style={{
                marginTop: 8,
                background: 'var(--color-surface-alt)',
                borderRadius: 18,
                padding: '16px 18px',
                color: 'var(--color-text)',
                whiteSpace: 'pre-line',
              }}
            >
              {profile?.profileResidenceDetails || 'No residence details yet.'}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Pet experience</div>
            <div
              style={{
                marginTop: 8,
                background: 'var(--color-surface-alt)',
                borderRadius: 18,
                padding: '16px 18px',
                color: 'var(--color-text)',
                whiteSpace: 'pre-line',
              }}
            >
              {profile?.profilePetExperience || 'You haven\'t shared your pet experience yet.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setFieldErrors({})
                setStatusMessage(null)
                setEditing(true)
              }}
            >
              Edit profile
            </button>
            <button
              type="button"
              className="btn"
              style={{ background: '#f37c7c', color: '#fff', boxShadow: '0 6px 14px rgba(243, 124, 124, 0.3)' }}
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? 'Processing…' : 'Delete account'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: 'var(--color-text)' }}>Personal info</label>
            <textarea
              style={textFieldStyles}
              rows={4}
              value={form.profilePersonalInfo}
              onChange={(e) => setForm((prev) => ({ ...prev, profilePersonalInfo: e.target.value }))}
              placeholder="Tell adopters about yourself, your family, or household preferences."
            />
            {fieldErrors.profilePersonalInfo && (
              <div style={{ color: '#d64545', fontSize: 13, marginTop: 6 }}>{fieldErrors.profilePersonalInfo}</div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: 'var(--color-text)' }}>Residence details</label>
            <textarea
              style={textFieldStyles}
              rows={3}
              value={form.profileResidenceDetails}
              onChange={(e) => setForm((prev) => ({ ...prev, profileResidenceDetails: e.target.value }))}
              placeholder="Share information about your home, yard, or lifestyle."
            />
            {fieldErrors.profileResidenceDetails && (
              <div style={{ color: '#d64545', fontSize: 13, marginTop: 6 }}>{fieldErrors.profileResidenceDetails}</div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: 'var(--color-text)' }}>Pet experience</label>
            <textarea
              style={textFieldStyles}
              rows={3}
              value={form.profilePetExperience}
              onChange={(e) => setForm((prev) => ({ ...prev, profilePetExperience: e.target.value }))}
              placeholder="Let shelters know about your previous experience with pets."
            />
            {fieldErrors.profilePetExperience && (
              <div style={{ color: '#d64545', fontSize: 13, marginTop: 6 }}>{fieldErrors.profilePetExperience}</div>
            )}
          </div>
          {hasUnsavedChanges && (
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4f8a3a' }}>You have unsaved updates.</div>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setEditing(false)
                setForm({
                  profilePersonalInfo: profile?.profilePersonalInfo || '',
                  profileResidenceDetails: profile?.profileResidenceDetails || '',
                  profilePetExperience: profile?.profilePetExperience || '',
                })
                setFieldErrors({})
              }}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderStaffSummary = () => (
    <div style={{ display: 'grid', gap: 18 }}>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Shelter</div>
        <div
          style={{
            marginTop: 8,
            background: 'var(--color-surface-alt)',
            borderRadius: 18,
            padding: '16px 18px',
            color: 'var(--color-text)',
          }}
        >
          {profile?.shelter?.name || 'No shelter assigned yet.'}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Staff ID</div>
        <div
          style={{
            marginTop: 8,
            background: 'var(--color-surface-alt)',
            borderRadius: 18,
            padding: '16px 18px',
            color: 'var(--color-text)',
          }}
        >
          {profile?.staffId ?? 'Unavailable'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn"
          style={{ background: '#f37c7c', color: '#fff', boxShadow: '0 6px 14px rgba(243, 124, 124, 0.3)' }}
          onClick={handleDelete}
          disabled={saving}
        >
          {saving ? 'Processing…' : 'Delete account'}
        </button>
      </div>
    </div>
  )

  if (initializing) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="surface-card" style={{ padding: '32px 40px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Loading profile…</div>
      </div>
    )
  }
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-soft)' }}>
      <div className="page-shell" style={{ paddingTop: 48, paddingBottom: 72 }}>
        <section className="surface-card" style={{ padding: '36px clamp(18px, 5vw, 48px)', display: 'grid', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="badge">Account</span>
            <h1 style={{ margin: 0, fontSize: '2.1rem', color: 'var(--color-text)' }}>My Profile</h1>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', maxWidth: 540 }}>
              Manage your Happy Tails account details, update your story, and keep shelters informed.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 18,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 600 }}>Email</div>
              <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--color-text)' }}>{profile?.email ?? email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 600 }}>Role</div>
              <div style={{ marginTop: 6, fontWeight: 700, color: '#4f8a3a' }}>{userRoleLabel}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 600 }}>Member since</div>
              <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--color-text)' }}>
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
              </div>
            </div>
          </div>

          {isAdopter && !hasProfileContent && !editing && (
            <div
              style={{
                borderRadius: 18,
                padding: '18px 24px',
                background: 'rgba(122, 192, 91, 0.12)',
                color: '#2a5f24',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16 }}>Complete your saved application profile</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
                Filling in your personal, residence, and pet experience details lets shelters review adoption
                applications faster.
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setFieldErrors({})
                    setStatusMessage(null)
                    setEditing(true)
                  }}
                >
                  Update profile now
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <div style={{ ...messageStyles.base, ...messageStyles.success }}>
              <span role="img" aria-hidden style={{ marginRight: 8 }}>
                ✅
              </span>
              {statusMessage}
            </div>
          )}

          {error && (
            <div style={{ ...messageStyles.base, ...messageStyles.error }}>
              <span role="img" aria-hidden style={{ marginRight: 8 }}>
                ⚠️
              </span>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Loading profile…</div>
          ) : profile ? (
            isStaff ? (
              renderStaffSummary()
            ) : (
              renderAdopterForm()
            )
          ) : null}
          {lastUpdatedDisplay && (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: -6 }}>
              Last updated {lastUpdatedDisplay}
            </div>
          )}
        </section>

        {!isStaff && renderAdoptedPets()}
      </div>
    </div>
  )
}
