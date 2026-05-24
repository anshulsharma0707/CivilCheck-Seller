import { useState } from 'react'

// Mock data — monthly earnings breakdown
const MONTHLY_DATA = [
  { month: 'Nov 24', earnings: 4200, sales: 12 },
  { month: 'Dec 24', earnings: 5800, sales: 18 },
  { month: 'Jan 25', earnings: 6100, sales: 21 },
  { month: 'Feb 25', earnings: 7400, sales: 24 },
  { month: 'Mar 25', earnings: 9800, sales: 32 },
  { month: 'Apr 25', earnings: 14200, sales: 41 },
  { month: 'May 25', earnings: 11840, sales: 47 },
]

// Recent transactions
const TRANSACTIONS = [
  { id: 1, date: '20 May 2025', property: 'Vaishali Nagar Plot 45', buyer: 'Rohit Verma', amount: 299, commission: 30, earned: 269, status: 'paid' },
  { id: 2, date: '19 May 2025', property: 'Malviya Nagar Flat 2B', buyer: 'Anita Singh', amount: 199, commission: 20, earned: 179, status: 'paid' },
  { id: 3, date: '18 May 2025', property: 'Jagatpura Commercial', buyer: 'Sunil Kumar', amount: 499, commission: 50, earned: 449, status: 'paid' },
  { id: 4, date: '17 May 2025', property: 'Vaishali Nagar Plot 45', buyer: 'Mahesh Agarwal', amount: 299, commission: 30, earned: 269, status: 'pending' },
  { id: 5, date: '16 May 2025', property: 'Tonk Road Shop Unit', buyer: 'Priya Mehta', amount: 399, commission: 40, earned: 359, status: 'paid' },
  { id: 6, date: '15 May 2025', property: 'Mansarovar Villa Plot', buyer: 'Deepak Sharma', amount: 599, commission: 60, earned: 539, status: 'paid' },
  { id: 7, date: '14 May 2025', property: 'Bani Park Old House', buyer: 'Rakesh Yadav', amount: 349, commission: 35, earned: 314, status: 'pending' },
  { id: 8, date: '12 May 2025', property: 'Sodala Studio Apt', buyer: 'Vinod Jain', amount: 199, commission: 20, earned: 179, status: 'paid' },
]

export default function Earnings() {
  const [period, setPeriod] = useState('7m')

  const maxEarning = Math.max(...MONTHLY_DATA.map(d => d.earnings))

  // Totals
  const totalEarned = TRANSACTIONS.reduce((sum, t) => sum + t.earned, 0)
  const totalPaid = TRANSACTIONS.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.earned, 0)
  const totalPending = TRANSACTIONS.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.earned, 0)

  return (
    <div>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Earnings</h1>
          <p style={s.subtitle}>Aapki kamai ki puri tafseel</p>
        </div>
        <button style={s.primaryBtn}>📥 Download Report</button>
      </div>

      {/* 4 stat cards */}
      <div style={s.statsGrid}>
        <StatCard color="#f0a500" icon="💰" label="Lifetime Earned" value="₹67,450" sub="↑ 18% from last quarter" />
        <StatCard color="#23c55e" icon="✅" label="Paid Out" value={`₹${totalPaid.toLocaleString('en-IN')}`} sub="This month" />
        <StatCard color="#f5a000" icon="⏳" label="Pending Settlement" value={`₹${totalPending.toLocaleString('en-IN')}`} sub="Will clear by Monday" />
        <StatCard color="#9b6ef7" icon="📊" label="Avg per Sale" value={`₹${Math.round(totalEarned / TRANSACTIONS.length)}`} sub={`From ${TRANSACTIONS.length} sales`} />
      </div>

      {/* Monthly chart */}
      <div style={s.card}>
        <div style={s.cardHd}>
          <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>📈</div>
          <div style={{ flex: 1 }}>
            <div style={s.cardHdTitle}>Monthly Earnings Trend</div>
            <div style={s.cardHdSub}>Last 7 months performance</div>
          </div>
          <div style={s.periodTabs}>
            {[
              { id: '7m', label: '7M' },
              { id: '3m', label: '3M' },
              { id: '1m', label: '1M' },
            ].map(p => {
              const active = period === p.id
              return (
                <button key={p.id}
                  onClick={() => setPeriod(p.id)}
                  style={{
                    ...s.periodTab,
                    background: active ? '#f0a500' : 'transparent',
                    color: active ? '#0a0c10' : '#7b8299',
                  }}>
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bar chart */}
        <div style={s.barChart}>
          {MONTHLY_DATA.map((d, i) => {
            const heightPercent = (d.earnings / maxEarning) * 100
            const isCurrent = i === MONTHLY_DATA.length - 1
            return (
              <div key={i} style={s.barWrap}>
                <div style={s.barValue}>₹{(d.earnings / 1000).toFixed(1)}k</div>
                <div style={{
                  ...s.bar,
                  height: `${heightPercent}%`,
                  background: isCurrent
                    ? 'linear-gradient(180deg, #f0a500, rgba(240,165,0,0.4))'
                    : 'linear-gradient(180deg, #4f8ef7, rgba(79,142,247,0.3))',
                }} />
                <div style={s.barLabel}>{d.month}</div>
                <div style={s.barSales}>{d.sales} sales</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transactions table */}
      <div style={{ ...s.card, marginTop: 16 }}>
        <div style={s.cardHd}>
          <div style={{ ...s.cardHdIco, background: 'rgba(35,197,94,0.1)' }}>📜</div>
          <div style={{ flex: 1 }}>
            <div style={s.cardHdTitle}>Recent Transactions</div>
            <div style={s.cardHdSub}>{TRANSACTIONS.length} transactions this month</div>
          </div>
          <button style={s.ghostBtn}>View All</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Date</th>
                <th style={s.th}>Property</th>
                <th style={s.th}>Buyer</th>
                <th style={s.th}>Sale Price</th>
                <th style={s.th}>Commission</th>
                <th style={s.th}>You Earned</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map(t => (
                <tr key={t.id} style={s.tr}>
                  <td style={{ ...s.td, color: '#7b8299', fontSize: 12.5 }}>{t.date}</td>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600, color: '#e6e9f0' }}>{t.property}</div>
                  </td>
                  <td style={{ ...s.td, color: '#7b8299' }}>{t.buyer}</td>
                  <td style={{ ...s.td, fontWeight: 700, color: '#e6e9f0' }}>₹{t.amount}</td>
                  <td style={{ ...s.td, color: '#f04444' }}>−₹{t.commission}</td>
                  <td style={{ ...s.td, color: '#23c55e', fontWeight: 700 }}>₹{t.earned}</td>
                  <td style={s.td}>
                    {t.status === 'paid' ? (
                      <span style={{ ...s.badge, background: 'rgba(35,197,94,0.15)', color: '#23c55e' }}>
                        ✓ Paid
                      </span>
                    ) : (
                      <span style={{ ...s.badge, background: 'rgba(245,160,0,0.15)', color: '#f5a000' }}>
                        ⏳ Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total row */}
        <div style={s.totalRow}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: '#7b8299', fontSize: 13, fontWeight: 600 }}>
              Total Earned (This Month)
            </span>
            <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color: '#f0a500' }}>
              ₹{totalEarned.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stat card mini component ───
function StatCard({ color, icon, label, value, sub }) {
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
      <div style={{ fontSize: 12, color: '#7b8299', marginTop: 6 }}>{sub}</div>
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
    marginBottom: 20,
    flexWrap: 'wrap',
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
  periodTabs: {
    display: 'flex',
    background: '#0a0c10',
    border: '1px solid #222736',
    borderRadius: 8,
    padding: 3,
    gap: 2,
  },
  periodTab: {
    border: 'none',
    padding: '6px 14px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
    transition: 'all .15s',
  },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 10,
    height: 220,
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
    borderRadius: '6px 6px 0 0',
    minHeight: 4,
    transition: 'height .3s',
  },
  barValue: {
    fontSize: 10.5,
    color: '#7b8299',
    fontWeight: 700,
    position: 'absolute',
    top: 0,
  },
  barLabel: {
    fontSize: 11,
    color: '#e6e9f0',
    fontWeight: 600,
  },
  barSales: {
    fontSize: 10,
    color: '#7b8299',
    marginTop: -3,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    color: '#7b8299',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '.5px',
    fontWeight: 600,
    borderBottom: '1px solid #222736',
    whiteSpace: 'nowrap',
    background: '#0a0c10',
  },
  tr: { borderTop: '1px solid #222736' },
  td: { padding: '12px 14px', verticalAlign: 'middle' },
  badge: {
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  totalRow: {
    marginTop: 16,
    padding: '14px 16px',
    background: '#0a0c10',
    borderRadius: 10,
    border: '1px solid #222736',
  },
}