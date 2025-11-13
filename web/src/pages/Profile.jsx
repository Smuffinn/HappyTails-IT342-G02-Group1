import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/auth'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const token = (() => { try { return JSON.parse(localStorage.getItem('happytails_token')) } catch { return null } })()
    if (!token) {
      // Not authenticated — redirect to login
      navigate('/login')
      return
    }
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await authService.getProfile()
      setProfile(data)
      setForm({
        profilePersonalInfo: data.profilePersonalInfo || '',
        profileResidenceDetails: data.profileResidenceDetails || '',
        profilePetExperience: data.profilePetExperience || ''
      })
    } catch (e) {
      // If unauthorized, clear token and redirect to login
      if (e && e.status && (e.status === 401 || e.status === 403)) {
        localStorage.removeItem('happytails_token')
        navigate('/login')
        return
      }
      // Normalize error display
      setError(e?.message || JSON.stringify(e))
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setLoading(true)
    setError(null)
    try {
      await authService.updateProfile(form)
      setEditing(false)
      await load()
    } catch (e) {
      if (e && e.status && (e.status === 401 || e.status === 403)) {
        localStorage.removeItem('happytails_token')
        navigate('/login')
        return
      }
      setError(e?.message || JSON.stringify(e))
    } finally {
      setLoading(false)
    }
  }

  async function remove() {
    if (!confirm('Delete your account? This cannot be undone.')) return
    try {
      await authService.deleteAccount()
      // Simple client-side cleanup
      localStorage.removeItem('happytails_token')
      window.location.href = '/'
    } catch (e) {
      if (e && e.status && (e.status === 401 || e.status === 403)) {
        localStorage.removeItem('happytails_token')
        navigate('/login')
        return
      }
      setError(e?.message || JSON.stringify(e))
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{JSON.stringify(error)}</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

      {profile && (
        <div className="bg-white rounded shadow p-4">
          <div className="mb-4">
            <strong>Email:</strong> {profile.email}
          </div>

          {!editing ? (
            <div>
              <div className="mb-2"><strong>Personal info:</strong>
                <pre className="bg-slate-50 p-2 rounded mt-1">{profile.profilePersonalInfo}</pre>
              </div>
              <div className="mb-2"><strong>Residence details:</strong>
                <pre className="bg-slate-50 p-2 rounded mt-1">{profile.profileResidenceDetails}</pre>
              </div>
              <div className="mb-2"><strong>Pet experience:</strong>
                <pre className="bg-slate-50 p-2 rounded mt-1">{profile.profilePetExperience}</pre>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="px-4 py-2 bg-emerald-700 text-white rounded" onClick={() => setEditing(true)}>Edit</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={remove}>Delete account</button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block mb-2">Personal info</label>
              <textarea className="w-full p-2 border rounded" rows={4} value={form.profilePersonalInfo} onChange={e => setForm({...form, profilePersonalInfo: e.target.value})} />

              <label className="block mt-3 mb-2">Residence details</label>
              <textarea className="w-full p-2 border rounded" rows={3} value={form.profileResidenceDetails} onChange={e => setForm({...form, profileResidenceDetails: e.target.value})} />

              <label className="block mt-3 mb-2">Pet experience</label>
              <textarea className="w-full p-2 border rounded" rows={3} value={form.profilePetExperience} onChange={e => setForm({...form, profilePetExperience: e.target.value})} />

              <div className="flex space-x-2 mt-4">
                <button className="px-4 py-2 bg-emerald-700 text-white rounded" onClick={save}>Save</button>
                <button className="px-4 py-2 bg-slate-200 rounded" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
