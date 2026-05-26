import API from './axios'

// ─── PROFILE & KYC ────────────────────────────────────────────────────────
export const getSellerProfile = async () => {
  const response = await API.get('/seller/profile')
  return response.data
}

export const updateSellerProfile = async (data) => {
  const response = await API.patch('/seller/profile', data)
  return response.data
}

export const getKycStatus = async () => {
  const response = await API.get('/seller/kyc/status')
  return response.data
}

export const uploadCertificate = async (certificateUrl) => {
  const response = await API.post('/seller/kyc/certificate', { certificateUrl })
  return response.data
}

// ─── LISTINGS ─────────────────────────────────────────────────────────────
export const getMyListings = async (params = {}) => {
  const response = await API.get('/seller/listings', { params })
  return response.data
}

export const getSingleListing = async (id) => {
  const response = await API.get(`/seller/listings/${id}`)
  return response.data
}

export const createListing = async (data) => {
  const response = await API.post('/seller/listings', data)
  return response.data
}

export const updateListing = async (id, data) => {
  const response = await API.put(`/seller/listings/${id}`, data)
  return response.data
}

export const deleteListing = async (id) => {
  const response = await API.delete(`/seller/listings/${id}`)
  return response.data
}

// ─── EARNINGS ─────────────────────────────────────────────────────────────
export const getEarningsOverview = async () => {
  const response = await API.get('/seller/earnings')
  return response.data
}

export const getTransactions = async (params = {}) => {
  const response = await API.get('/seller/earnings/transactions', { params })
  return response.data
}

export const getEarningsStatement = async (params = {}) => {
  const response = await API.get('/seller/earnings/statement', { params })
  return response.data
}

// ─── SETTLEMENTS ──────────────────────────────────────────────────────────
export const getSettlements = async () => {
  const response = await API.get('/seller/earnings/settlements')
  return response.data
}

export const getPendingSettlement = async () => {
  const response = await API.get('/seller/earnings/settlements/pending')
  return response.data
}

// ─── SPECIAL REQUESTS ─────────────────────────────────────────────────────
export const getAvailableRequests = async () => {
  const response = await API.get('/seller/special-requests/available')
  return response.data
}

export const acceptRequest = async (id) => {
  const response = await API.post(`/seller/special-requests/${id}/accept`)
  return response.data
}

export const declineRequest = async (id, reason) => {
  const response = await API.post(`/seller/special-requests/${id}/decline`, { reason })
  return response.data
}

export const submitRequest = async (id, listingId) => {
  const response = await API.post(`/seller/special-requests/${id}/submit`, { listingId })
  return response.data
}