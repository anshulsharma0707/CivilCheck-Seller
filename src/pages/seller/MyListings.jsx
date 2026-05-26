import { useState, useEffect } from 'react'
import { getMyListings, deleteListing } from '../../api/seller.api'

export default function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [toast, setToast]       = useState('')

  useEffect(() => { loadListings() }, [])

  const loadListings = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getMyListings()
      setListings(data.listings || [])
    } catch {
      setError('Listings load nahi huin')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yeh listing delete karna chahte ho?')) return
    try {
      await deleteListing(id)
      showToast('✅ Listing deleted!')
      loadListings()
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || 'Delete nahi hua'}`)
    }
  }

  // Status mapping — backend ke values frontend ke saath match karo
  const statusMap = {
    'APPROVED':       'active',
    'PENDING_REVIEW': 'pending',
    'REJECTED':       'rejected',
    'UNPUBLISHED':    'unpublished',
  }

  // Filter + search
  const filtered = listings.filter(l => {
    const status = statusMap[l.status] || 'pending'
    const matchSearch = !search ||
      (l.address || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.surveyNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.khasraNumber || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || status === filter
    return matchSearch && matchFilter
  })

  // Counts for filter chips
  const counts = {
    all:      listings.length,
    active:   listings.filter(l => l.status === 'APPROVED').length,
    pending:  listings.filter(l => l.status === 'PENDING_REVIEW').length,
    rejected: listings.filter(l => l.status === 'REJECTED').length,
  }

  const riskBadge = (risk) => {
    const map = {
      RED:   { bg: 'rgba(240,68,68,0.15)',  color: '#f04444', icon: '🔴', text: 'Risk' },
      AMBER: { bg: 'rgba(245,160,0,0.15)',  color: '#f5a000', icon: '🟡', text: 'Caution' },
      GREEN: { bg: 'rgba(35,197,94,0.15)',  color: '#23c55e', icon: '🟢', text: 'Clear' },
    }
    return map[risk] || map['GREEN']
  }

  const statusBadge = (status) => {
    const map = {
      APPROVED:       { bg: 'rgba(35,197,94,0.15)',   color: '#23c55e', text: 'Active' },
      PENDING_REVIEW: { bg: 'rgba(245,160,0,0.15)',   color: '#f5a000', text: 'Pending' },
      REJECTED:       { bg: 'rgba(240,68,68,0.15)',   color: '#f04444', text: 'Rejected' },
      UNPUBLISHED:    { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af', text: 'Unpublished' },
    }
    return map[status] || map['PENDING_REVIEW']
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

      {/* Search + Filter */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by address, city, survey no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
          {search && <button onClick={() => setSearch('')} style={s.clearBtn}>✕</button>}
        </div>

        <div style={s.chipsRow}>
          {[
            { id: 'all',      label: 'All'      },
            { id: 'active',   label: 'Active'   },
            { id: 'pending',  label: 'Pending'  },
            { id: 'rejected', label: 'Rejected' },
          ].map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)}
              style={{ ...s.chip, background: filter === c.id ? '#f0a500' : 'transparent', color: filter === c.id ? '#0a0c10' : '#7b8299', borderColor: filter === c.id ? '#f0a500' : '#222736' }}>
              {c.label} <span style={{ opacity: 0.7, marginLeft: 4 }}>{counts[c.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{ color: '#7b8299', fontSize: 13, marginBottom: 12 }}>
        Showing <strong style={{ color: '#e6e9f0' }}>{filtered.length}</strong> of {listings.length} listings
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(240,68,68,0.1)', border: '1px solid rgba(240,68,68,0.3)', borderRadius: 8, padding: '12px 16px', color: '#f04444', fontSize: 13, marginBottom: 16 }}>
          ❌ {error} <button onClick={loadListings} style={{ marginLeft: 10, color: '#4f8ef7', background: 'none', border: 'none', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#7b8299' }}>⏳ Loading listings...</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
          <div style={{ fontSize: 16, color: '#e6e9f0', marginBottom: 6 }}>
            {listings.length === 0 ? 'Abhi koi listing nahi hai' : 'Koi listing nahi mili'}
          </div>
          <div style={{ fontSize: 13, color: '#7b8299' }}>
            {listings.length === 0 ? '+ New Listing button se pehli listing create karo' : 'Search ya filter change karo'}
          </div>
        </div>
      ) : (
        <div style={s.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Property', 'Type', 'Risk', 'Price', 'Sales', 'Earned', 'Status', 'Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const r  = riskBadge(l.riskBadge)
                  const st = statusBadge(l.status)
                  const earned = (l.totalSales || 0) * l.price * 0.6
                  return (
                    <tr key={l.id} style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={s.td}>
                        <div style={{ fontWeight: 600, color: '#e6e9f0' }}>{l.address}</div>
                        <div style={{ fontSize: 11.5, color: '#7b8299', marginTop: 2 }}>
                          {l.surveyNumber || l.khasraNumber || '—'} · {l.city}, {l.tehsil}
                        </div>
                        <div style={{ fontSize: 11, color: '#3d4560', marginTop: 2 }}>
                          {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={s.typeChip}>{l.propertyType}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: r.bg, color: r.color }}>
                          {r.icon} {r.text}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontWeight: 700, color: '#e6e9f0' }}>₹{l.price}</td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>
                          ×{l.totalSales || 0}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: '#23c55e', fontWeight: 700 }}>
                        ₹{earned.toLocaleString('en-IN')}
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.text}</span>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={s.iconBtn} title="View">👁️</button>
                          <button style={s.iconBtn} title="Edit">✏️</button>
                          {(l.status === 'PENDING_REVIEW' || l.status === 'REJECTED') && (
                            <button onClick={() => handleDelete(l.id)}
                              style={{ ...s.iconBtn, color: '#f04444' }} title="Delete">🗑️</button>
                          )}
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

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#111318', border: '1px solid #222736', borderRadius: 10, padding: '12px 18px', zIndex: 999, fontSize: 13, fontWeight: 500, color: '#e6e9f0' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

const s = {
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' },
  title: { fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color: '#e6e9f0' },
  subtitle: { color: '#7b8299', fontSize: 14, marginTop: 4 },
  primaryBtn: { background: '#f0a500', color: '#0a0c10', border: 'none', padding: '11px 20px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  toolbar: { display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' },
  searchWrap: { position: 'relative', flex: '1 1 280px', minWidth: 240 },
  searchIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' },
  searchInput: { width: '100%', background: '#111318', border: '1px solid #222736', borderRadius: 9, padding: '11px 14px 11px 40px', color: '#e6e9f0', fontSize: 14, outline: 'none' },
  clearBtn: { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#7b8299', cursor: 'pointer', fontSize: 14, padding: 6 },
  chipsRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  chip: { border: '1px solid #222736', padding: '8px 14px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' },
  card: { background: '#111318', border: '1px solid #222736', borderRadius: 12, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '14px 16px', color: '#7b8299', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, borderBottom: '1px solid #222736', whiteSpace: 'nowrap', background: '#0a0c10' },
  tr: { borderTop: '1px solid #222736', transition: 'background .15s' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  badge: { padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-block' },
  typeChip: { padding: '3px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, background: '#171b23', color: '#7b8299', border: '1px solid #222736', whiteSpace: 'nowrap' },
  iconBtn: { width: 30, height: 30, background: '#171b23', border: '1px solid #222736', borderRadius: 6, color: '#7b8299', fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  emptyState: { background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 60, textAlign: 'center' },
}