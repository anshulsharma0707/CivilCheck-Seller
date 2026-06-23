import { useState, useEffect } from 'react'
import { getAvailableRequests, acceptRequest, declineRequest } from '../../api/seller.api'

export default function SpecialRequests() {
  const [tab, setTab]           = useState('new')
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [toast, setToast]       = useState('')

  useEffect(() => { loadRequests() }, [])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const data = await getAvailableRequests()
      setRequests(data.requests || [])
    } catch (err) {
      console.error('Special requests load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id)
      showToast('✅ Request accept kar li!')
      loadRequests()
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || 'Accept nahi hua'}`)
    }
  }

  const handleDecline = async (id) => {
    if (!confirm('Yeh request decline karna chahte ho?')) return
    try {
      await declineRequest(id, 'Not available')
      showToast('Request decline kar di')
      loadRequests()
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || 'Decline nahi hua'}`)
    }
  }

  // Backend status -> tab mapping
  const statusTab = (status) => {
    if (status === 'PENDING')    return 'new'
    if (status === 'ACCEPTED' || status === 'IN_PROGRESS') return 'progress'
    if (status === 'COMPLETED')  return 'completed'
    return 'new'
  }

  const filtered = requests.filter(r => statusTab(r.status) === tab)

  const counts = {
    new:       requests.filter(r => statusTab(r.status) === 'new').length,
    progress:  requests.filter(r => statusTab(r.status) === 'progress').length,
    completed: requests.filter(r => statusTab(r.status) === 'completed').length,
  }

  return (
    <div>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Special Requests</h1>
          <p style={s.subtitle}>Buyers ki custom property verification requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabsRow}>
        {[
          { id: 'new',       label: 'New / Action Needed', icon: '🔔', color: '#f04444' },
          { id: 'progress',  label: 'In Progress',          icon: '⏳', color: '#f5a000' },
          { id: 'completed', label: 'Completed',            icon: '✅', color: '#23c55e' },
        ].map(t => {
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ ...s.tab, background: active ? '#111318' : 'transparent', borderColor: active ? t.color : '#222736', color: active ? t.color : '#7b8299' }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span>{t.label}</span>
              <span style={{ ...s.tabBadge, background: active ? `${t.color}22` : '#171b23', color: active ? t.color : '#7b8299' }}>
                {counts[t.id]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#7b8299' }}>⏳ Loading requests...</div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 16, color: '#e6e9f0', marginBottom: 6 }}>Koi request nahi hai abhi</div>
          <div style={{ fontSize: 13, color: '#7b8299' }}>Jab buyers requests bhejenge, yahan dikhengi</div>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map(r => (
            <RequestCard
              key={r.id}
              req={r}
              tabType={tab}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
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

function RequestCard({ req, tabType, onAccept, onDecline }) {
  if (tabType === 'new')       return <NewCard req={req} onAccept={onAccept} onDecline={onDecline} />
  if (tabType === 'progress')  return <ProgressCard req={req} />
  if (tabType === 'completed') return <CompletedCard req={req} />
  return null
}

function NewCard({ req, onAccept, onDecline }) {
  const [acting, setActing] = useState(false)

  const handleAccept = async () => {
    setActing(true)
    await onAccept(req.id)
    setActing(false)
  }

  const handleDecline = async () => {
    setActing(true)
    await onDecline(req.id)
    setActing(false)
  }

  return (
    <div style={{ ...s.card, borderLeft: '3px solid #f04444' }}>
      <div style={s.cardTop}>
        <div style={{ flex: 1 }}>
          <div style={s.cardTitle}>{req.property?.address || req.title || 'Property Request'}</div>
          <div style={s.cardLocation}>📍 {req.property?.city || req.location || '—'}</div>
        </div>
        <span style={s.urgentBadge}>⚡ URGENT</span>
      </div>

      <div style={s.description}>{req.description || 'Verification request'}</div>

      <div style={s.metaRow}>
        <MetaItem icon="💰" label="Budget" value={`₹${req.budget || req.price || '—'}`} highlight />
        <MetaItem icon="⏱️" label="Deadline" value={req.deadline ? `${req.deadline}h remaining` : '48 hours'} />
        <MetaItem icon="🕒" label="Requested" value={req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN') : '—'} />
      </div>

      <div style={s.actionRow}>
        <button style={s.declineBtn} onClick={handleDecline} disabled={acting}>✕ Decline</button>
        <button style={s.acceptBtn} onClick={handleAccept} disabled={acting}>
          {acting ? '⏳...' : '✓ Accept Request'}
        </button>
      </div>
    </div>
  )
}

function ProgressCard({ req }) {
  return (
    <div style={{ ...s.card, borderLeft: '3px solid #f5a000' }}>
      <div style={s.cardTop}>
        <div style={{ flex: 1 }}>
          <div style={s.cardTitle}>{req.property?.address || req.title || 'Property Request'}</div>
          <div style={s.cardLocation}>📍 {req.property?.city || '—'}</div>
        </div>
        <span style={s.amberBadge}>⏳ In Progress</span>
      </div>

      <div style={s.description}>{req.description || 'Verification in progress'}</div>

      <div style={s.metaRow}>
        <MetaItem icon="💰" label="Budget" value={`₹${req.budget || req.price || '—'}`} highlight />
        <MetaItem icon="📅" label="Accepted" value={req.updatedAt ? new Date(req.updatedAt).toLocaleDateString('en-IN') : '—'} />
      </div>

      <div style={s.actionRow}>
        <button style={s.acceptBtn}>📤 Submit Report</button>
      </div>
    </div>
  )
}

function CompletedCard({ req }) {
  return (
    <div style={{ ...s.card, borderLeft: '3px solid #23c55e' }}>
      <div style={s.cardTop}>
        <div style={{ flex: 1 }}>
          <div style={s.cardTitle}>{req.property?.address || req.title || 'Property Request'}</div>
          <div style={s.cardLocation}>📍 {req.property?.city || '—'}</div>
        </div>
        <span style={s.greenBadge}>✓ Completed</span>
      </div>

      <div style={s.metaRow}>
        <MetaItem icon="💰" label="Budget" value={`₹${req.budget || '—'}`} highlight />
        <MetaItem icon="📅" label="Completed" value={req.updatedAt ? new Date(req.updatedAt).toLocaleDateString('en-IN') : '—'} />
      </div>
    </div>
  )
}

function MetaItem({ icon, label, value, highlight }) {
  return (
    <div style={s.metaItem}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: highlight ? '#f0a500' : '#e6e9f0', marginTop: 1 }}>{value}</div>
      </div>
    </div>
  )
}

const s = {
  headerRow: { marginBottom: 24 },
  title: { fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color: '#e6e9f0' },
  subtitle: { color: '#7b8299', fontSize: 14, marginTop: 4 },
  tabsRow: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  tab: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderRadius: 10, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Sora',sans-serif", transition: 'all .15s' },
  tabBadge: { padding: '2px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700 },
  list: { display: 'flex', flexDirection: 'column', gap: 14 },
  card: { background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 20 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  cardTitle: { fontFamily: "'Crimson Pro',serif", fontSize: 18, fontWeight: 600, color: '#e6e9f0' },
  cardLocation: { fontSize: 12.5, color: '#7b8299', marginTop: 4 },
  description: { fontSize: 13.5, color: '#e6e9f0', lineHeight: 1.6, margin: '12px 0', padding: 12, background: '#0a0c10', borderRadius: 8, border: '1px solid #222736' },
  metaRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 12 },
  metaItem: { display: 'flex', alignItems: 'flex-start', gap: 8 },
  urgentBadge: { background: 'rgba(240,68,68,0.15)', color: '#f04444', padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 800, letterSpacing: '.5px', whiteSpace: 'nowrap' },
  amberBadge: { background: 'rgba(245,160,0,0.15)', color: '#f5a000', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' },
  greenBadge: { background: 'rgba(35,197,94,0.15)', color: '#23c55e', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' },
  progressBar: { height: 6, background: '#222736', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99, transition: 'width .4s' },
  actionRow: { display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end', flexWrap: 'wrap' },
  acceptBtn: { background: '#f0a500', color: '#0a0c10', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
  declineBtn: { background: 'transparent', color: '#7b8299', border: '1px solid #222736', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
  secondaryBtn: { background: '#171b23', color: '#e6e9f0', border: '1px solid #222736', padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
  emptyState: { background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 60, textAlign: 'center' },
}