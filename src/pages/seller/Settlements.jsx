import { useState } from 'react'

// Mock data — bank settlements
const SETTLEMENTS = [
  { id: 'STL-2025-019', date: '19 May 2025', period: '12-18 May 2025', sales: 8, gross: 2890, tds: 289, fees: 145, net: 2456, status: 'pending', expectedDate: '19 May 2025' },
  { id: 'STL-2025-018', date: '12 May 2025', period: '05-11 May 2025', sales: 12, gross: 4230, tds: 423, fees: 211, net: 3596, status: 'completed', utr: 'AXIS25131000482' },
  { id: 'STL-2025-017', date: '05 May 2025', period: '28 Apr - 04 May', sales: 9, gross: 3120, tds: 312, fees: 156, net: 2652, status: 'completed', utr: 'AXIS25125000391' },
  { id: 'STL-2025-016', date: '28 Apr 2025', period: '21-27 Apr 2025', sales: 11, gross: 3780, tds: 378, fees: 189, net: 3213, status: 'completed', utr: 'AXIS25118000287' },
  { id: 'STL-2025-015', date: '21 Apr 2025', period: '14-20 Apr 2025', sales: 7, gross: 2450, tds: 245, fees: 122, net: 2083, status: 'completed', utr: 'AXIS25111000156' },
  { id: 'STL-2025-014', date: '14 Apr 2025', period: '07-13 Apr 2025', sales: 6, gross: 2120, tds: 212, fees: 106, net: 1802, status: 'completed', utr: 'AXIS25104000098' },
]

export default function Settlements() {
  const [selected, setSelected] = useState(null)

  // Totals
  const totalPaid = SETTLEMENTS.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.net, 0)
  const pending = SETTLEMENTS.find(s => s.status === 'pending')

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

      {/* Bank info card */}
      <div style={s.bankCard}>
        <div style={s.bankLeft}>
          <div style={s.bankIcon}>🏦</div>
          <div>
            <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Linked Bank Account
            </div>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 18, fontWeight: 600, color: '#e6e9f0', marginTop: 4 }}>
              Axis Bank · ****4521
            </div>
            <div style={{ fontSize: 12.5, color: '#7b8299', marginTop: 2 }}>
              IFSC: UTIB0001234 · Priya Sharma
            </div>
          </div>
        </div>
        <button style={s.ghostBtn}>✏️ Change</button>
      </div>

      {/* Pending settlement highlight */}
      {pending && (
        <div style={s.pendingCard}>
          <div style={s.pendingTop}>
            <div>
              <div style={{ fontSize: 12, color: '#f5a000', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                ⏳ Next Settlement
              </div>
              <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 36, fontWeight: 600, color: '#23c55e', marginTop: 8, letterSpacing: -1 }}>
                ₹{pending.net.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 13, color: '#7b8299', marginTop: 4 }}>
                Payout expected on <strong style={{ color: '#e6e9f0' }}>{pending.expectedDate}</strong>
              </div>
            </div>

            <div style={s.breakdown}>
              <BreakdownRow label="Gross Earnings" value={`₹${pending.gross}`} />
              <BreakdownRow label="TDS Deducted (10%)" value={`−₹${pending.tds}`} negative />
              <BreakdownRow label="Platform Fees (5%)" value={`−₹${pending.fees}`} negative />
              <div style={{ height: 1, background: '#222736', margin: '8px 0' }} />
              <BreakdownRow label="Net Payout" value={`₹${pending.net}`} highlight />
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={s.statsGrid}>
        <StatCard color="#23c55e" icon="✅" label="Total Paid Out" value={`₹${totalPaid.toLocaleString('en-IN')}`} sub={`${SETTLEMENTS.filter(s => s.status === 'completed').length} settlements`} />
        <StatCard color="#f5a000" icon="⏳" label="Pending" value={`₹${pending?.net.toLocaleString('en-IN') || 0}`} sub="Processing this week" />
        <StatCard color="#4f8ef7" icon="📅" label="Payout Cycle" value="Weekly" sub="Every Monday" />
      </div>

      {/* Settlements history */}
      <div style={s.card}>
        <div style={s.cardHd}>
          <div style={{ ...s.cardHdIco, background: 'rgba(35,197,94,0.1)' }}>📜</div>
          <div style={{ flex: 1 }}>
            <div style={s.cardHdTitle}>Settlement History</div>
            <div style={s.cardHdSub}>{SETTLEMENTS.length} settlements total</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Settlement ID</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Period</th>
                <th style={s.th}>Sales</th>
                <th style={s.th}>Gross</th>
                <th style={s.th}>Net Paid</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {SETTLEMENTS.map(st => (
                <tr key={st.id} style={s.tr}>
                  <td style={{ ...s.td, fontWeight: 700, color: '#e6e9f0', fontSize: 12.5 }}>{st.id}</td>
                  <td style={{ ...s.td, color: '#7b8299' }}>{st.date}</td>
                  <td style={{ ...s.td, color: '#7b8299', fontSize: 12.5 }}>{st.period}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>
                      ×{st.sales}
                    </span>
                  </td>
                  <td style={{ ...s.td, color: '#e6e9f0', fontWeight: 600 }}>₹{st.gross}</td>
                  <td style={{ ...s.td, color: '#23c55e', fontWeight: 700 }}>₹{st.net}</td>
                  <td style={s.td}>
                    {st.status === 'completed' ? (
                      <span style={{ ...s.badge, background: 'rgba(35,197,94,0.15)', color: '#23c55e' }}>
                        ✓ Paid
                      </span>
                    ) : (
                      <span style={{ ...s.badge, background: 'rgba(245,160,0,0.15)', color: '#f5a000' }}>
                        ⏳ Processing
                      </span>
                    )}
                  </td>
                  <td style={s.td}>
                    <button onClick={() => setSelected(selected === st.id ? null : st.id)} style={s.viewBtn}>
                      {selected === st.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected settlement details */}
        {selected && (() => {
          const st = SETTLEMENTS.find(s => s.id === selected)
          return (
            <div style={s.detailBox}>
              <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 16, fontWeight: 600, color: '#e6e9f0', marginBottom: 14 }}>
                📋 Settlement Details — {st.id}
              </div>

              <div style={s.detailGrid}>
                <DetailItem label="Settlement Date" value={st.date} />
                <DetailItem label="Sales Period" value={st.period} />
                <DetailItem label="Total Sales" value={`${st.sales} reports`} />
                {st.utr && <DetailItem label="UTR Number" value={st.utr} mono />}
              </div>

              <div style={{ marginTop: 14, padding: 14, background: '#0a0c10', borderRadius: 8, border: '1px solid #222736' }}>
                <BreakdownRow label="Gross Earnings" value={`₹${st.gross}`} />
                <BreakdownRow label="TDS Deducted (10%)" value={`−₹${st.tds}`} negative />
                <BreakdownRow label="Platform Fees (5%)" value={`−₹${st.fees}`} negative />
                <div style={{ height: 1, background: '#222736', margin: '8px 0' }} />
                <BreakdownRow label="Net Amount Paid" value={`₹${st.net}`} highlight />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
                <button style={s.ghostBtn}>📄 View Invoice</button>
                <button style={s.primaryBtnSmall}>📥 Download Receipt</button>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ─── Helper components ───
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
      <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#7b8299', marginTop: 6 }}>{sub}</div>
    </div>
  )
}

function BreakdownRow({ label, value, negative, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
      <span style={{ color: '#7b8299', fontSize: 13 }}>{label}</span>
      <span style={{
        color: highlight ? '#23c55e' : negative ? '#f04444' : '#e6e9f0',
        fontWeight: highlight ? 800 : 700,
        fontSize: highlight ? 16 : 14,
      }}>
        {value}
      </span>
    </div>
  )
}

function DetailItem({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>
        {label}
      </div>
      <div style={{
        fontSize: 13.5,
        color: '#e6e9f0',
        fontWeight: 600,
        marginTop: 4,
        fontFamily: mono ? 'monospace' : "'Sora',sans-serif",
      }}>
        {value}
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
  primaryBtnSmall: {
    background: '#f0a500',
    color: '#0a0c10',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  ghostBtn: {
    background: 'transparent',
    border: '1px solid #222736',
    color: '#7b8299',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  bankCard: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  bankLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  bankIcon: {
    width: 48, height: 48,
    background: 'rgba(79,142,247,0.1)',
    border: '1px solid rgba(79,142,247,0.2)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    flexShrink: 0,
  },
  pendingCard: {
    background: 'linear-gradient(135deg, rgba(35,197,94,0.06), rgba(245,160,0,0.06))',
    border: '1px solid rgba(245,160,0,0.25)',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },
  pendingTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 24,
    flexWrap: 'wrap',
  },
  breakdown: {
    background: 'rgba(10,12,16,0.5)',
    border: '1px solid #222736',
    borderRadius: 10,
    padding: 14,
    minWidth: 260,
    flex: '1 1 260px',
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
  viewBtn: {
    background: '#171b23',
    border: '1px solid #222736',
    color: '#f0a500',
    padding: '6px 14px',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  detailBox: {
    marginTop: 16,
    padding: 20,
    background: '#0a0c10',
    border: '1px solid rgba(240,165,0,0.2)',
    borderRadius: 10,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },
}