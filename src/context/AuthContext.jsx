import { createContext, useContext, useState, useEffect } from 'react'

// Context = ek box jisme logged-in seller ki info store hogi
// Pure app mein kahin se bhi yeh info access kar sakte hain
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)

  // App start hote hi browser ki memory check karo
  // Agar token mila toh seller ko logged-in maan lo
  useEffect(() => {
    const token = localStorage.getItem('seller_token')
    const savedUser = localStorage.getItem('seller_user')

    if (token && savedUser) {
      try {
        setSeller(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('seller_token')
        localStorage.removeItem('seller_user')
      }
    }
    setLoading(false)
  }, [])

  // Login successful hone par yeh chalega
  const login = (token, sellerData) => {
    localStorage.setItem('seller_token', token)
    localStorage.setItem('seller_user', JSON.stringify(sellerData))
    setSeller(sellerData)
  }

  // Logout — sab kuch saaf
  const logoutSeller = () => {
    localStorage.removeItem('seller_token')
    localStorage.removeItem('seller_user')
    setSeller(null)
  }

  return (
    <AuthContext.Provider value={{ seller, loading, login, logoutSeller }}>
      {children}
    </AuthContext.Provider>
  )
}

// Kahin bhi useAuth() lagao toh seller ki info mil jayegi
export const useAuth = () => useContext(AuthContext)