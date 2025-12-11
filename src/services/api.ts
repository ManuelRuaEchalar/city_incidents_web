import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // IMPORTANT: Enables cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status

      // Handle authentication errors
      if (status === 401 || status === 403) {
        // Only redirect if we are in the admin section and not already on login page
        // This prevents redirect loops on public pages if the API returns 401
        if (
          window.location.pathname.startsWith('/admin') &&
          !window.location.pathname.includes('/login')
        ) {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
