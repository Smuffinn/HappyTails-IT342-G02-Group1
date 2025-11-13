import api from './api'

export const applicationService = {
  submitApplication: async ({ petId, supplementaryAnswers }) => {
    try {
      const res = await api.post('/applications', { petId, supplementaryAnswers })
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  },

  getMyApplications: async () => {
    try {
      const res = await api.get('/applications/me')
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  },

  listAll: async () => {
    try {
      const res = await api.get('/applications')
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  },

  updateStatus: async (id, status) => {
    try {
      const res = await api.put(`/applications/${id}/status`, { status })
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  }
}

export default applicationService
