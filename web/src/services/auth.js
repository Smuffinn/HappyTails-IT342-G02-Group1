import api from './api'

export const authService = {
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials)
      return res.data
    } catch (err) {
      // Normalize error
      if (err.response && err.response.data) throw err.response.data
      throw err
    }
  },

  registerAdopter: async (payload) => {
    try {
      const res = await api.post('/auth/register-adopter', payload)
      return res.data
    } catch (err) {
      if (err.response && err.response.data) throw err.response.data
      throw err
    }
  },

  registerStaff: async (payload) => {
    try {
      const res = await api.post('/auth/register-staff', payload)
      return res.data
    } catch (err) {
      if (err.response && err.response.data) throw err.response.data
      throw err
    }
  },
}

export default authService
