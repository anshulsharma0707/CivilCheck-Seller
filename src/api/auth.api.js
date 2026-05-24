import API from './axios'

// Phone number daalo → backend OTP bhejega
// POST /api/auth/send-otp
export const sendOtp = async (phone) => {
  const response = await API.post('/auth/send-otp', { phone })
  return response.data
}

// OTP verify karo → seller ka token milega
// POST /api/auth/verify-otp
export const verifyOtp = async (phone, otp) => {
  const response = await API.post('/auth/verify-otp', { phone, otp })
  return response.data
}

// Naya seller signup
// POST /api/seller/register
export const sellerRegister = async (data) => {
  const response = await API.post('/seller/register', data)
  return response.data
}

// Logged-in seller ki info
// GET /api/auth/me
export const getMe = async () => {
  const response = await API.get('/auth/me')
  return response.data
}