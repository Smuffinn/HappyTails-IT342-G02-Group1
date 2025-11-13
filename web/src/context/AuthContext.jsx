import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'

const STORAGE_KEY = 'happytails_token'

const AuthContext = createContext(null)

const readStoredToken = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

const decodeBase64Url = (input) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

const parseJwt = (token) => {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const decoded = JSON.parse(decodeBase64Url(payload))
    return decoded
  } catch (error) {
    return null
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [token, setToken] = useState(null)
  const [roles, setRoles] = useState([])
  const [email, setEmail] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    try {
      const stored = readStoredToken()
      if (!stored) {
        setInitializing(false)
        return
      }
      setToken(stored)
      const payload = parseJwt(stored)
      if (payload) {
        setRoles(payload.roles || payload.authorities || [])
        setEmail(payload.sub || payload.email || null)
      }
    } catch (error) {
      // ignore
    } finally {
      setInitializing(false)
    }
  }, [])

  const persistToken = useCallback((rawToken) => {
    if (!rawToken) {
      localStorage.removeItem(STORAGE_KEY)
      setToken(null)
      setRoles([])
      setEmail(null)
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawToken))
    setToken(rawToken)
    const payload = parseJwt(rawToken)
    setRoles(payload?.roles || payload?.authorities || [])
    setEmail(payload?.sub || payload?.email || null)
  }, [])

  const login = useCallback(
    async ({ email: emailInput, password: passwordInput }) => {
      const response = await authService.login({ email: emailInput, password: passwordInput })
      const nextToken = response?.token || response
      persistToken(nextToken)
      return { token: nextToken }
    },
    [persistToken],
  )

  const logout = useCallback(() => {
    persistToken(null)
    navigate('/')
  }, [navigate, persistToken])

  const registerAdopter = useCallback(async (payload) => authService.registerAdopter(payload), [])

  const registerStaff = useCallback(async (payload) => authService.registerStaff(payload), [])

  const value = useMemo(() => {
    const effectiveToken = token ?? readStoredToken()
    return {
      token: effectiveToken,
      roles,
      email,
      initializing,
      login,
      logout,
      registerAdopter,
      registerStaff,
      isAdopter: roles.includes('ROLE_ADOPTER'),
      isStaff: roles.includes('ROLE_STAFF'),
      isAuthenticated: Boolean(effectiveToken),
    }
  }, [token, roles, email, initializing, login, logout, registerAdopter, registerStaff])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
