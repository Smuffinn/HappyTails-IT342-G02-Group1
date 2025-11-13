import axios from 'axios';

// Create a central 'instance' of axios
const api = axios.create({
  /**
   * Use a relative /api base in dev; Vite proxies /api to the backend (configured in vite.config.js).
   * In production change this to the real backend host.
   */
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header automatically when token is present
api.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem('happytails_token'))
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

/**
 * We can add interceptors here later for handling JWT tokens.
 * For now, just export the plain api instance.
 */

export default api;