import axios from 'axios';

// Create a central 'instance' of axios
const api = axios.create({
  /**
   * Use a relative /api base in dev; Vite proxies /api to the backend (configured in vite.config.js).
   * In production, VITE_API_URL env var points to the deployed backend.
   */
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header automatically when token is present
api.interceptors.request.use((config) => {
  // Don't add Authorization header for auth endpoints (login, register)
  if (config.url && config.url.includes('/auth/')) {
    return config
  }

  try {
    const storedToken = localStorage.getItem('happytails_token')
    if (storedToken) {
      let token = storedToken
      // If stored as JSON string, parse it
      try {
        token = JSON.parse(storedToken)
      } catch (e) {
        // Already a plain string
      }
      // Only add header if we have a valid token
      if (token && typeof token === 'string' && token.trim()) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch (e) {
    // ignore any errors
  }
  return config
})

/**
 * We can add interceptors here later for handling JWT tokens.
 * For now, just export the plain api instance.
 */

export default api;