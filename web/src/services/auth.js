import api from './api'

// Helper function to decode JWT and check user role
export function getUserRoleFromToken() {
  try {
    let token = localStorage.getItem('happytails_token')
    if (!token) return null
    
    // If stored as JSON string, parse it
    try {
      token = JSON.parse(token)
    } catch (e) {
      // Already a plain string, continue
    }
    
    // Remove Bearer prefix if present
    const tokenStr = token.startsWith('Bearer ') ? token.substring(7) : token
    
    // Split and decode JWT payload
    const parts = tokenStr.split('.')
    if (parts.length !== 3) return null
    
    const decoded = JSON.parse(atob(parts[1]))
    console.log('Decoded JWT:', decoded) // Debug log
    
    // Check both 'roles' and 'authorities' fields (Spring Security uses different names)
    const rolesArray = decoded.roles || decoded.authorities || []
    if (rolesArray.includes('ROLE_STAFF')) {
      return 'staff'
    }
    
    return 'adopter' // default
  } catch (e) {
    console.error('Failed to decode token:', e)
    return null
  }
}

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
      const role = getUserRoleFromToken()
      console.log('User role detected:', role) // Debug log
      
      if (role === 'staff') {
        const res = await api.get('/staff/me')
        return res.data
      }
      
      // Default to adopter endpoint
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
      const role = getUserRoleFromToken()
      
      if (role === 'staff') {
        // Staff profiles are read-only
        throw new Error('Staff profiles cannot be edited')
      }
      
      // Default to adopter endpoint
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
      const role = getUserRoleFromToken()
      
      if (role === 'staff') {
        const res = await api.delete('/staff/me')
        return res.data
      }
      
      // Default to adopter endpoint
      const res = await api.delete('/adopters/me')
      return res.data
    } catch (err) {
      const payload = err.response && err.response.data ? err.response.data : null
      const msg = (payload && (payload.error || payload.message)) || (payload && payload.errors ? JSON.stringify(payload.errors) : null) || err.message || String(err)
      throw new Error(msg)
    }
  }
}

export default authService
