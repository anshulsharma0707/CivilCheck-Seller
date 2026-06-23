import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getSellerProfile, updateSellerProfile, getKycStatus } from '../../api/seller.api'

export default function KYC() {
  const { seller, refreshSeller } = useAuth()
  const [editMode, setEditMode]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState('')
  const [kycData, setKycData]     = useState(null)
  const [loading, setLoading]     = useState(true)

  // Editable profile fields
  const [profile, setProfile] = useState({
    fullName:    '',
    mobile:      '',
    profession:  '',
    bankAccount: '',
    ifsc:        '',
  })

  // Load real data on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [profileRes, kycRes] = await Promise.all([
        getSellerProfile(),
        getKycStatus(),
      ])
      const s = profileRes.seller
      setProfile({
        fullName:    s.name     || '',
        mobile:      s.phone    || '',
        profession:  s.profession || '',
        bankAccount: s.bankAccount || '',
        ifsc:        s.ifsc     || '',
      })
      setKycData(kycRes)
    } catch (err) {
      console.error('KYC load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      await updateSellerProfile({
        name:        profile.fullName,
        bankAccount: profile.bankAccount,
        ifsc:        profile.ifsc,
      })
      setSaveMsg('✅ Profile updated!')
      setEditMode(false)
      await refreshSeller()
    } catch (err) {
      setSaveMsg('❌ Save failed — try again')
    } finally {
      setSaving(false)
    }
  }

  const initials = profile.fullName
    ? profile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const kycStatus   = seller?.kycStatus   || 'PENDING'
  const badge       = seller?.badge       || 'BRONZE'
  const accuracy    = seller?.accuracyScore ?? 100
  const badgeEmoji  = badge === 'PLATINUM' ? '💎' : badge === 'GOLD' ? '🥇' : badge === 'SILVER' ? '🥈' : '🥉'
  const badgeLabel  = badge.charAt(0) + badge.slice(1).toLowerCase()

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#7b8299', fontSize: 14 }}>
      ⏳ Loading profile...
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Profile & KYC</h1>
          <p style={s.subtitle}>Manage your identity verification and professional credentials</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ ...s.badge, ...(kycStatus === 'APPROVED' ? s.badgeGreen : s.badgeAmber) }}>
            {kycStatus === 'APPROVED' ? '✓ KYC Approved' : '⏳ KYC Pending'}
          </span>
          <span style={{ ...s.badge, ...s.badgeGold }}>{badgeEmoji} {badgeLabel} Seller</span>
        </div>
      </div>

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
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : editMode ? '💾 Save' : '✏️ Edit'}
              </button>
            </div>

            <div style={s.cardBd}>
              {/* Avatar row */}
              <div style={s.avatarRow}>
                <div style={s.bigAvatar}>{initials}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#e6e9f0' }}>{profile.fullName || '—'}</div>
                  <div style={{ fontSize: 13, color: '#7b8299', marginTop: 2 }}>{profile.profession}</div>
                  <div style={{ fontSize: 12, color: '#f0a500', marginTop: 4 }}>{badgeEmoji} {badgeLabel} Seller</div>
                </div>
              </div>

              {saveMsg && (
                <div style={{
                  padding: '10px 14px', borderRadius: 7, fontSize: 13, marginBottom: 14,
                  background: saveMsg.startsWith('✅') ? 'rgba(35,197,94,0.1)' : 'rgba(240,68,68,0.1)',
                  color: saveMsg.startsWith('✅') ? '#23c55e' : '#f04444',
                  border: `1px solid ${saveMsg.startsWith('✅') ? 'rgba(35,197,94,0.2)' : 'rgba(240,68,68,0.2)'}`,
                }}>
                  {saveMsg}
                </div>
              )}

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
                    <input style={s.input} value={`+91 ${profile.mobile}`} disabled />
                  </div>
                </div>

                <div style={s.field}>
                  <label style={s.label}>Profession</label>
                  <input style={s.input} value={profile.profession} disabled />
                </div>

                {editMode && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button style={s.ghostBtn} onClick={() => { setEditMode(false); setSaveMsg('') }}>Cancel</button>
                    <button style={s.primaryBtn} onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KYC Steps — real status from backend */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>🛡️</div>
              <div>
                <div style={s.cardHdTitle}>KYC Verification Steps</div>
                <div style={s.cardHdSub}>Complete all steps to start listing properties</div>
              </div>
            </div>
            <div style={s.cardBd}>
              {[
                {
                  title: 'Mobile OTP Verification',
                  done: true,
                  desc: `+91 ${profile.mobile} — Verified`,
                },
                {
                  title: 'Aadhaar Verification (DigiLocker)',
                  done: seller?.aadhaarVerified || false,
                  desc: seller?.aadhaarVerified
                    ? 'Identity confirmed via government DigiLocker API.'
                    : 'Aadhaar verification pending.',
                },
                {
                  title: 'KYC Approval',
                  done: kycStatus === 'APPROVED',
                  desc: kycStatus === 'APPROVED'
                    ? 'KYC fully verified — listings create kar sakte hain'
                    : kycStatus === 'UNDER_REVIEW'
                    ? 'Documents under review — 24-48 hours mein update milega'
                    : 'KYC pending — admin review ka wait karo',
                },
                {
                  title: 'Bank Account Linked',
                  done: !!(seller?.bankAccount && seller?.ifsc),
                  desc: seller?.bankAccount
                    ? `Account ···· ${seller.bankAccount.slice(-4)} · IFSC: ${seller.ifsc}`
                    : 'Bank account link nahi hai — neeche add karo',
                },
              ].map((step, i) => (
                <div key={i} style={{
                  ...s.kycStep,
                  background: step.done ? 'rgba(35,197,94,0.05)' : 'rgba(240,165,0,0.06)',
                  borderColor: step.done ? 'rgba(35,197,94,0.15)' : 'rgba(240,165,0,0.2)',
                }}>
                  <div style={{
                    ...s.kycStepNum,
                    background: step.done ? '#23c55e' : '#f0a500',
                    color: step.done ? '#fff' : '#0a0c10',
                  }}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={s.kycTitle}>{step.title}</div>
                    <div style={s.kycDesc}>{step.desc}</div>
                  </div>
                  {step.done
                    ? <span style={{ ...s.badge, ...s.badgeGreen }}>✓ Done</span>
                    : <span style={{ ...s.badge, ...s.badgeAmber }}>⏳ Pending</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Bank Details */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(35,197,94,0.1)' }}>🏦</div>
              <div style={s.cardHdTitle}>Bank Account for Settlements</div>
              <button style={{ ...s.ghostBtn, marginLeft: 'auto' }} onClick={() => setEditMode(true)}>✏️ Update</button>
            </div>
            <div style={s.cardBd}>
              <div style={s.formGrid}>
                <div style={s.formRow}>
                  <div style={s.field}>
                    <label style={s.label}>Account Number</label>
                    <input
                      style={s.input}
                      value={editMode ? profile.bankAccount : (profile.bankAccount ? `•••• ${profile.bankAccount.slice(-4)}` : '—')}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                      placeholder="Account number"
                    />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>IFSC Code</label>
                    <input
                      style={s.input}
                      value={profile.ifsc}
                      disabled={!editMode}
                      onChange={(e) => setProfile({ ...profile, ifsc: e.target.value.toUpperCase() })}
                      placeholder="IFSC code"
                    />
                  </div>
                </div>
              </div>
              {seller?.bankAccount && (
                <div style={s.bankVerified}>
                  ✓ Bank account linked · Settlements every Monday
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Performance Score — real data */}
          <div style={s.card}>
            <div style={s.cardHd}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>📊</div>
              <div style={s.cardHdTitle}>Performance Score</div>
            </div>
            <div style={s.cardBd}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: '#f0a500' }}>{accuracy}%</div>
                <div style={{ fontSize: 12, color: '#7b8299' }}>Accuracy Score</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                {[
                  { label: 'Accuracy', value: `${accuracy}%`, pct: accuracy, color: '#23c55e' },
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

              {accuracy < 95 && (
                <div style={s.scoreNote}>
                  ⚠️ Gold badge ke liye 95% accuracy chahiye. Accurate listings se score badhega.
                </div>
              )}
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
                <span style={{ color: '#7b8299' }}>KYC Status</span>
                <span style={{ color: kycStatus === 'APPROVED' ? '#23c55e' : '#f0a500', fontWeight: 600 }}>
                  {kycStatus}
                </span>
              </div>
              <div style={s.complianceRow}>
                <span style={{ color: '#7b8299' }}>Badge Level</span>
                <span style={{ color: '#f0a500', fontWeight: 600 }}>{badgeEmoji} {badgeLabel}</span>
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

const s = {
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  title: { fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color: '#e6e9f0', marginBottom: 4 },
  subtitle: { fontSize: 13.5, color: '#7b8299' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18 },
  card: { background: '#111318', border: '1px solid #222736', borderRadius: 10, overflow: 'hidden' },
  cardHd: { padding: '14px 18px', borderBottom: '1px solid #222736', display: 'flex', alignItems: 'center', gap: 12 },
  cardHdIco: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  cardHdTitle: { fontSize: 14, fontWeight: 600, color: '#e6e9f0' },
  cardHdSub: { fontSize: 12, color: '#7b8299', marginTop: 2 },
  cardBd: { padding: 18 },
  avatarRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 },
  bigAvatar: { width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#f0a500,#ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#000', flexShrink: 0 },
  formGrid: { display: 'flex', flexDirection: 'column', gap: 14 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, color: '#7b8299', fontWeight: 500 },
  input: { background: '#171b23', border: '1px solid #222736', borderRadius: 7, padding: '10px 12px', color: '#e6e9f0', fontSize: 13.5, fontFamily: "'Sora', sans-serif", outline: 'none', width: '100%' },
  badge: { padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, border: '1px solid transparent' },
  badgeGreen: { background: 'rgba(35,197,94,0.1)', color: '#23c55e', borderColor: 'rgba(35,197,94,0.2)' },
  badgeAmber: { background: 'rgba(240,165,0,0.1)', color: '#f0a500', borderColor: 'rgba(240,165,0,0.2)' },
  badgeGold: { background: 'rgba(240,165,0,0.1)', color: '#f0a500', borderColor: 'rgba(240,165,0,0.2)' },
  primaryBtn: { background: '#f0a500', color: '#0a0c10', border: 'none', borderRadius: 7, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif" },
  ghostBtn: { background: 'transparent', border: '1px solid #222736', color: '#7b8299', borderRadius: 7, padding: '7px 14px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: "'Sora', sans-serif" },
  kycStep: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 8, marginBottom: 10, border: '1px solid' },
  kycStepNum: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 },
  kycTitle: { fontSize: 13.5, fontWeight: 600, color: '#e6e9f0', marginBottom: 3 },
  kycDesc: { fontSize: 12, color: '#7b8299', lineHeight: 1.5 },
  bankVerified: { marginTop: 12, padding: '10px 14px', background: 'rgba(35,197,94,0.1)', border: '1px solid rgba(35,197,94,0.2)', borderRadius: 7, fontSize: 12.5, color: '#23c55e' },
  progressBar: { height: 6, background: '#171b23', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99, transition: 'width .4s' },
  scoreNote: { marginTop: 14, padding: 10, background: '#171b23', borderRadius: 7, fontSize: 12, color: '#7b8299', lineHeight: 1.5 },
  complianceRow: { display: 'flex', justifyContent: 'space-between' },
}