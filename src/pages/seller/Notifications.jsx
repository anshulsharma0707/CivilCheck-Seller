import { useState } from 'react'

// Mock notifications — backend se aayegi list aise hi
const INITIAL_NOTIFS = [
  {
    id: 1,
    icon: '💰',
    title: 'Report Sold!',
    body: 'Your listing "Vaishali Nagar Plot 45" was purchased. You earned ₹179.40',
    highlight: '₹179.40',
    time: '2 hours ago',
    unread: true,
    type: 'sale',
  },
  {
    id: 2,
    icon: '📦',
    title: 'New Special Request Assigned',
    body: 'Mansarovar Residential Plot. Advance: ₹2,999. Please accept or decline within 12 hours.',
    time: '1 hour ago',
    unread: true,
    type: 'request',
  },
  {
    id: 3,
    icon: '⭐',
    title: '5-Star Review!',
    body: 'Buyer left a review on "Malviya Nagar Flat 2B" — "Very accurate report, saved me from a bad deal. Highly recommend!"',
    time: '5 hours ago',
    unread: true,
    type: 'review',
  },
  {
    id: 4,
    icon: '✅',
    title: 'Listing Approved',
    body: '"Jagatpura Commercial Plot" is now live on CivilCheck and visible to all buyers.',
    time: 'Yesterday, 4:30 PM',
    unread: false,
    type: 'approval',
  },
  {
    id: 5,
    icon: '💵',
    title: 'Settlement Processed',
    body: '₹2,880 transferred to HDFC Bank ···4521. Bank Ref: NEFT/2025051211234',
    time: 'May 12, 9:00 AM',
    unread: false,
    type: 'settlement',
  },
  {
    id: 6,
    icon: '🏅',
    title: 'Silver Badge Achieved!',
    body: "Congratulations! You've reached Silver Seller status with 5+ listings and 4.0+ rating. Commission bumped to 60%.",
    time: 'May 8, 11:20 AM',
    unread: false,
    type: 'badge',
  },
  {
    id: 7,
    icon: '🔔',
    title: 'Platform Update',
    body: 'New feature: Buyers can now subscribe to case update alerts on your listings. This may increase repeat purchases.',
    time: 'May 5, 12:00 PM',
    unread: false,
    type: 'platform',
  },
]

export default function Notifications() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS)
  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const unreadCount = notifs.filter(n => n.unread).length

  // Filter logic
  const filtered = filter === 'unread' ? notifs.filter(n => n.unread) : notifs

  // Single notification ko read mark karo
  const markRead = (id) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, unread: false } : n))
    // TODO: API call — PATCH /notifications/:id/read
  }

  // Sab ek saath read mark karo
  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, unread: false })))
    // TODO: API call — POST /notifications/mark-all-read
  }

  return (
    <div>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Notifications</h1>
          <p style={s.subtitle}>Stay updated on sales, reviews, and platform activity</p>
        </div>
        <button
          style={s.ghostBtn}
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div style={s.tabRow}>
        <div
          onClick={() => setFilter('all')}
          style={{
            ...s.tab,
            ...(filter === 'all' ? s.tabActive : {}),
          }}
        >
          All
          <span style={s.tabCount}>{notifs.length}</span>
        </div>
        <div
          onClick={() => setFilter('unread')}
          style={{
            ...s.tab,
            ...(filter === 'unread' ? s.tabActive : {}),
          }}
        >
          Unread
          {unreadCount > 0 && (
            <span style={{ ...s.tabCount, background: 'rgba(240,68,68,0.15)', color: '#f04444' }}>
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div style={s.card}>
        {filtered.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, color: '#e6e9f0', fontWeight: 600, marginBottom: 6 }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </div>
            <div style={{ fontSize: 13, color: '#7b8299' }}>
              {filter === 'unread' ? 'Sab kuch padh liya — saaf inbox!' : 'Naye updates yahan dikhenge'}
            </div>
          </div>
        ) : (
          filtered.map((n, idx) => (
            <div
              key={n.id}
              onClick={() => n.unread && markRead(n.id)}
              style={{
                ...s.notifItem,
                background: n.unread ? 'rgba(240,165,0,0.04)' : 'transparent',
                borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid #222736',
                cursor: n.unread ? 'pointer' : 'default',
              }}
            >
              {/* Unread/read dot */}
              <div style={{
                ...s.dot,
                background: n.unread ? '#f0a500' : '#3d4560',
                boxShadow: n.unread ? '0 0 8px rgba(240,165,0,0.5)' : 'none',
              }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={s.notifText}>
                  <span style={{ marginRight: 6 }}>{n.icon}</span>
                  <strong style={{ color: '#e6e9f0', fontWeight: 600 }}>{n.title}</strong>
                  <span style={{ color: '#7b8299' }}> — {n.body}</span>
                </div>
                <div style={s.notifTime}>{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      {filtered.length > 0 && (
        <div style={s.footerNote}>
          Showing {filtered.length} of {notifs.length} notifications
          {unreadCount > 0 && ` · ${unreadCount} unread`}
        </div>
      )}
    </div>
  )
}

// ─── STYLES ─────────────────────────────────────────────────────────
const s = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontFamily: "'Crimson Pro',serif",
    fontSize: 26,
    fontWeight: 600,
    color: '#e6e9f0',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#7b8299',
  },
  ghostBtn: {
    background: 'transparent',
    border: '1px solid #222736',
    color: '#7b8299',
    borderRadius: 7,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
    transition: 'all .15s',
  },
  tabRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    padding: '8px 16px',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 500,
    color: '#7b8299',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #222736',
    background: '#111318',
    transition: 'all .15s',
  },
  tabActive: {
    background: 'rgba(240,165,0,0.12)',
    color: '#f0a500',
    borderColor: 'rgba(240,165,0,0.3)',
  },
  tabCount: {
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 99,
    background: 'rgba(79,142,247,0.15)',
    color: '#4f8ef7',
  },
  card: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 10,
    overflow: 'hidden',
  },
  notifItem: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    transition: 'background .15s',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginTop: 7,
    flexShrink: 0,
    transition: 'all .2s',
  },
  notifText: {
    fontSize: 13.5,
    color: '#e6e9f0',
    lineHeight: 1.55,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11.5,
    color: '#7b8299',
    fontWeight: 500,
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
  },
  footerNote: {
    marginTop: 14,
    fontSize: 12,
    color: '#7b8299',
    textAlign: 'center',
  },
}