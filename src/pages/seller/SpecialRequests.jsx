import { useState } from 'react'

// Mock data — 3 categories
const REQUESTS = [
  // NEW — Action needed
  {
    id: 1,
    status: 'new',
    title: 'Tonk Road Commercial Plot',
    location: 'Tonk Road, Jaipur · Plot #234',
    buyer: 'Rohit Verma',
    budget: 499,
    deadline: '48 hours',
    description: 'Need full title verification, encroachment check, and society NOC status. Property has 3 previous owners — need clear chain of title.',
    requestedAt: '2 hours ago',
  },
  {
    id: 2,
    status: 'new',
    title: 'Mansarovar Plot 78-A',
    location: 'Mansarovar, Jaipur · Survey #876',
    buyer: 'Anita Singh',
    budget: 399,
    deadline: '72 hours',
    description: 'JDA approval status check + water connection availability + nearby disputes if any.',
    requestedAt: '5 hours ago',
  },
  // IN PROGRESS
  {
    id: 3,
    status: 'progress',
    title: 'Bani Park Old House',
    location: 'Bani Park, Jaipur · Survey #112',
    buyer: 'Sunil Kumar',
    budget: 549,
    deadline: 'Due in 18 hours',
    description: 'Heritage property — need check on demolition restrictions, MCJ permissions, family partition disputes.',
    progress: 60,
    acceptedAt: '1 day ago',
  },
  {
    id: 4,
    status: 'progress',
    title: 'Sitapura Industrial Plot',
    location: 'Sitapura RIICO · Plot #34/B',
    buyer: 'Mahesh Agarwal',
    budget: 699,
    deadline: 'Due in 36 hours',
    description: 'RIICO allotment verification + pollution clearance status + power load sanction details.',
    progress: 30,
    acceptedAt: '12 hours ago',
  },
  // COMPLETED
  {
    id: 5,
    status: 'completed',
    title: 'Malviya Nagar Flat',
    location: 'Malviya Nagar · Survey #567',
    buyer: 'Priya Mehta',
    budget: 299,
    earned: 269,
    rating: 5,
    completedAt: '3 days ago',
    review: 'Bahut accha kaam kiya. Hidden encumbrance pakda jo mujhe nahi pata tha.',
  },
  {
    id: 6,
    status: 'completed',
    title: 'Vaishali Plot Survey',
    location: 'Vaishali Nagar · Plot 45',
    buyer: 'Deepak Sharma',
    budget: 499,
    earned: 449,
    rating: 4,
    completedAt: '1 week ago',
    review: 'Detailed report mili. Recommend karunga.',
  },
]

export default function SpecialRequests() {
  const [tab, setTab] = useState('new')

  const filtered = REQUESTS.filter(r => r.status === tab)

  const counts = {
    new: REQUESTS.filter(r => r.status === 'new').length,
    progress: REQUESTS.filter(r => r.status === 'progress').length,
    completed: REQUESTS.filter(r => r.status === 'completed').length,
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

      {/* Status tabs */}
      <div style={s.tabsRow}>
        {[
          { id: 'new',       label: 'New / Action Needed', icon: '🔔', color: '#f04444' },
          { id: 'progress',  label: 'In Progress',          icon: '⏳', color: '#f5a000' },
          { id: 'completed', label: 'Completed',            icon: '✅', color: '#23c55e' },
        ].map(t => {
          const active = tab === t.id
          return (
            <button key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...s.tab,
                background: active ? '#111318' : 'transparent',
                borderColor: active ? t.color : '#222736',
                color: active ? t.color : '#7b8299',
              }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span>{t.label}</span>
              <span style={{
                ...s.tabBadge,
                background: active ? `${t.color}22` : '#171b23',
                color: active ? t.color : '#7b8299',
              }}>
                {counts[t.id]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Cards list */}
      {filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 16, color: '#e6e9f0', marginBottom: 6 }}>Koi request nahi hai abhi</div>
          <div style={{ fontSize: 13, color: '#7b8299' }}>Jab buyers requests bhejenge, yahan dikhengi</div>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map(r => (
            <RequestCard key={r.id} req={r} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Individual request card ───
function RequestCard({ req }) {
  if (req.status === 'new') return <NewCard req={req} />
  if (req.status === 'progress') return <ProgressCard req={req} />
  if (req.status === 'completed') return <CompletedCard req={req} />
  return null
}

// NEW request — Accept / Decline
function NewCard({ req }) {
  return (
    <div style={{ ...s.card, borderLeft: '3px solid #f04444' }}>
      <div style={s.cardTop}>
        <div style={{ flex: 1 }}>
          <div style={s.cardTitle}>{req.title}</div>
          <div style={s.cardLocation}>📍 {req.location}</div>
        </div>
        <span style={{ ...s.urgentBadge }}>⚡ URGENT</span>
      </div>

      <div style={s.description}>{req.description}</div>

      <div style={s.metaRow}>
        <MetaItem icon="👤" label="Buyer" value={req.buyer} />
        <MetaItem icon="💰" label="Budget" value={`₹${req.budget}`} highlight />
        <MetaItem icon="⏱️" label="Deadline" value={req.deadline} />
        <MetaItem icon="🕒" label="Requested" value={req.requestedAt} />
      </div>

      <div style={s.actionRow}>
        <button style={s.declineBtn}>✕ Decline</button>
        <button style={s.acceptBtn}>✓ Accept Request</button>
      </div>
    </div>
  )
}

// IN PROGRESS — show progress bar + submit button
function ProgressCard({ req }) {
  return (
    <div style={{ ...s.card, borderLeft: '3px solid #f5a000' }}>
      <div style={s.cardTop}>
        <div style={{ flex: 1 }}>
          <div style={s.cardTitle}>{req.title}</div>
          <div style={s.cardLocation}>📍 {req.location}</div>
        </div>
        <span style={{ ...s.amberBadge }}>⏳ {req.deadline}</span>
      </div>

      <div style={s.description}>{req.description}</div>

      <div style={s.metaRow}>
        <MetaItem icon="👤" label="Buyer" value={req.buyer} />
        <MetaItem icon="💰" label="Budget" value={`₹${req.budget}`} highlight />
        <MetaItem icon="📅" label="Accepted" value={req.acceptedAt} />
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: '#7b8299' }}>Progress</span>
          <span style={{ color: '#f5a000', fontWeight: 700 }}>{req.progress}%</span>
        </div>
        <div style={s.progressBar}>
          <div style={{ ...s.progressFill, width: `${req.progress}%`, background: '#f5a000' }} />
        </div>
      </div>

      <div style={s.actionRow}>
        <button style={s.secondaryBtn}>📝 Update Progress</button>
        <button style={s.acceptBtn}>📤 Submit Report</button>
      </div>
    </div>
  )
}

// COMPLETED — show earnings + review
function CompletedCard({ req }) {
  return (
    <div style={{ ...s.card, borderLeft: '3px solid #23c55e' }}>
      <div style={s.cardTop}>
        <div style={{ flex: 1 }}>
          <div style={s.cardTitle}>{req.title}</div>
          <div style={s.cardLocation}>📍 {req.location}</div>
        </div>
        <span style={s.greenBadge}>✓ Completed</span>
      </div>

      <div style={s.metaRow}>
        <MetaItem icon="👤" label="Buyer" value={req.buyer} />
        <MetaItem icon="💰" label="Earned" value={`₹${req.earned}`} highlight />
        <MetaItem icon="⭐" label="Rating" value={'★'.repeat(req.rating) + '☆'.repeat(5 - req.rating)} />
        <MetaItem icon="📅" label="Completed" value={req.completedAt} />
      </div>

      {req.review && (
        <div style={s.reviewBox}>
          <div style={{ fontSize: 12, color: '#7b8299', marginBottom: 6, fontWeight: 600 }}>
            💬 Buyer Review
          </div>
          <div style={{ fontSize: 13.5, color: '#e6e9f0', fontStyle: 'italic' }}>
            "{req.review}"
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Meta item (icon + label + value) ───
function MetaItem({ icon, label, value, highlight }) {
  return (
    <div style={s.metaItem}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, color: '#7b8299', fontWeight: 600 }}>{label}</div>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: highlight ? '#f0a500' : '#e6e9f0',
          marginTop: 1,
        }}>
          {value}
        </div>
      </div>
    </div>
  )
}

// ─── Styles ───
const s = {
  headerRow: { marginBottom: 24 },
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
  tabsRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 18px',
    borderRadius: 10,
    border: '1px solid',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Sora',sans-serif",
    transition: 'all .15s',
  },
  tabBadge: {
    padding: '2px 9px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  card: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    padding: 20,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: "'Crimson Pro',serif",
    fontSize: 18,
    fontWeight: 600,
    color: '#e6e9f0',
  },
  cardLocation: {
    fontSize: 12.5,
    color: '#7b8299',
    marginTop: 4,
  },
  description: {
    fontSize: 13.5,
    color: '#e6e9f0',
    lineHeight: 1.6,
    margin: '12px 0',
    padding: 12,
    background: '#0a0c10',
    borderRadius: 8,
    border: '1px solid #222736',
  },
  metaRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
    marginTop: 12,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  urgentBadge: {
    background: 'rgba(240,68,68,0.15)',
    color: '#f04444',
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '.5px',
    whiteSpace: 'nowrap',
  },
  amberBadge: {
    background: 'rgba(245,160,0,0.15)',
    color: '#f5a000',
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  greenBadge: {
    background: 'rgba(35,197,94,0.15)',
    color: '#23c55e',
    padding: '4px 10px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  progressBar: {
    height: 6,
    background: '#222736',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
    transition: 'width .4s',
  },
  reviewBox: {
    marginTop: 14,
    padding: 14,
    background: '#0a0c10',
    border: '1px solid #222736',
    borderRadius: 8,
  },
  actionRow: {
    display: 'flex',
    gap: 10,
    marginTop: 14,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  acceptBtn: {
    background: '#f0a500',
    color: '#0a0c10',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  declineBtn: {
    background: 'transparent',
    color: '#7b8299',
    border: '1px solid #222736',
    padding: '10px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  secondaryBtn: {
    background: '#171b23',
    color: '#e6e9f0',
    border: '1px solid #222736',
    padding: '10px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  emptyState: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    padding: 60,
    textAlign: 'center',
  },
}