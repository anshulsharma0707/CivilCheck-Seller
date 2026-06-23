import API from './axios'

// Phone number daalo → backend OTP bhejega
export const sendOtp = async (phone) => {
  const response = await API.post('/auth/send-otp', { phone })
  return response.data
}

// Buyer OTP verify
export const verifyOtp = async (phone, otp) => {
  const response = await API.post('/auth/verify-otp', { phone, otp })
  return response.data
}

// Seller OTP verify — sellerId token milega
export const sellerVerifyOtp = async (phone, otp) => {
  const response = await API.post('/auth/seller/verify-otp', { phone, otp })
  return response.data
}

// Naya seller signup
export const sellerRegister = async (data) => {
  const response = await API.post('/seller/register', data)
  return response.data
}

// Logged-in seller ki info
export const getMe = async () => {
  const response = await API.get('/auth/me')
  return response.data
}