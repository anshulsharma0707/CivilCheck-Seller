import { useState } from 'react'

// Mock data — baad mein backend se aayega
const LISTINGS = [
  { id: 1, name: 'Vaishali Nagar Plot 45', survey: 'Survey #1234/B', area: 'Sanganer, Jaipur', type: 'Plot', risk: 'red', price: 299, sales: 18, earned: 3229, status: 'active', date: '12 May 2025' },
  { id: 2, name: 'Malviya Nagar Flat 2B', survey: 'Survey #567', area: 'Jaipur Sadar', type: 'Flat', risk: 'amber', price: 199, sales: 11, earned: 1311, status: 'active', date: '08 May 2025' },
  { id: 3, name: 'Jagatpura Commercial Plot', survey: 'Khasra #890', area: 'Amer, Jaipur', type: 'Commercial', risk: 'green', price: 499, sales: 6, earned: 1797, status: 'active', date: '05 May 2025' },
  { id: 4, name: 'Tonk Road Shop Unit', survey: 'Survey #234', area: 'Tonk Road, Jaipur', type: 'Commercial', risk: 'green', price: 399, sales: 4, earned: 956, status: 'active', date: '02 May 2025' },
  { id: 5, name: 'Mansarovar Villa Plot', survey: 'Survey #876', area: 'Mansarovar, Jaipur', type: 'Villa', risk: 'amber', price: 599, sales: 3, earned: 1437, status: 'active', date: '28 Apr 2025' },
  { id: 6, name: 'Bani Park Old House', survey: 'Survey #112', area: 'Bani Park, Jaipur', type: 'House', risk: 'red', price: 349, sales: 7, earned: 1466, status: 'active', date: '22 Apr 2025' },
  { id: 7, name: 'Agra Road Agri Land', survey: 'Khasra #445', area: 'Agra Road, Jaipur', type: 'Agricultural', risk: 'green', price: 249, sales: 2, earned: 398, status: 'pending', date: '20 Apr 2025' },
  { id: 8, name: 'Sodala Studio Apt', survey: 'Survey #909', area: 'Sodala, Jaipur', type: 'Flat', risk: 'amber', price: 199, sales: 5, earned: 596, status: 'active', date: '15 Apr 2025' },
  { id: 9, name: 'Pratap Nagar Plot', survey: 'Survey #678', area: 'Pratap Nagar', type: 'Plot', risk: 'green', price: 299, sales: 0, earned: 0, status: 'pending', date: '12 Apr 2025' },
  { id: 10, name: 'Sitapura Industrial', survey: 'Plot #34/B', area: 'Sitapura', type: 'Industrial', risk: 'red', price: 699, sales: 1, earned: 419, status: 'active', date: '08 Apr 2025' },
  { id: 11, name: 'Jhotwara Bungalow', survey: 'Survey #221', area: 'Jhotwara, Jaipur', type: 'House', risk: 'amber', price: 449, sales: 4, earned: 1077, status: 'sold', date: '02 Apr 2025' },
  { id: 12, name: 'Vidhyadhar Nagar Land', survey: 'Khasra #556', area: 'Vidhyadhar Nagar', type: 'Plot', risk: 'green', price: 349, sales: 8, earned: 2238, status: 'active', date: '28 Mar 2025' },
]

export default function MyListings() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  // Filter + search apply karo
  const filtered = LISTINGS.filter(l => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.area.toLowerCase().includes(search.toLowerCase()) ||
      l.survey.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || l.status === filter
    return matchSearch && matchFilter
  })

  // Status counts (filter chips ke liye)
  const counts = {
    all: LISTINGS.length,
    active: LISTINGS.filter(l => l.status === 'active').length,
    pending: LISTINGS.filter(l => l.status === 'pending').length,
    sold: LISTINGS.filter(l => l.status === 'sold').length,
  }

  const riskBadge = (risk) => {
    const map = {
      red:   { bg: 'rgba(240,68,68,0.15)', color: '#f04444', icon: '🔴', text: 'Risk' },
      amber: { bg: 'rgba(245,160,0,0.15)', color: '#f5a000', icon: '🟡', text: 'Caution' },
      green: { bg: 'rgba(35,197,94,0.15)', color: '#23c55e', icon: '🟢', text: 'Clear' },
    }
    return map[risk]
  }

  const statusBadge = (status) => {
    const map = {
      active:  { bg: 'rgba(35,197,94,0.15)', color: '#23c55e', text: 'Active' },
      pending: { bg: 'rgba(245,160,0,0.15)', color: '#f5a000', text: 'Pending' },
      sold:    { bg: 'rgba(155,110,247,0.15)', color: '#9b6ef7', text: 'Sold' },
    }
    return map[status]
  }

  return (
    <div>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>My Listings</h1>
          <p style={s.subtitle}>Aapki saari property listings yahan hain</p>
        </div>
        <button style={s.primaryBtn}>+ New Listing</button>
      </div>

      {/* Search + Filter chips */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, area, or survey no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
          {search && (
            <button onClick={() => setSearch('')} style={s.clearBtn}>✕</button>
          )}
        </div>

        <div style={s.chipsRow}>
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'pending', label: 'Pending' },
            { id: 'sold', label: 'Sold' },
          ].map(c => {
            const active = filter === c.id
            return (
              <button key={c.id}
                onClick={() => setFilter(c.id)}
                style={{
                  ...s.chip,
                  background: active ? '#f0a500' : 'transparent',
                  color: active ? '#0a0c10' : '#7b8299',
                  borderColor: active ? '#f0a500' : '#222736',
                }}>
                {c.label} <span style={{
                  opacity: 0.7,
                  marginLeft: 4,
                }}>{counts[c.id]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Result count */}
      <div style={{ color: '#7b8299', fontSize: 13, marginBottom: 12 }}>
        Showing <strong style={{ color: '#e6e9f0' }}>{filtered.length}</strong> of {LISTINGS.length} listings
      </div>

      {/* Listings table */}
      {filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, color: '#e6e9f0', marginBottom: 6 }}>Koi listing nahi mili</div>
          <div style={{ fontSize: 13, color: '#7b8299' }}>Apna search ya filter change karo</div>
        </div>
      ) : (
        <div style={s.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Property</th>
                  <th style={s.th}>Type</th>
                  <th style={s.th}>Risk</th>
                  <th style={s.th}>Price</th>
                  <th style={s.th}>Sales</th>
                  <th style={s.th}>Earned</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const r = riskBadge(l.risk)
                  const st = statusBadge(l.status)
                  return (
                    <tr key={l.id} style={s.tr}>
                      <td style={s.td}>
                        <div style={{ fontWeight: 600, color: '#e6e9f0' }}>{l.name}</div>
                        <div style={{ fontSize: 11.5, color: '#7b8299', marginTop: 2 }}>
                          {l.survey} · {l.area}
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={s.typeChip}>{l.type}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: r.bg, color: r.color }}>
                          {r.icon} {r.text}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontWeight: 700, color: '#e6e9f0' }}>₹{l.price}</td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>
                          ×{l.sales}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: '#23c55e', fontWeight: 700 }}>
                        ₹{l.earned.toLocaleString('en-IN')}
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: st.bg, color: st.color }}>
                          {st.text}
                        </span>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={s.iconBtn} title="View">👁️</button>
                          <button style={s.iconBtn} title="Edit">✏️</button>
                          <button style={{ ...s.iconBtn, color: '#f04444' }} title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
  toolbar: {
    display: 'flex',
    gap: 12,
    marginBottom: 14,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchWrap: {
    position: 'relative',
    flex: '1 1 280px',
    minWidth: 240,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 9,
    padding: '11px 14px 11px 40px',
    color: '#e6e9f0',
    fontSize: 14,
    fontFamily: "'Sora',sans-serif",
    outline: 'none',
  },
  clearBtn: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: '#7b8299',
    cursor: 'pointer',
    fontSize: 14,
    padding: 6,
  },
  chipsRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    border: '1px solid #222736',
    padding: '8px 14px',
    borderRadius: 99,
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
    transition: 'all .15s',
  },
  card: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    color: '#7b8299',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '.5px',
    fontWeight: 600,
    borderBottom: '1px solid #222736',
    whiteSpace: 'nowrap',
    background: '#0a0c10',
  },
  tr: {
    borderTop: '1px solid #222736',
    transition: 'background .15s',
  },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  badge: {
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  typeChip: {
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 11.5,
    fontWeight: 600,
    background: '#171b23',
    color: '#7b8299',
    border: '1px solid #222736',
    whiteSpace: 'nowrap',
  },
  iconBtn: {
    width: 30, height: 30,
    background: '#171b23',
    border: '1px solid #222736',
    borderRadius: 6,
    color: '#7b8299',
    fontSize: 13,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s',
  },
  emptyState: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    padding: 60,
    textAlign: 'center',
  },
}