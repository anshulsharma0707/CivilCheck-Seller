import { useAuth } from '../../context/AuthContext'

// Mock data — backend connect karne ke baad real data aayega
const DAILY_REVENUE = [
  { day: 'M', value: 420 },
  { day: 'T', value: 780 },
  { day: 'W', value: 1240 },
  { day: 'T', value: 890 },
  { day: 'F', value: 1680 },
  { day: 'S', value: 2150 },
  { day: 'S', value: 1450 },
]

const TOP_LISTINGS = [
  { name: 'Vaishali Nagar Plot 45', sub: 'Survey #1234/B · Sanganer', risk: 'red', price: 299, sales: 18, earned: 3229 },
  { name: 'Malviya Nagar Flat 2B', sub: 'Survey #567 · Jaipur Sadar', risk: 'amber', price: 199, sales: 11, earned: 1311 },
  { name: 'Jagatpura Commercial Plot', sub: 'Khasra #890 · Amer', risk: 'green', price: 499, sales: 6, earned: 1797 },
]

const ACTIVITY = [
  { icon: '🛒', bg: 'rgba(35,197,94,0.1)', text: 'Report sold — Vaishali Nagar Plot 45', sub: '₹179.40 earned · 2 hours ago' },
  { icon: '⭐', bg: 'rgba(79,142,247,0.1)', text: '5-star review on Malviya Nagar Flat', sub: '"Very accurate" · 5h ago' },
  { icon: '📦', bg: 'rgba(245,160,0,0.1)', text: 'New special request assigned', sub: 'Tonk Road Plot · Due 48h' },
  { icon: '✅', bg: 'rgba(35,197,94,0.1)', text: 'Listing approved — Jagatpura Agri', sub: 'Now live · Yesterday' },
]

export default function DashboardHome() {
  const { seller } = useAuth()
  const sellerName = seller?.name?.split(' ')[0] || 'Seller'

  const maxRevenue = Math.max(...DAILY_REVENUE.map(d => d.value))

  const riskBadge = (risk) => {
    const map = {
      red:   { bg: 'rgba(240,68,68,0.15)', color: '#f04444', icon: '🔴', text: 'Risk' },
      amber: { bg: 'rgba(245,160,0,0.15)', color: '#f5a000', icon: '🟡', text: 'Caution' },
      green: { bg: 'rgba(35,197,94,0.15)', color: '#23c55e', icon: '🟢', text: 'Clear' },
    }
    return map[risk]
  }

  return (
    <div>
      {/* Welcome header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Good morning, {sellerName} 👋</h1>
          <p style={s.subtitle}>Here's how your listings are performing today</p>
        </div>
        <button style={s.primaryBtn}>+ New Listing</button>
      </div>

      {/* 4 Stat Cards */}
      <div style={s.statsGrid}>
        <StatCard color="#f0a500" icon="💰" label="Total Earnings (This Month)" value="₹11,840" change="↑ 34% from last month" />
        <StatCard color="#23c55e" icon="📋" label="Active Listings" value="12" change="↑ 3 new this week" />
        <StatCard color="#4f8ef7" icon="🛒" label="Reports Sold" value="47" change="↑ 8 this week" />
        <StatCard color="#9b6ef7" icon="⭐" label="Avg Rating" value="4.7" change="↑ 0.2 this month" />
      </div>

      {/* Main grid — left main + right sidebar */}
      <div style={s.mainGrid}>

        {/* LEFT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Revenue chart */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>📈</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Revenue This Week</div>
                <div style={s.cardHdSub}>Daily earnings breakdown</div>
              </div>
              <span style={{ ...s.badge, background: 'rgba(240,165,0,0.15)', color: '#f0a500' }}>
                ₹{DAILY_REVENUE.reduce((sum, d) => sum + d.value, 0).toLocaleString('en-IN')} total
              </span>
            </div>

            <div style={s.barChart}>
              {DAILY_REVENUE.map((d, i) => (
                <div key={i} style={s.barWrap}>
                  <div style={s.barValue}>₹{d.value}</div>
                  <div style={{
                    ...s.bar,
                    height: `${(d.value / maxRevenue) * 100}%`,
                  }} />
                  <div style={s.barLabel}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Listings */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(79,142,247,0.1)' }}>🏆</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Top Performing Listings</div>
                <div style={s.cardHdSub}>By revenue generated this month</div>
              </div>
              <button style={s.ghostBtn}>View All</button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Property</th>
                    <th style={s.th}>Risk</th>
                    <th style={s.th}>Price</th>
                    <th style={s.th}>Sales</th>
                    <th style={s.th}>Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_LISTINGS.map((l, i) => {
                    const b = riskBadge(l.risk)
                    return (
                      <tr key={i} style={s.tr}>
                        <td style={s.td}>
                          <div style={{ fontWeight: 600, color: '#e6e9f0' }}>{l.name}</div>
                          <div style={{ fontSize: 11.5, color: '#7b8299', marginTop: 2 }}>{l.sub}</div>
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, background: b.bg, color: b.color }}>
                            {b.icon} {b.text}
                          </span>
                        </td>
                        <td style={{ ...s.td, fontWeight: 700 }}>₹{l.price}</td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>
                            ×{l.sales}
                          </span>
                        </td>
                        <td style={{ ...s.td, color: '#23c55e', fontWeight: 700 }}>
                          ₹{l.earned.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Badge progress */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>🥇</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Badge Progress</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '14px 0 16px' }}>
              <div style={{ fontSize: 42 }}>🥈</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f0a500', marginTop: 8 }}>Silver Seller</div>
              <div style={{ fontSize: 12, color: '#7b8299', marginTop: 4 }}>
                12 listings · 4.7★ · 94.2% accuracy
              </div>
            </div>

            <div style={s.goldUnlock}>
              <div style={{ fontWeight: 600, color: '#f0a500', marginBottom: 6, fontSize: 13 }}>
                🥇 Gold Badge Unlocks At:
              </div>
              <div style={{ color: '#7b8299', lineHeight: 1.8, fontSize: 12.5 }}>
                ✅ 4.5+ rating (you have 4.7)<br />
                ✅ 95%+ accuracy (you have 94.2%)<br />
                ⏳ 20+ listings — need <strong style={{ color: '#e6e9f0' }}>8 more</strong>
              </div>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: '60%' }} />
              </div>
              <div style={{ fontSize: 11, color: '#3d4560', marginTop: 4 }}>
                12 / 20 listings · 60% there
              </div>
            </div>
          </div>

          {/* Next settlement */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(35,197,94,0.1)' }}>💵</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Next Settlement</div>
              </div>
            </div>

            <div style={{ fontSize: 30, fontWeight: 800, color: '#23c55e', letterSpacing: -1 }}>
              ₹4,320
            </div>
            <div style={{ fontSize: 12, color: '#7b8299', marginTop: 4 }}>
              Payout on Monday, 19 May
            </div>

            <div style={{ height: 1, background: '#222736', margin: '14px 0' }} />

            <div style={s.statRow}>
              <span style={{ color: '#7b8299' }}>Lifetime Earned</span>
              <span style={{ fontWeight: 700, color: '#e6e9f0' }}>₹67,450</span>
            </div>
            <div style={s.statRow}>
              <span style={{ color: '#7b8299' }}>TDS Deducted (10%)</span>
              <span style={{ color: '#7b8299' }}>₹2,340</span>
            </div>
          </div>

          {/* Recent activity */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(155,110,247,0.1)' }}>⚡</div>
              <div style={{ flex: 1 }}>
                <div style={s.cardHdTitle}>Recent Activity</div>
              </div>
            </div>

            {ACTIVITY.map((a, i) => (
              <div key={i} style={s.activityItem}>
                <div style={{ ...s.activityIcon, background: a.bg }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#e6e9f0' }}>{a.text}</div>
                  <div style={{ fontSize: 11.5, color: '#7b8299', marginTop: 2 }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card mini component ───
function StatCard({ color, icon, label, value, change }) {
  return (
    <div style={{
      background: '#111318',
      border: '1px solid #222736',
      borderRadius: 12,
      padding: 20,
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 28, fontWeight: 600, color }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#23c55e', marginTop: 6, fontWeight: 500 }}>
        {change}
      </div>
    </div>
  )
}

// ─── Styles ───
const s = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: "'Crimson Pro',serif",
    fontSize: 26,
    fontWeight: 600,
    color: '#e6e9f0',
  },
  subtitle: {
    color: '#7b8299',
    fontSize: 14,
    marginTop: 4,
  },
  primaryBtn: {
    background: '#f0a500',
    color: '#0a0c10',
    border: 'none',
    padding: '11px 20px',
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  ghostBtn: {
    background: 'transparent',
    border: '1px solid #222736',
    color: '#7b8299',
    padding: '6px 12px',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 20,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 340px',
    gap: 16,
  },
  card: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    padding: 20,
  },
  cardHd: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardHdIco: {
    width: 36, height: 36,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0,
  },
  cardHdTitle: {
    fontFamily: "'Crimson Pro',serif",
    fontSize: 16,
    fontWeight: 600,
    color: '#e6e9f0',
  },
  cardHdSub: {
    fontSize: 11.5,
    color: '#7b8299',
    marginTop: 2,
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 12,
    height: 180,
    paddingTop: 20,
  },
  barWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    height: '100%',
    position: 'relative',
  },
  bar: {
    width: '70%',
    background: 'linear-gradient(180deg, #f0a500, rgba(240,165,0,0.4))',
    borderRadius: '6px 6px 0 0',
    minHeight: 4,
    transition: 'height .3s',
  },
  barValue: {
    fontSize: 10,
    color: '#7b8299',
    fontWeight: 600,
    position: 'absolute',
    top: 0,
  },
  barLabel: {
    fontSize: 11,
    color: '#7b8299',
    fontWeight: 600,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '10px 8px',
    color: '#7b8299',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '.5px',
    fontWeight: 600,
    borderBottom: '1px solid #222736',
    whiteSpace: 'nowrap',
  },
  tr: { borderTop: '1px solid #222736' },
  td: { padding: '12px 8px', verticalAlign: 'middle' },
  goldUnlock: {
    background: 'rgba(240,165,0,0.05)',
    border: '1px solid rgba(240,165,0,0.2)',
    borderRadius: 8,
    padding: 12,
    fontSize: 12.5,
  },
  progressBar: {
    height: 6,
    background: '#222736',
    borderRadius: 99,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#f0a500',
    borderRadius: 99,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    marginBottom: 8,
  },
  activityItem: {
    display: 'flex',
    gap: 12,
    paddingBottom: 14,
    marginBottom: 14,
    borderBottom: '1px solid #222736',
  },
  activityIcon: {
    width: 36, height: 36,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0,
  },
}