import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  login as apiLogin,
  setUnauthorizedHandler,
  TOKEN_KEY,
  USER_KEY,
} from '../services/api'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function persistAuth(jwt, userInfo) {
  localStorage.setItem(TOKEN_KEY, jwt)
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
}

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  const clearSession = useCallback(() => {
    clearAuthStorage()
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(clearSession)
    return () => setUnauthorizedHandler(null)
  }, [clearSession])

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password)
    const jwt = data.token || data.accessToken || data.jwt
    if (!jwt) {
      throw new Error('Token absent dans la réponse BeeSpace')
    }
    const userInfo = data.user || { username }
    persistAuth(jwt, userInfo)
    setToken(jwt)
    setUser(userInfo)
    return userInfo
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  /** Mode dev : coller un JWT BeeSpace obtenu via Postman. */
  const loginWithToken = useCallback((jwt, userInfo = {}) => {
    const trimmed = jwt?.trim()
    if (!trimmed) return
    persistAuth(trimmed, userInfo)
    setToken(trimmed)
    setUser(userInfo)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loginWithToken,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return ctx
}
