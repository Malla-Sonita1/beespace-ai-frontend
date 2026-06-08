import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// BUG #1 fix: lire depuis localStorage (le token BeeSpace y est stocké)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bs_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// BUG #6 fix: intercepteur réponse → 401 clear + redirect login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bs_token')
      localStorage.removeItem('bs_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const login = async (username, password) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BEESPACE_URL || 'http://172.17.1.110:8080/beespace_dev_api'}/auth/login`,
    { username, password }
  )
  return res.data // { token, user: { nom, prenom, roles } }
}

// BUG #2 fix: "offset" (pas "list_offset") — BUG #7 fix: pas de user_jwt dans le body
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
