import axios from 'axios'

// Backend ka address — local computer pe port 8000 par chal raha hai
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Har API call se pehle automatically token attach karo
// Toh har jagah manually likhne ki zaroorat nahi
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('seller_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Agar token expire ho jaye (401 error), automatically logout karo
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('seller_token')
      localStorage.removeItem('seller_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API