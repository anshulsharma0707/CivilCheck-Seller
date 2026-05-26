import { useState, useEffect } from 'react'
import { getEarningsOverview, getTransactions } from '../../api/seller.api'

export default function Earnings() {
  const [earnings, setEarnings]         = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [txLoading, setTxLoading]       = useState(true)
  const [period, setPeriod]             = useState('all')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [e, t] = await Promise.all([
        getEarningsOverview(),
        getTransactions({ limit: 20 })
      ])
      setEarnings(e.earnings)
      setTransactions(t.transactions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setTxLoading(false)
    }
  }

  // Filter transactions by period
  const filteredTx = transactions.filter(t => {
    if (period === 'all') return true
    const date = new Date(t.date)
    const now = new Date()
    if (period === 'week') {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
      return date >= weekAgo
    }
    if (period === 'month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }
    return true
  })

  const totalEarned  = filteredTx.reduce((sum, t) => sum + (t.yourEarning || 0), 0)
  const totalSettled = filteredTx.filter(t => t.settled).reduce((sum, t) => sum + (t.yourEarning || 0), 0)
  const totalPending = filteredTx.filter(t => !t.settled).reduce((sum, t) => sum + (t.yourEarning || 0), 0)
  const avgPerSale   = filteredTx.length > 0 ? Math.round(totalEarned / filteredTx.length) : 0

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

      {/* 4 Stat Cards — Real Data */}
      {loading ? (
        <div style={{ color: '#7b8299', fontSize: 13, marginBottom: 20 }}>⏳ Loading...</div>
      ) : (
        <div style={s.statsGrid}>
          <StatCard color="#f0a500" icon="💰" label="Lifetime Earned"
            value={`₹${(earnings?.lifetime || 0).toLocaleString('en-IN')}`}
            sub="All time total" />
          <StatCard color="#23c55e" icon="✅" label="This Month"
            value={`₹${(earnings?.thisMonth || 0).toLocaleString('en-IN')}`}
            sub={`${earnings?.totalReportsSold || 0} total reports sold`} />
          <StatCard color="#f5a000" icon="⏳" label="Pending Settlement"
            value={`₹${(earnings?.pendingSettlement || 0).toLocaleString('en-IN')}`}
            sub="Will clear by Monday" />
          <StatCard color="#9b6ef7" icon="📊" label="This Week"
            value={`₹${(earnings?.thisWeek || 0).toLocaleString('en-IN')}`}
            sub="Last 7 days" />
        </div>
      )}

      {/* Transactions Table — Real Data */}
      <div style={s.card}>
        <div style={s.cardHd}>
          <div style={{ ...s.cardHdIco, background: 'rgba(35,197,94,0.1)' }}>📜</div>
          <div style={{ flex: 1 }}>
            <div style={s.cardHdTitle}>Recent Transactions</div>
            <div style={s.cardHdSub}>{filteredTx.length} transactions</div>
          </div>

          {/* Period filter */}
          <div style={s.periodTabs}>
            {[
              { id: 'all',   label: 'All'   },
              { id: 'month', label: 'Month' },
              { id: 'week',  label: 'Week'  },
            ].map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)}
                style={{ ...s.periodTab, background: period === p.id ? '#f0a500' : 'transparent', color: period === p.id ? '#0a0c10' : '#7b8299' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {txLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7b8299' }}>⏳ Loading transactions...</div>
        ) : filteredTx.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7b8299' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
            Abhi koi transaction nahi hai — jab buyers aapki reports khareedenge toh yahan dikhega
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Date', 'Property', 'Sale Price', 'Platform Cut', 'You Earned', 'Status'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTx.map(t => (
                    <tr key={t.purchaseId} style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ ...s.td, color: '#7b8299', fontSize: 12.5 }}>
                        {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight: 600, color: '#e6e9f0' }}>{t.property?.address || '—'}</div>
                        <div style={{ fontSize: 11, color: '#7b8299', marginTop: 2 }}>{t.property?.city}</div>
                      </td>
                      <td style={{ ...s.td, fontWeight: 700, color: '#e6e9f0' }}>₹{t.buyerPaid}</td>
                      <td style={{ ...s.td, color: '#f04444' }}>−₹{t.platformCut}</td>
                      <td style={{ ...s.td, color: '#23c55e', fontWeight: 700 }}>₹{t.yourEarning}</td>
                      <td style={s.td}>
                        {t.settled ? (
                          <span style={{ ...s.badge, background: 'rgba(35,197,94,0.15)', color: '#23c55e' }}>✓ Settled</span>
                        ) : (
                          <span style={{ ...s.badge, background: 'rgba(245,160,0,0.15)', color: '#f5a000' }}>⏳ Pending</span>
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
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#7b8299', marginBottom: 2 }}>TOTAL EARNED</div>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 22, fontWeight: 600, color: '#f0a500' }}>
                      ₹{totalEarned.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#7b8299', marginBottom: 2 }}>SETTLED</div>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 22, fontWeight: 600, color: '#23c55e' }}>
                      ₹{totalSettled.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#7b8299', marginBottom: 2 }}>PENDING</div>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 22, fontWeight: 600, color: '#f5a000' }}>
                      ₹{totalPending.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#7b8299', marginBottom: 2 }}>AVG PER SALE</div>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 22, fontWeight: 600, color: '#9b6ef7' }}>
                      ₹{avgPerSale.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ color, icon, label, value, sub }) {
  return (
    <div style={{ background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 20, borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 28, fontWeight: 600, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#7b8299', marginTop: 6 }}>{sub}</div>
    </div>
  )
}

const s = {
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' },
  title: { fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color: '#e6e9f0' },
  subtitle: { color: '#7b8299', fontSize: 14, marginTop: 4 },
  primaryBtn: { background: '#f0a500', color: '#0a0c10', border: 'none', padding: '11px 20px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 },
  card: { background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 20 },
  cardHd: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  cardHdIco: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  cardHdTitle: { fontFamily: "'Crimson Pro',serif", fontSize: 16, fontWeight: 600, color: '#e6e9f0' },
  cardHdSub: { fontSize: 11.5, color: '#7b8299', marginTop: 2 },
  periodTabs: { display: 'flex', background: '#0a0c10', border: '1px solid #222736', borderRadius: 8, padding: 3, gap: 2 },
  periodTab: { border: 'none', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '12px 14px', color: '#7b8299', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, borderBottom: '1px solid #222736', whiteSpace: 'nowrap', background: '#0a0c10' },
  tr: { borderTop: '1px solid #222736', transition: 'background .15s' },
  td: { padding: '12px 14px', verticalAlign: 'middle' },
  badge: { padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-block' },
  totalRow: { marginTop: 16, padding: '14px 16px', background: '#0a0c10', borderRadius: 10, border: '1px solid #222736' },
}