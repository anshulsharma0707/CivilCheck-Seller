import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)

  // App start hote hi token check karo
  // Agar token hai toh backend se fresh seller profile fetch karo
  useEffect(() => {
    const token = localStorage.getItem('seller_token')

    if (!token) {
      setLoading(false)
      return
    }

    // Backend se real seller data fetch karo
    API.get('/seller/profile')
      .then((res) => {
        if (res.data.success) {
          setSeller(res.data.seller)
          // Fresh data localStorage mein bhi save karo
          localStorage.setItem('seller_user', JSON.stringify(res.data.seller))
        } else {
          // Profile nahi mili — token saaf karo
          localStorage.removeItem('seller_token')
          localStorage.removeItem('seller_user')
        }
      })
      .catch(() => {
        // 401 ya network error — token invalid hai
        localStorage.removeItem('seller_token')
        localStorage.removeItem('seller_user')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Login hone par token save karo aur seller set karo
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

  // Seller data refresh karo — kisi bhi page se call kar sakte hain
  const refreshSeller = async () => {
    try {
      const res = await API.get('/seller/profile')
      if (res.data.success) {
        setSeller(res.data.seller)
        localStorage.setItem('seller_user', JSON.stringify(res.data.seller))
      }
    } catch {
      // Silent fail — seller state untouched
    }
  }

  return (
    <AuthContext.Provider value={{ seller, loading, login, logoutSeller, refreshSeller }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)