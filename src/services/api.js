import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Injecte le JWT dans chaque requête si présent
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('bs_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const login = async (username, password) => {
  // Appel login BeeSpace — adapte l'endpoint selon la doc BeeSpace
  const res = await axios.post(
    `${import.meta.env.VITE_BEESPACE_URL || 'http://172.17.1.110:8080/beespace_dev_api'}/auth/login`,
    { username, password }
  )
  return res.data // { token, user: { nom, prenom, roles } }
}

export const sendMessage = async (message, history, userJwt, listOffset = 0, sessionId = null) => {
  const res = await api.post('/chat', {
    message,
    history,
    user_jwt: userJwt || undefined,
    list_offset: listOffset,
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
