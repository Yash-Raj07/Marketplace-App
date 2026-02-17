import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
}

export const productsAPI = {
  getAll: (search = '', page = 1, limit = 10) =>
    api.get('/products', { params: { search, page, limit } }),
  getOne: (id) =>
    api.get(`/products/${id}`),
  create: (data) =>
    api.post('/products', data),
  update: (id, data) =>
    api.put(`/products/${id}`, data),
  delete: (id) =>
    api.delete(`/products/${id}`),
}

export const favoritesAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get('/favorites', { params: { page, limit } }),
  add: (productId) =>
    api.post(`/favorites/${productId}`),
  remove: (productId) =>
    api.delete(`/favorites/${productId}`),
  check: (productId) =>
    api.get(`/favorites/${productId}/check`),
}

export default api
