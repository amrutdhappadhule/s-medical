import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('swami_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('swami_token')
      localStorage.removeItem('swami_user')
      window.location.href = '/login'
    }
    const message = error.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(Array.isArray(message) ? message[0] : message))
  }
)

export default api
