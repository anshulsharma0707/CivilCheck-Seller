import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, seller } = useAuth()

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ⚠️ DEV MODE — Direct OTP login. Sirf "12345" se login hoga.
  // Live karne ke baad yeh hata dena.
  const DEV_MODE = true

  // Jaise hi seller state set ho jaye, dashboard pe bhejo
  // (App.jsx wala "seller ? Navigate to dashboard" bhi same kaam karega,
  //  but yeh explicit navigation zyada reliable hai)
  useEffect(() => {
    if (seller) {
      navigate('/dashboard', { replace: true })
    }
  }, [seller, navigate])

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      setError('OTP daalo')
      return
    }
    setLoading(true)
    setError('')

    // DEV mode — sirf "12345" accept karo
    setTimeout(() => {
      if (otp === '12345') {
        const fakeToken = 'dev_token_' + Date.now()
        const fakeSeller = {
          phone: '9999999999',
          name: 'Priya Sharma',
          profession: 'Property Lawyer, Jaipur',
          badge: 'SILVER',
        }
        login(fakeToken, fakeSeller)
        // navigate yahan NAHI — useEffect handle karega jab seller set hoga
      } else {
        setError('Galat OTP — dev mode mein "12345" daalo')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div style={s.bg}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Crimson+Pro:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #f0a500 !important; outline: none; }
        .login-btn:hover { opacity: 0.92; }
      `}</style>

      <div style={s.box}>
        {/* Logo */}
        <div style={s.logoRow}>
          <div style={s.logoIcon}>🏛️</div>
          <div>
            <div style={s.logoName}>CivilCheck</div>
            <div style={s.logoSub}>Seller Portal</div>
          </div>
        </div>

        {/* DEV banner */}
        {DEV_MODE && (
          <div style={s.devBanner}>
            🔧 DEV MODE — OTP: <strong>12345</strong>
          </div>
        )}

        {/* Heading */}
        <div style={{ marginBottom: 24 }}>
          <div style={s.heading}>Welcome back</div>
          <div style={s.subHeading}>OTP daalo aur login karo</div>
        </div>

        {error && <div style={s.errorBox}>⚠️ {error}</div>}

        {/* OTP only */}
        <div style={s.field}>
          <label style={s.label}>Enter OTP</label>
          <input
            type="text"
            placeholder="12345"
            value={otp}
            onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
            style={{ ...s.input, textAlign: 'center', letterSpacing: 8, fontSize: 18, width: '100%' }}
            autoFocus
          />
        </div>

        <button
          className="login-btn"
          onClick={handleVerifyOtp}
          disabled={loading}
          style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Verifying...' : 'Verify & Login →'}
        </button>

        <div style={s.footer}>
          Zytexa Technology LLP · Seller Login
        </div>
      </div>
    </div>
  )
}

const s = {
  bg: {
    minHeight: '100vh',
    background: '#0a0c10',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Sora', sans-serif",
    padding: 16,
  },
  box: {
    background: '#111318',
    border: '1px solid #2a3045',
    borderRadius: 20,
    padding: '44px 40px',
    width: 420,
    maxWidth: '100%',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  logoIcon: {
    width: 44, height: 44,
    background: '#f0a500',
    borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22,
  },
  logoName: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: 26, fontWeight: 600,
    color: '#e6e9f0',
  },
  logoSub: { fontSize: 12, color: '#7b8299', marginTop: 2 },
  devBanner: {
    background: 'rgba(240,165,0,0.1)',
    border: '1px solid rgba(240,165,0,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f0a500',
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  heading: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: 22, fontWeight: 600,
    color: '#e6e9f0',
  },
  subHeading: { fontSize: 13, color: '#7b8299', marginTop: 4 },
  errorBox: {
    background: 'rgba(240,68,68,0.1)',
    border: '1px solid rgba(240,68,68,0.3)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f04444',
    fontSize: 13, marginBottom: 16,
  },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 12, color: '#7b8299', marginBottom: 7, fontWeight: 600 },
  input: {
    background: '#171b23',
    border: '1px solid #2a3045',
    borderRadius: 9,
    padding: '11px 14px',
    color: '#e6e9f0',
    fontSize: 14,
    fontFamily: "'Sora', sans-serif",
  },
  btn: {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 9,
    border: 'none',
    cursor: 'pointer',
    background: '#f0a500',
    color: '#0a0c10',
    fontSize: 15, fontWeight: 700,
    marginTop: 4,
    fontFamily: "'Sora', sans-serif",
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    color: '#3d4560',
    fontSize: 12,
    borderTop: '1px solid #222736',
    paddingTop: 20,
  },
}