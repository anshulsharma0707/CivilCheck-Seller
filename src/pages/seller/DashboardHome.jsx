import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getEarningsOverview, getMyListings, getPendingSettlement } from '../../api/seller.api'

export default function DashboardHome() {
  const { seller } = useAuth()
  const sellerName = seller?.name?.split(' ')[0] || 'Seller'

  const [earnings, setEarnings]     = useState(null)
  const [listings, setListings]     = useState([])
  const [settlement, setSettlement] = useState(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [e, l, s] = await Promise.all([
        getEarningsOverview(),
        getMyListings({ limit: 3 }),
        getPendingSettlement(),
      ])
      setEarnings(e.earnings)
      setListings(l.listings || [])
      setSettlement(s)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const riskBadge = (risk) => {
    const map = {
      RED:   { bg: 'rgba(240,68,68,0.15)', color: '#f04444', icon: '🔴', text: 'Risk' },
      AMBER: { bg: 'rgba(245,160,0,0.15)', color: '#f5a000', icon: '🟡', text: 'Caution' },
      GREEN: { bg: 'rgba(35,197,94,0.15)', color: '#23c55e', icon: '🟢', text: 'Clear' },
    }
    return map[risk] || map['GREEN']
  }

  // Badge progress calculate karo
  const totalListings = listings.length
  const badge = seller?.badge || 'BRONZE'
  const nextBadgeTarget = badge === 'BRONZE' ? 5 : badge === 'SILVER' ? 20 : badge === 'GOLD' ? 50 : 50
  const progressPct = Math.min((totalListings / nextBadgeTarget) * 100, 100)

  // Next payout date — next Monday
  const nextMonday = () => {
    const now = new Date()
    const days = (8 - now.getDay()) % 7 || 7
    const monday = new Date(now)
    monday.setDate(now.getDate() + days)
    return monday.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#7b8299', fontSize: 14 }}>
      ⏳ Loading dashboard...
    </div>
  )

  return (
    <div>
      {/* Welcome header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Good morning, {sellerName} 👋</h1>
          <p style={s.subtitle}>Here's how your listings are performing</p>
        </div>
        <button style={s.primaryBtn}>+ New Listing</button>
      </div>

      {/* 4 Stat Cards — Real Data */}
      <div style={s.statsGrid}>
        <StatCard
          color="#f0a500" icon="💰"
          label="This Month Earnings"
          value={`₹${(earnings?.thisMonth || 0).toLocaleString('en-IN')}`}
          change={`↑ Lifetime: ₹${(earnings?.lifetime || 0).toLocaleString('en-IN')}`}
        />
        <StatCard
          color="#23c55e" icon="📋"
          label="Active Listings"
          value={listings.filter(l => l.status === 'APPROVED').length}
          change={`${listings.filter(l => l.status === 'PENDING_REVIEW').length} pending review`}
        />
        <StatCard
          color="#4f8ef7" icon="🛒"
          label="Reports Sold"
          value={earnings?.totalReportsSold || 0}
          change={`↑ This week: ₹${(earnings?.thisWeek || 0).toLocaleString('en-IN')}`}
        />
        <StatCard
          color="#9b6ef7" icon="💵"
          label="Pending Payout"
          value={`₹${(settlement?.pendingAmount || 0).toLocaleString('en-IN')}`}
          change={settlement?.meetsThreshold ? `Payout: ${nextMonday()}` : 'Below ₹500 threshold'}
        />
      </div>

      {/* Main grid */}
      <div style={s.mainGrid}>

        {/* LEFT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Top Listings — Real Data */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(79,142,247,0.1)' }}>🏆</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Top Performing Listings</div>
                <div style={s.cardHdSub}>By revenue generated</div>
              </div>
              <button style={s.ghostBtn}>View All</button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Property', 'Risk', 'Price', 'Sales', 'Earned'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listings.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#7b8299', fontSize: 13 }}>
                        Abhi koi listing nahi — pehli listing create karo!
                      </td>
                    </tr>
                  ) : listings.map((l, i) => {
                    const b = riskBadge(l.riskBadge)
                    return (
                      <tr key={i} style={s.tr}>
                        <td style={s.td}>
                          <div style={{ fontWeight: 600, color: '#e6e9f0' }}>{l.address}</div>
                          <div style={{ fontSize: 11.5, color: '#7b8299', marginTop: 2 }}>{l.city}, {l.tehsil}</div>
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, background: b.bg, color: b.color }}>
                            {b.icon} {b.text}
                          </span>
                        </td>
                        <td style={{ ...s.td, fontWeight: 700 }}>₹{l.price}</td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>
                            ×{l.totalSales || 0}
                          </span>
                        </td>
                        <td style={{ ...s.td, color: '#23c55e', fontWeight: 700 }}>
                          ₹{((l.totalSales || 0) * l.price * 0.6).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Earnings Summary */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>📈</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Earnings Summary</div>
                <div style={s.cardHdSub}>Your revenue breakdown</div>
              </div>
            </div>
            {[
              { label: 'This Week',   value: `₹${(earnings?.thisWeek || 0).toLocaleString('en-IN')}`, color: '#4f8ef7' },
              { label: 'This Month',  value: `₹${(earnings?.thisMonth || 0).toLocaleString('en-IN')}`, color: '#23c55e' },
              { label: 'Pending',     value: `₹${(earnings?.pendingSettlement || 0).toLocaleString('en-IN')}`, color: '#f0a500' },
              { label: 'Lifetime',    value: `₹${(earnings?.lifetime || 0).toLocaleString('en-IN')}`, color: '#9b6ef7' },
            ].map(item => (
              <div key={item.label} style={s.statRow}>
                <span style={{ color: '#7b8299' }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Badge progress — Real Data */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>🥇</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Badge Progress</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '14px 0 16px' }}>
              <div style={{ fontSize: 42 }}>
                {badge === 'PLATINUM' ? '💎' : badge === 'GOLD' ? '🥇' : badge === 'SILVER' ? '🥈' : '🥉'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f0a500', marginTop: 8 }}>
                {badge.charAt(0) + badge.slice(1).toLowerCase()} Seller
              </div>
              <div style={{ fontSize: 12, color: '#7b8299', marginTop: 4 }}>
                {totalListings} listings · {seller?.accuracyScore || 100}% accuracy
              </div>
            </div>

            {badge !== 'PLATINUM' && (
              <div style={s.goldUnlock}>
                <div style={{ fontWeight: 600, color: '#f0a500', marginBottom: 6, fontSize: 13 }}>
                  Next Badge — {nextBadgeTarget} listings needed
                </div>
                <div style={s.progressBar}>
                  <div style={{ ...s.progressFill, width: `${progressPct}%` }} />
                </div>
                <div style={{ fontSize: 11, color: '#3d4560', marginTop: 4 }}>
                  {totalListings} / {nextBadgeTarget} listings · {Math.round(progressPct)}% there
                </div>
              </div>
            )}
          </div>

          {/* Next Settlement — Real Data */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(35,197,94,0.1)' }}>💵</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Next Settlement</div>
              </div>
            </div>

            <div style={{ fontSize: 30, fontWeight: 800, color: '#23c55e', letterSpacing: -1 }}>
              ₹{(settlement?.pendingAmount || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 12, color: '#7b8299', marginTop: 4 }}>
              {settlement?.meetsThreshold
                ? `Payout on ${nextMonday()}`
                : 'Rs. 500 minimum threshold abhi reach nahi hua'}
            </div>

            <div style={{ height: 1, background: '#222736', margin: '14px 0' }} />

            <div style={s.statRow}>
              <span style={{ color: '#7b8299' }}>Lifetime Earned</span>
              <span style={{ fontWeight: 700, color: '#e6e9f0' }}>₹{(earnings?.lifetime || 0).toLocaleString('en-IN')}</span>
            </div>
            <div style={s.statRow}>
              <span style={{ color: '#7b8299' }}>Pending Transactions</span>
              <span style={{ color: '#7b8299' }}>{settlement?.transactionCount || 0}</span>
            </div>
          </div>

          {/* KYC Status */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(155,110,247,0.1)' }}>🪪</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>KYC Status</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: seller?.kycStatus === 'APPROVED' ? 'rgba(35,197,94,0.15)' : 'rgba(245,160,0,0.15)',
                color: seller?.kycStatus === 'APPROVED' ? '#23c55e' : '#f0a500',
              }}>
                {seller?.kycStatus || 'PENDING'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#7b8299' }}>
              {seller?.kycStatus === 'APPROVED'
                ? '✅ Aapka KYC verify ho gaya hai — listings create kar sakte hain'
                : '⏳ KYC pending hai — documents upload karo'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ color, icon, label, value, change }) {
  return (
    <div style={{ background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 20, borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 28, fontWeight: 600, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#7b8299', marginTop: 6, fontWeight: 500 }}>{change}</div>
    </div>
  )
}

const s = {
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' },
  title: { fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color: '#e6e9f0' },
  subtitle: { color: '#7b8299', fontSize: 14, marginTop: 4 },
  primaryBtn: { background: '#f0a500', color: '#0a0c10', border: 'none', padding: '11px 20px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  ghostBtn: { background: 'transparent', border: '1px solid #222736', color: '#7b8299', padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 },
  mainGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 16 },
  card: { background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 20 },
  cardHd: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardHdIco: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  cardHdTitle: { fontFamily: "'Crimson Pro',serif", fontSize: 16, fontWeight: 600, color: '#e6e9f0' },
  cardHdSub: { fontSize: 11.5, color: '#7b8299', marginTop: 2 },
  badge: { padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#7b8299', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, borderBottom: '1px solid #222736', whiteSpace: 'nowrap' },
  tr: { borderTop: '1px solid #222736' },
  td: { padding: '12px 8px', verticalAlign: 'middle' },
  goldUnlock: { background: 'rgba(240,165,0,0.05)', border: '1px solid rgba(240,165,0,0.2)', borderRadius: 8, padding: 12 },
  progressBar: { height: 6, background: '#222736', borderRadius: 99, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#f0a500', borderRadius: 99 },
  statRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 },
}