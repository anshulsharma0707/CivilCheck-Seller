import { useState } from 'react'
import DashboardHome from './seller/DashboardHome'
import MyListings from './seller/MyListings'
import NewListing from './seller/NewListing'
import SpecialRequests from './seller/SpecialRequests'
import Earnings from './seller/Earnings'
import Settlements from './seller/Settlements'
import KYC from './seller/KYC'
import Notifications from './seller/Notifications'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// Sidebar items
const NAV = [
  { section: 'Main' },
  { id: 'dashboard',     icon: '📊', label: 'Dashboard' },
  { id: 'listings',      icon: '📋', label: 'My Listings',     badge: 12 },
  { id: 'new',           icon: '➕', label: 'New Listing' },
  { id: 'requests',      icon: '📦', label: 'Special Requests', badge: 2, badgeRed: true },

  { section: 'Finance' },
  { id: 'earnings',      icon: '💰', label: 'Earnings' },
  { id: 'settlements',   icon: '🏦', label: 'Settlements' },

  { section: 'Account' },
  { id: 'kyc',           icon: '🎯', label: 'Profile & KYC' },
  { id: 'notifications', icon: '🔔', label: 'Notifications',    badge: 3 },
]

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  listings: 'My Listings',
  new: 'New Listing',
  requests: 'Special Requests',
  earnings: 'Earnings',
  settlements: 'Settlements',
  kyc: 'Profile & KYC',
  notifications: 'Notifications',
}

export default function Layout() {
  const { seller, logoutSeller } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logoutSeller()
    navigate('/login')
  }

  const renderPage = () => {
  switch (tab) {
    case 'dashboard': return <DashboardHome />
    case 'listings': return <MyListings />
    case 'new': return <NewListing />
    case 'requests': return <SpecialRequests />
    case 'earnings': return <Earnings />
    case 'settlements': return <Settlements />
    case 'kyc': return <KYC />
    case 'notifications': return <Notifications />
    default:
      return (
        <div style={s.placeholder}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
          <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 22, fontWeight: 600, color: '#e6e9f0', marginBottom: 8 }}>
            {PAGE_TITLES[tab]} — Coming soon
          </div>
          <div style={{ color: '#7b8299', fontSize: 14 }}>
            Yeh page agle steps mein banayenge
          </div>
        </div>
      )
  }
}

  // Seller ka name aur initials nikalo
  const sellerName = seller?.name || seller?.fullName || 'Seller'
  const sellerInitials = sellerName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'SE'
  const sellerRole = seller?.profession || 'Verified Seller'

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Crimson+Pro:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0c10; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a3045; border-radius: 4px; }
        .sb-item:hover { background: rgba(255,255,255,0.04) !important; color: #e6e9f0 !important; }
        .sb-logout:hover { background: rgba(240,68,68,0.1) !important; color: #f04444 !important; }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .topbar, .main-content { left: 0 !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={s.sidebar}>
        {/* Logo */}
        <div style={s.sbLogo}>
          <div style={s.sbLogoIcon}>🏛️</div>
          <div>
            <div style={s.sbLogoName}>CivilCheck</div>
            <div style={s.sbLogoRole}>Seller Portal</div>
          </div>
        </div>

        {/* Seller pill */}
        <div style={s.sellerPill}>
          <span style={s.spBadge}>🥈</span>
          <div>
            <div style={s.spName}>{sellerName}</div>
            <div style={s.spLevel}>{sellerRole}</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
          {NAV.map((n, i) => {
            if (n.section) return (
              <div key={i} style={s.sbSection}>{n.section}</div>
            )
            const active = tab === n.id
            return (
              <div key={n.id}
                className="sb-item"
                onClick={() => { setTab(n.id); setSidebarOpen(false) }}
                style={{
                  ...s.sbItem,
                  background: active ? 'rgba(240,165,0,0.12)' : 'transparent',
                  color: active ? '#f0a500' : '#7b8299',
                  borderLeft: active ? '2px solid #f0a500' : '2px solid transparent',
                }}>
                <span style={{ fontSize: 15 }}>{n.icon}</span>
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge && (
                  <span style={{
                    ...s.sbBadge,
                    background: n.badgeRed ? 'rgba(240,68,68,0.15)' : 'rgba(79,142,247,0.15)',
                    color: n.badgeRed ? '#f04444' : '#4f8ef7',
                  }}>
                    {n.badge}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer with logout */}
        <div style={s.sbFooter}>
          <div style={s.sbUser}>
            <div style={s.sbAvatar}>{sellerInitials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={s.sbUname}>{sellerName}</div>
              <div style={s.sbUrole}>+91 {seller?.phone || ''}</div>
            </div>
          </div>
          <div className="sb-logout" onClick={handleLogout} style={s.sbLogout}>
            🚪 Logout
          </div>
        </div>
      </aside>

      {/* TOPBAR */}
      <header className="topbar" style={s.topbar}>
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} style={s.hamburger}>
          ☰
        </button>
        <div style={s.breadcrumb}>{PAGE_TITLES[tab]}</div>
        <div style={s.tbRight}>
          <div style={s.tbChip}>🟢 Live Seller</div>
          <div style={s.tbIcon}>🔔</div>
          <div style={s.tbIcon}>⚙️</div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content" style={s.main}>
        {renderPage()}
      </main>
    </div>
  )
}

// ─── STYLES ───────────────────────────────────────────────────────────
const s = {
  app: {
    minHeight: '100vh',
    background: '#0a0c10',
    color: '#e6e9f0',
    fontFamily: "'Sora', sans-serif",
    fontSize: 14,
  },
  sidebar: {
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    width: 240,
    background: '#111318',
    borderRight: '1px solid #222736',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    transition: 'transform .25s',
  },
  sbLogo: {
    padding: '20px 18px 16px',
    borderBottom: '1px solid #222736',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sbLogoIcon: {
    width: 36, height: 36,
    background: '#f0a500',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  sbLogoName: {
    fontFamily: "'Crimson Pro',serif",
    fontSize: 18,
    fontWeight: 600,
    color: '#e6e9f0',
  },
  sbLogoRole: {
    fontSize: 11,
    color: '#7b8299',
    marginTop: 2,
  },
  sellerPill: {
    margin: '14px 14px 6px',
    padding: '10px 12px',
    background: 'rgba(240,165,0,0.08)',
    border: '1px solid rgba(240,165,0,0.2)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  spBadge: { fontSize: 22 },
  spName: { fontSize: 13, fontWeight: 600, color: '#e6e9f0' },
  spLevel: { fontSize: 11, color: '#7b8299', marginTop: 1 },
  sbSection: {
    fontSize: 10,
    color: '#7b8299',
    letterSpacing: '.8px',
    textTransform: 'uppercase',
    fontWeight: 700,
    padding: '14px 12px 6px',
  },
  sbItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13.5,
    fontWeight: 500,
    marginBottom: 2,
    transition: 'all .15s',
    marginLeft: -2,
  },
  sbBadge: {
    padding: '2px 8px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
  },
  sbFooter: {
    padding: '12px 14px',
    borderTop: '1px solid #222736',
  },
  sbUser: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    background: '#171b23',
    borderRadius: 8,
    marginBottom: 8,
  },
  sbAvatar: {
    width: 34, height: 34,
    background: '#f0a500',
    color: '#0a0c10',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  sbUname: {
    fontSize: 13,
    fontWeight: 600,
    color: '#e6e9f0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sbUrole: {
    fontSize: 11,
    color: '#7b8299',
    marginTop: 1,
  },
  sbLogout: {
    padding: '9px 12px',
    border: '1px solid #222736',
    borderRadius: 8,
    fontSize: 13,
    color: '#7b8299',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all .15s',
  },
  topbar: {
    position: 'fixed',
    top: 0, left: 240, right: 0,
    height: 60,
    background: '#111318',
    borderBottom: '1px solid #222736',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: 16,
    zIndex: 50,
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#e6e9f0',
    fontSize: 22,
    cursor: 'pointer',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breadcrumb: {
    fontFamily: "'Crimson Pro',serif",
    fontSize: 18,
    fontWeight: 600,
    color: '#e6e9f0',
  },
  tbRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  tbChip: {
    background: 'rgba(35,197,94,0.1)',
    border: '1px solid rgba(35,197,94,0.2)',
    borderRadius: 99,
    padding: '5px 12px',
    fontSize: 12,
    color: '#23c55e',
    fontWeight: 600,
  },
  tbIcon: {
    width: 36, height: 36,
    borderRadius: 8,
    background: '#171b23',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    cursor: 'pointer',
  },
  main: {
    marginLeft: 240,
    marginTop: 60,
    padding: 24,
    minHeight: 'calc(100vh - 60px)',
  },
  placeholder: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    padding: '60px 24px',
    textAlign: 'center',
  },
}