import { createContext, useContext, useState, useCallback } from 'react'
import { login as apiLogin } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // BUG #1 fix: localStorage (pas sessionStorage) — le token BeeSpace y est stocké
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bs_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('bs_token'))

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password)
    const jwt = data.token || data.accessToken || data.jwt
    const userInfo = data.user || { username }
    localStorage.setItem('bs_token', jwt)
    localStorage.setItem('bs_user', JSON.stringify(userInfo))
    setToken(jwt)
    setUser(userInfo)
    return userInfo
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('bs_token')
    localStorage.removeItem('bs_user')
    setToken(null)
    setUser(null)
  }, [])

  // Mode dev : login manuel avec token direct
  const loginWithToken = useCallback((jwt, userInfo = {}) => {
    localStorage.setItem('bs_token', jwt)
    localStorage.setItem('bs_user', JSON.stringify(userInfo))
    setToken(jwt)
    setUser(userInfo)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loginWithToken, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
