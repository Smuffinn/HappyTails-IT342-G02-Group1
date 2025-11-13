import api from './api'

export const authService = {
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials)
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  },

  registerAdopter: async (payload) => {
    try {
      const res = await api.post('/auth/register-adopter', payload)
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  },

  registerStaff: async (payload) => {
    try {
      const res = await api.post('/auth/register-staff', payload)
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  },

  // Profile endpoints
  getProfile: async () => {
    try {
      const res = await api.get('/adopters/me')
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  },

  updateProfile: async (payload) => {
    try {
      const res = await api.put('/adopters/profile', payload)
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  },

  deleteAccount: async () => {
    try {
      const res = await api.delete('/adopters')
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  }
}

export default authService
