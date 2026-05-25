import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

// KYC steps — done aur ek active
const KYC_STEPS = [
  {
    num: '✓', status: 'done',
    title: 'Mobile OTP Verification',
    desc: '+91 98765 43210 — Verified on January 10, 2025',
  },
  {
    num: '✓', status: 'done',
    title: 'Aadhaar Verification (DigiLocker)',
    desc: 'Identity confirmed via government DigiLocker API. No Aadhaar number stored.',
  },
  {
    num: '✓', status: 'done',
    title: 'Bar Council Registration',
    desc: 'Rajasthan Bar Council Reg. No. RJ/2016/1234 — Verified',
  },
  {
    num: '✓', status: 'done',
    title: 'Bank Account Linked',
    desc: 'HDFC Bank ···· 4521 · IFSC: HDFC0001234 · Verified via penny drop',
  },
  {
    num: '5', status: 'active',
    title: 'Profile Photo / Selfie',
    desc: 'Upload a clear selfie photo to complete your profile and build buyer trust.',
    action: 'Upload Photo',
  },
]

export default function KYC() {
  const { seller } = useAuth()
  const [editMode, setEditMode] = useState(false)

  // Seller info — agar API se aaye toh use kare, warna defaults
  const [profile, setProfile] = useState({
    fullName: seller?.name || 'Priya Sharma',
    mobile: seller?.phone ? `+91 ${seller.phone}` : '+91 98765 43210',
    email: seller?.email || 'priya.sharma@lawfirm.com',
    profession: seller?.profession || 'Property Lawyer',
    city: seller?.city || 'Jaipur, Rajasthan',
    bio: seller?.bio || 'Practising property lawyer with 8 years experience in Rajasthan courts. Specialise in title disputes, partition cases, and property due diligence across Jaipur, Jodhpur, and Udaipur districts.',
  })

  const initials = profile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  const handleSave = () => {
    setEditMode(false)
    // TODO: API call to save profile
    alert('Profile updated! (API connect karna hai)')
  }

  return (
    <div>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Profile & KYC</h1>
          <p style={s.subtitle}>Manage your identity verification and professional credentials</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ ...s.badge, ...s.badgeGreen }}>✓ KYC Approved</span>
          <span style={{ ...s.badge, ...s.badgeGold }}>🥈 Silver Seller</span>
        </div>
      </div>

      {/* 2 column grid */}
      <div style={s.mainGrid}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Personal Information */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(79,142,247,0.1)' }}>👤</div>
              <div style={s.cardHdTitle}>Personal Information</div>
              <button
                style={{ ...s.ghostBtn, marginLeft: 'auto' }}
                onClick={() => editMode ? handleSave() : setEditMode(true)}
              >
                {editMode ? '💾 Save' : '✏️ Edit'}
              </button>
            </div>

            <div style={s.cardBd}>
              {/* Avatar row */}
              <div style={s.avatarRow}>
                <div style={s.bigAvatar}>{initials}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#e6e9f0' }}>{profile.fullName}</div>
                  <div style={{ fontSize: 13, color: '#7b8299', marginTop: 2 }}>
                    {profile.profession} · {profile.city}
                  </div>
                  <div style={{ fontSize: 12, color: '#f0a500', marginTop: 4 }}>
                    Member since January 2025 · 🥈 Silver Seller
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div style={s.formGrid}>
                <div style={s.formRow}>
                  <div style={s.field}>
                    <label style={s.label}>Full Name</label>
                    <input
                      style={s.input}
                      value={profile.fullName}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Mobile</label>
                    <input
                      style={s.input}
                      value={profile.mobile}
                      disabled
                    />
                  </div>
                </div>

                <div style={s.formRow}>
                  <div style={s.field}>
                    <label style={s.label}>Email</label>
                    <input
                      type="email"
                      style={s.input}
                      value={profile.email}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Profession</label>
                    <select
                      style={s.input}
                      value={profile.profession}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                    >
                      <option>Property Lawyer</option>
                      <option>Civil Engineer</option>
                      <option>Tehsil Expert</option>
                    </select>
                  </div>
                </div>

                <div style={s.field}>
                  <label style={s.label}>City / Location</label>
                  <div style={s.inputWrap}>
                    <span style={s.inputIco}>📍</span>
                    <input
                      style={{ ...s.input, paddingLeft: 36 }}
                      value={profile.city}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    />
                  </div>
                </div>

                <div style={s.field}>
                  <label style={s.label}>
                    Bio / About <span style={s.opt}>Optional</span>
                  </label>
                  <textarea
                    style={{ ...s.input, minHeight: 90, resize: 'vertical', paddingTop: 10 }}
                    value={profile.bio}
                    disabled={!editMode}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>

                {editMode && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button style={s.ghostBtn} onClick={() => setEditMode(false)}>Cancel</button>
                    <button style={s.primaryBtn} onClick={handleSave}>Save Changes</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KYC Steps */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>🛡️</div>
              <div>
                <div style={s.cardHdTitle}>KYC Verification Steps</div>
                <div style={s.cardHdSub}>Complete all steps to start listing properties</div>
              </div>
            </div>
            <div style={s.cardBd}>
              {KYC_STEPS.map((step, i) => (
                <div key={i} style={{
                  ...s.kycStep,
                  background: step.status === 'done' ? 'rgba(35,197,94,0.05)' : 'rgba(240,165,0,0.06)',
                  borderColor: step.status === 'done' ? 'rgba(35,197,94,0.15)' : 'rgba(240,165,0,0.2)',
                }}>
                  <div style={{
                    ...s.kycStepNum,
                    background: step.status === 'done' ? '#23c55e' : '#f0a500',
                    color: step.status === 'done' ? '#fff' : '#0a0c10',
                  }}>
                    {step.num}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={s.kycTitle}>{step.title}</div>
                    <div style={s.kycDesc}>{step.desc}</div>
                  </div>
                  {step.status === 'done' ? (
                    <span style={{ ...s.badge, ...s.badgeGreen }}>✓ Done</span>
                  ) : (
                    <button style={s.primaryBtnSm}>{step.action}</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bank Details */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(35,197,94,0.1)' }}>🏦</div>
              <div style={s.cardHdTitle}>Bank Account for Settlements</div>
              <button style={{ ...s.ghostBtn, marginLeft: 'auto' }}>✏️ Update</button>
            </div>
            <div style={s.cardBd}>
              <div style={s.formGrid}>
                <div style={s.formRow}>
                  <div style={s.field}>
                    <label style={s.label}>Account Holder Name</label>
                    <input style={s.input} value="Priya Sharma" readOnly />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Bank Name</label>
                    <input style={s.input} value="HDFC Bank" readOnly />
                  </div>
                </div>
                <div style={s.formRow}>
                  <div style={s.field}>
                    <label style={s.label}>Account Number</label>
                    <input style={s.input} value="•••••••••••4521" readOnly />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>IFSC Code</label>
                    <input style={s.input} value="HDFC0001234" readOnly />
                  </div>
                </div>
              </div>
              <div style={s.bankVerified}>
                ✓ Account verified via penny drop · Settlements every Monday
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Performance Score */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>📊</div>
              <div style={s.cardHdTitle}>Performance Score</div>
            </div>
            <div style={s.cardBd}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: '#f0a500' }}>94.2%</div>
                <div style={{ fontSize: 12, color: '#7b8299' }}>Accuracy Score</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                {[
                  { label: 'Accuracy', value: '94.2%', pct: 94, color: '#23c55e' },
                  { label: 'Avg Rating', value: '4.7 / 5.0', pct: 94, color: '#f0a500' },
                  { label: 'Response Rate', value: '98%', pct: 98, color: '#4f8ef7' },
                ].map(m => (
                  <div key={m.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: '#7b8299' }}>{m.label}</span>
                      <span style={{ fontWeight: 600, color: m.color }}>{m.value}</span>
                    </div>
                    <div style={s.progressBar}>
                      <div style={{ ...s.progressFill, width: `${m.pct}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={s.scoreNote}>
                ⚠️ Accuracy below 95% needed for Gold. 1 more verified accurate listing will push you over.
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(245,160,0,0.1)' }}>⚠️</div>
              <div style={s.cardHdTitle}>Compliance</div>
            </div>
            <div style={{ ...s.cardBd, fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={s.complianceRow}>
                <span style={{ color: '#7b8299' }}>Violations</span>
                <span style={{ color: '#23c55e', fontWeight: 600 }}>0</span>
              </div>
              <div style={s.complianceRow}>
                <span style={{ color: '#7b8299' }}>Penalties</span>
                <span style={{ color: '#23c55e', fontWeight: 600 }}>₹0</span>
              </div>
              <div style={s.complianceRow}>
                <span style={{ color: '#7b8299' }}>Suspension Risk</span>
                <span style={{ color: '#23c55e', fontWeight: 600 }}>None</span>
              </div>
              <div style={{ height: 1, background: '#222736' }} />
              <div style={{ color: '#7b8299', lineHeight: 1.6 }}>
                Platform spot-checks <strong style={{ color: '#e6e9f0' }}>10% of listings</strong>. Three accuracy violations = permanent ban.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── STYLES ─────────────────────────────────────────────────────────
const s = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 18,
  },
  card: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardHd: {
    padding: '14px 18px',
    borderBottom: '1px solid #222736',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
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
    fontSize: 14,
    fontWeight: 600,
    color: '#e6e9f0',
  },
  cardHdSub: {
    fontSize: 12,
    color: '#7b8299',
    marginTop: 2,
  },
  cardBd: {
    padding: 18,
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 22,
  },
  bigAvatar: {
    width: 64, height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#f0a500,#ff6b35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 800,
    color: '#000',
    flexShrink: 0,
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#7b8299',
    fontWeight: 500,
  },
  opt: {
    fontSize: 11,
    color: '#3d4560',
    fontWeight: 400,
    marginLeft: 4,
  },
  input: {
    background: '#171b23',
    border: '1px solid #222736',
    borderRadius: 7,
    padding: '10px 12px',
    color: '#e6e9f0',
    fontSize: 13.5,
    fontFamily: "'Sora', sans-serif",
    outline: 'none',
    width: '100%',
  },
  inputWrap: {
    position: 'relative',
  },
  inputIco: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    pointerEvents: 'none',
  },
  badge: {
    padding: '7px 14px',
    borderRadius: 99,
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid transparent',
  },
  badgeGreen: {
    background: 'rgba(35,197,94,0.1)',
    color: '#23c55e',
    borderColor: 'rgba(35,197,94,0.2)',
  },
  badgeGold: {
    background: 'rgba(240,165,0,0.1)',
    color: '#f0a500',
    borderColor: 'rgba(240,165,0,0.2)',
  },
  primaryBtn: {
    background: '#f0a500',
    color: '#0a0c10',
    border: 'none',
    borderRadius: 7,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
  },
  primaryBtnSm: {
    background: '#f0a500',
    color: '#0a0c10',
    border: 'none',
    borderRadius: 7,
    padding: '7px 14px',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
  },
  ghostBtn: {
    background: 'transparent',
    border: '1px solid #222736',
    color: '#7b8299',
    borderRadius: 7,
    padding: '7px 14px',
    fontSize: 12.5,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
  },
  kycStep: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 16px',
    background: 'rgba(35,197,94,0.05)',
    border: '1px solid rgba(35,197,94,0.15)',
    borderRadius: 8,
    marginBottom: 10,
  },
  kycStepNum: {
    width: 32, height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  kycTitle: {
    fontSize: 13.5,
    fontWeight: 600,
    color: '#e6e9f0',
    marginBottom: 3,
  },
  kycDesc: {
    fontSize: 12,
    color: '#7b8299',
    lineHeight: 1.5,
  },
  bankVerified: {
    marginTop: 12,
    padding: '10px 14px',
    background: 'rgba(35,197,94,0.1)',
    border: '1px solid rgba(35,197,94,0.2)',
    borderRadius: 7,
    fontSize: 12.5,
    color: '#23c55e',
  },
  progressBar: {
    height: 6,
    background: '#171b23',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
    transition: 'width .4s',
  },
  scoreNote: {
    marginTop: 14,
    padding: 10,
    background: '#171b23',
    borderRadius: 7,
    fontSize: 12,
    color: '#7b8299',
    lineHeight: 1.5,
  },
  complianceRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}