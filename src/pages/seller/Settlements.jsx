import { useState, useEffect } from 'react'
import { getSettlements, getPendingSettlement, getSellerProfile } from '../../api/seller.api'

export default function Settlements() {
  const [settlements, setSettlements]   = useState([])
  const [pending, setPending]           = useState(null)
  const [profile, setProfile]           = useState(null)
  const [loading, setLoading]           = useState(true)
  const [selected, setSelected]         = useState(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [s, p, pr] = await Promise.all([
        getSettlements(),
        getPendingSettlement(),
        getSellerProfile(),
      ])
      setSettlements(s.settlements || [])
      setPending(p)
      setProfile(pr.seller)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Next Monday calculate karo
  const nextMonday = () => {
    const now = new Date()
    const days = (8 - now.getDay()) % 7 || 7
    const monday = new Date(now)
    monday.setDate(now.getDate() + days)
    return monday.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
  }

  const totalPaid = settlements.reduce((sum, s) => sum + s.amountPaid, 0)
  const totalSettlements = settlements.length

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#7b8299' }}>
      ⏳ Loading settlements...
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Settlements</h1>
          <p style={s.subtitle}>Bank transfers aur payouts ka record</p>
        </div>
        <button style={s.primaryBtn}>📥 Download Statement</button>
      </div>

      {/* Bank Info Card */}
      <div style={s.bankCard}>
        <div style={s.bankLeft}>
          <div style={s.bankIcon}>🏦</div>
          <div>
            <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Linked Bank Account
            </div>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 18, fontWeight: 600, color: '#e6e9f0', marginTop: 4 }}>
              {profile?.bankAccount ? `Account ****${profile.bankAccount.slice(-4)}` : 'Bank account linked nahi hai'}
            </div>
            <div style={{ fontSize: 12.5, color: '#7b8299', marginTop: 2 }}>
              {profile?.ifsc ? `IFSC: ${profile.ifsc}` : '—'} · {profile?.name}
            </div>
          </div>
        </div>
        <button style={s.ghostBtn}>✏️ Update</button>
      </div>

      {/* Pending Settlement Highlight */}
      {pending && (pending.pendingAmount || 0) > 0 && (
        <div style={s.pendingCard}>
          <div style={s.pendingTop}>
            <div>
              <div style={{ fontSize: 12, color: '#f5a000', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                ⏳ Next Settlement
              </div>
              <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 36, fontWeight: 600, color: '#23c55e', marginTop: 8, letterSpacing: -1 }}>
                ₹{(pending.pendingAmount || 0).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 13, color: '#7b8299', marginTop: 4 }}>
                {pending.meetsThreshold
                  ? <>Payout expected on <strong style={{ color: '#e6e9f0' }}>{nextMonday()}</strong></>
                  : `Rs. 500 minimum threshold reach nahi hua — ${pending.transactionCount || 0} pending transactions`
                }
              </div>
            </div>

            <div style={s.breakdown}>
              <BreakdownRow label="Pending Transactions" value={pending.transactionCount || 0} />
              <BreakdownRow label="Gross Amount"         value={`₹${(pending.pendingAmount || 0).toLocaleString('en-IN')}`} />
              <BreakdownRow label="TDS (if applicable)"  value="10% if > ₹30,000/year" negative />
              <div style={{ height: 1, background: '#222736', margin: '8px 0' }} />
              <BreakdownRow label="Expected Payout" value={`₹${(pending.pendingAmount || 0).toLocaleString('en-IN')}`} highlight />
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div style={s.statsGrid}>
        <StatCard color="#23c55e" icon="✅" label="Total Paid Out"
          value={`₹${totalPaid.toLocaleString('en-IN')}`}
          sub={`${totalSettlements} settlements`} />
        <StatCard color="#f5a000" icon="⏳" label="Pending Payout"
          value={`₹${(pending?.pendingAmount || 0).toLocaleString('en-IN')}`}
          sub={pending?.meetsThreshold ? 'Processing this week' : 'Below ₹500 threshold'} />
        <StatCard color="#4f8ef7" icon="📅" label="Payout Cycle"
          value="Weekly"
          sub="Every Monday" />
      </div>

      {/* Settlement History Table */}
      <div style={s.card}>
        <div style={s.cardHd}>
          <div style={{ ...s.cardHdIco, background: 'rgba(35,197,94,0.1)' }}>📜</div>
          <div style={{ flex: 1 }}>
            <div style={s.cardHdTitle}>Settlement History</div>
            <div style={s.cardHdSub}>{totalSettlements} settlements total</div>
          </div>
        </div>

        {settlements.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7b8299' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>💰</div>
            Abhi koi settlement nahi hua — jab pehla payout hoga toh yahan dikhega
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Week Of', 'Transactions', 'Amount Paid', 'Status', 'Action'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {settlements.map((st, i) => (
                  <>
                    <tr key={st.weekOf} style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ ...s.td, fontWeight: 600, color: '#e6e9f0' }}>
                        Week of {new Date(st.weekOf).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>
                          ×{st.transactions}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: '#23c55e', fontWeight: 700 }}>
                        ₹{st.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: 'rgba(35,197,94,0.15)', color: '#23c55e' }}>
                          ✓ Paid
                        </span>
                      </td>
                      <td style={s.td}>
                        <button onClick={() => setSelected(selected === i ? null : i)} style={s.viewBtn}>
                          {selected === i ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>

                    {/* Detail row */}
                    {selected === i && (
                      <tr key={`detail-${i}`} style={{ borderTop: '1px solid #222736' }}>
                        <td colSpan={5} style={{ padding: 16 }}>
                          <div style={s.detailBox}>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 16, fontWeight: 600, color: '#e6e9f0', marginBottom: 14 }}>
                              📋 Settlement Details
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 14 }}>
                              <DetailItem label="Week Starting" value={new Date(st.weekOf).toLocaleDateString('en-IN')} />
                              <DetailItem label="Total Reports Sold" value={`${st.transactions} reports`} />
                              <DetailItem label="Amount Paid" value={`₹${st.amountPaid.toLocaleString('en-IN')}`} />
                              <DetailItem label="Status" value="PAID ✓" />
                            </div>
                            <div style={{ padding: 14, background: '#0a0c10', borderRadius: 8, border: '1px solid #222736' }}>
                              <BreakdownRow label="Gross Earnings" value={`₹${st.amountPaid.toLocaleString('en-IN')}`} />
                              <BreakdownRow label="TDS (if applicable)" value="Deducted if > ₹30,000/year" negative />
                              <div style={{ height: 1, background: '#222736', margin: '8px 0' }} />
                              <BreakdownRow label="Net Amount Paid" value={`₹${st.amountPaid.toLocaleString('en-IN')}`} highlight />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
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
      <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#7b8299', marginTop: 6 }}>{sub}</div>
    </div>
  )
}

function BreakdownRow({ label, value, negative, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
      <span style={{ color: '#7b8299', fontSize: 13 }}>{label}</span>
      <span style={{ color: highlight ? '#23c55e' : negative ? '#f04444' : '#e6e9f0', fontWeight: highlight ? 800 : 700, fontSize: highlight ? 16 : 14 }}>
        {value}
      </span>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
      <div style={{ fontSize: 13.5, color: '#e6e9f0', fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  )
}

const s = {
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' },
  title: { fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color: '#e6e9f0' },
  subtitle: { color: '#7b8299', fontSize: 14, marginTop: 4 },
  primaryBtn: { background: '#f0a500', color: '#0a0c10', border: 'none', padding: '11px 20px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  ghostBtn: { background: 'transparent', border: '1px solid #222736', color: '#7b8299', padding: '8px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' },
  bankCard: { background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 20, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  bankLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  bankIcon: { width: 48, height: 48, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
  pendingCard: { background: 'linear-gradient(135deg, rgba(35,197,94,0.06), rgba(245,160,0,0.06))', border: '1px solid rgba(245,160,0,0.25)', borderRadius: 12, padding: 24, marginBottom: 20 },
  pendingTop: { display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' },
  breakdown: { background: 'rgba(10,12,16,0.5)', border: '1px solid #222736', borderRadius: 10, padding: 14, minWidth: 260, flex: '1 1 260px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 },
  card: { background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 20 },
  cardHd: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardHdIco: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  cardHdTitle: { fontFamily: "'Crimson Pro',serif", fontSize: 16, fontWeight: 600, color: '#e6e9f0' },
  cardHdSub: { fontSize: 11.5, color: '#7b8299', marginTop: 2 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '12px 14px', color: '#7b8299', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, borderBottom: '1px solid #222736', whiteSpace: 'nowrap', background: '#0a0c10' },
  tr: { borderTop: '1px solid #222736', transition: 'background .15s' },
  td: { padding: '12px 14px', verticalAlign: 'middle' },
  badge: { padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-block' },
  viewBtn: { background: '#171b23', border: '1px solid #222736', color: '#f0a500', padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  detailBox: { padding: 20, background: '#0a0c10', border: '1px solid rgba(240,165,0,0.2)', borderRadius: 10 },
}