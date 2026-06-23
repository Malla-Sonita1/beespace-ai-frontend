import axios from 'axios'

export const TOKEN_KEY = 'bs_token'
export const USER_KEY = 'bs_user'

const BEESPACE_AUTH_URL =
  import.meta.env.VITE_BEESPACE_URL || 'http://172.17.1.110:8080/beespace_dev_api'

const api = axios.create({ baseURL: '/api' })

let unauthorizedHandler = null

/** Enregistré par AuthContext pour synchroniser l'état React sur 401. */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearStoredAuth()
      unauthorizedHandler?.()
    }
    return Promise.reject(err)
  }
)

/** Authentification BeeSpace — appel direct (hors proxy /api). */
export const login = async (username, password) => {
  const res = await axios.post(`${BEESPACE_AUTH_URL}/auth/login`, {
    username,
    password,
  })
  return res.data
}

export const sendMessage = async (message, history, offset = 0, sessionId = null) => {
  const res = await api.post('/chat', {
    message,
    history,
    list_offset: offset,
    session_id: sessionId || undefined,
  })
  return res.data
}

export const getSessions = async () => {
  const res = await api.get('/sessions')
  return res.data
}

export const getSessionMessages = async (sessionId) => {
  const res = await api.get(`/sessions/${sessionId}/messages`)
  return res.data
}

export const renameSession = async (sessionId, title) => {
  const res = await api.patch(`/sessions/${sessionId}`, { title })
  return res.data
}

export const deleteSession = async (sessionId) => {
  const res = await api.delete(`/sessions/${sessionId}`)
  return res.data
}

export const checkHealth = async () => {
  const res = await api.get('/health')
  return res.data
}

export const rateMessage = async (sessionId, messageId, rating) => {
  const res = await api.post('/chat/rate', {
    session_id: sessionId,
    message_id: messageId,
    rating,
  })
  return res.data
}

export default api
