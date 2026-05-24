import { useState } from 'react'

export default function NewListing() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    // Step 1
    propertyName: '',
    propertyType: '',
    surveyNo: '',
    khasraNo: '',
    address: '',
    area: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    // Step 2
    riskLevel: '',
    riskDetails: '',
    findings: '',
    documents: [],
    // Step 3
    price: '',
    reportType: 'standard',
  })

  // Form value update
  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Step navigation
  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }
  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }
  const submit = () => {
    alert('Listing submit ho gayi! 🎉\n\n(Backend connect karne ke baad real submit hoga)')
    console.log('Form data:', form)
  }

  // Validation — har step ke liye
  const canProceed = () => {
    if (step === 1) {
      return form.propertyName && form.propertyType && form.address && form.area
    }
    if (step === 2) {
      return form.riskLevel && form.findings
    }
    if (step === 3) {
      return form.price && parseInt(form.price) > 0
    }
    return false
  }

  return (
    <div>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>New Property Listing</h1>
          <p style={s.subtitle}>Nayi property add karne ke liye 3 simple steps</p>
        </div>
      </div>

      {/* Stepper */}
      <div style={s.stepper}>
        {[
          { n: 1, label: 'Property Details' },
          { n: 2, label: 'Risk Assessment' },
          { n: 3, label: 'Pricing & Submit' },
        ].map((st, i, arr) => (
          <div key={st.n} style={s.stepItem}>
            <div style={{
              ...s.stepCircle,
              background: step >= st.n ? '#f0a500' : '#171b23',
              color: step >= st.n ? '#0a0c10' : '#7b8299',
              border: step === st.n ? '2px solid #f0a500' : '1px solid #222736',
            }}>
              {step > st.n ? '✓' : st.n}
            </div>
            <div style={{
              ...s.stepLabel,
              color: step >= st.n ? '#e6e9f0' : '#7b8299',
              fontWeight: step === st.n ? 700 : 500,
            }}>
              {st.label}
            </div>
            {i < arr.length - 1 && (
              <div style={{
                ...s.stepLine,
                background: step > st.n ? '#f0a500' : '#222736',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div style={s.card}>

        {/* ── STEP 1: Property Details ── */}
        {step === 1 && (
          <>
            <div style={s.cardHeader}>
              <div style={{ ...s.cardHdIco, background: 'rgba(79,142,247,0.1)' }}>🏠</div>
              <div>
                <div style={s.cardHdTitle}>Property Details</div>
                <div style={s.cardHdSub}>Basic information about the property</div>
              </div>
            </div>

            <div style={s.formGrid}>
              <FormField label="Property Name *" placeholder="e.g. Vaishali Nagar Plot 45"
                value={form.propertyName} onChange={v => update('propertyName', v)} />

              <FormSelect label="Property Type *" value={form.propertyType}
                onChange={v => update('propertyType', v)}
                options={['', 'Plot', 'Flat', 'House', 'Villa', 'Commercial', 'Industrial', 'Agricultural']} />

              <FormField label="Survey Number" placeholder="e.g. 1234/B"
                value={form.surveyNo} onChange={v => update('surveyNo', v)} />

              <FormField label="Khasra Number" placeholder="e.g. 890"
                value={form.khasraNo} onChange={v => update('khasraNo', v)} />

              <FormField label="Full Address *" placeholder="House no, street, locality"
                value={form.address} onChange={v => update('address', v)} fullWidth />

              <FormField label="Area / Locality *" placeholder="e.g. Sanganer"
                value={form.area} onChange={v => update('area', v)} />

              <FormField label="City" value={form.city}
                onChange={v => update('city', v)} />

              <FormField label="State" value={form.state}
                onChange={v => update('state', v)} />
            </div>
          </>
        )}

        {/* ── STEP 2: Risk Assessment ── */}
        {step === 2 && (
          <>
            <div style={s.cardHeader}>
              <div style={{ ...s.cardHdIco, background: 'rgba(245,160,0,0.1)' }}>⚠️</div>
              <div>
                <div style={s.cardHdTitle}>Risk Assessment</div>
                <div style={s.cardHdSub}>Property ke risks aur findings note karo</div>
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Risk Level *</label>
              <div style={s.riskGrid}>
                {[
                  { id: 'green', icon: '🟢', label: 'Clear', desc: 'No major issues', color: '#23c55e' },
                  { id: 'amber', icon: '🟡', label: 'Caution', desc: 'Minor concerns', color: '#f5a000' },
                  { id: 'red',   icon: '🔴', label: 'High Risk', desc: 'Serious issues', color: '#f04444' },
                ].map(r => {
                  const active = form.riskLevel === r.id
                  return (
                    <div key={r.id}
                      onClick={() => update('riskLevel', r.id)}
                      style={{
                        ...s.riskCard,
                        borderColor: active ? r.color : '#222736',
                        background: active ? `rgba(${r.id === 'green' ? '35,197,94' : r.id === 'amber' ? '245,160,0' : '240,68,68'},0.08)` : '#171b23',
                      }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{r.icon}</div>
                      <div style={{ fontWeight: 700, color: active ? r.color : '#e6e9f0', fontSize: 14 }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#7b8299', marginTop: 2 }}>{r.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <FormTextarea label="Key Findings *" placeholder="Aapne kya issues paye, jaise: legal disputes, encroachment, missing documents, etc."
              value={form.findings} onChange={v => update('findings', v)} rows={4} />

            <FormTextarea label="Additional Details" placeholder="Aur koi important note jo buyer ko pata hona chahiye"
              value={form.riskDetails} onChange={v => update('riskDetails', v)} rows={3} />

            <div style={s.field}>
              <label style={s.label}>Supporting Documents</label>
              <div style={s.uploadBox}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
                <div style={{ color: '#e6e9f0', fontSize: 14, fontWeight: 600 }}>
                  Drop files here or click to upload
                </div>
                <div style={{ color: '#7b8299', fontSize: 12, marginTop: 4 }}>
                  PDF, JPG, PNG up to 10MB each
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 3: Pricing ── */}
        {step === 3 && (
          <>
            <div style={s.cardHeader}>
              <div style={{ ...s.cardHdIco, background: 'rgba(240,165,0,0.1)' }}>💰</div>
              <div>
                <div style={s.cardHdTitle}>Pricing & Submit</div>
                <div style={s.cardHdSub}>Report ki price set karo aur submit karo</div>
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Report Type</label>
              <div style={s.priceGrid}>
                {[
                  { id: 'basic',    name: 'Basic', price: 199, desc: 'Quick overview' },
                  { id: 'standard', name: 'Standard', price: 299, desc: 'Detailed report' },
                  { id: 'premium',  name: 'Premium', price: 499, desc: 'Full investigation' },
                ].map(p => {
                  const active = form.reportType === p.id
                  return (
                    <div key={p.id}
                      onClick={() => { update('reportType', p.id); update('price', String(p.price)) }}
                      style={{
                        ...s.priceCard,
                        borderColor: active ? '#f0a500' : '#222736',
                        background: active ? 'rgba(240,165,0,0.08)' : '#171b23',
                      }}>
                      <div style={{ fontSize: 13, color: '#7b8299', fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 28, fontWeight: 600, color: active ? '#f0a500' : '#e6e9f0', marginTop: 6 }}>
                        ₹{p.price}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#7b8299', marginTop: 4 }}>{p.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <FormField label="Custom Price (₹) *" placeholder="299" type="number"
              value={form.price} onChange={v => update('price', v.replace(/\D/g, ''))} />

            {/* Summary preview */}
            <div style={s.summary}>
              <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 16, fontWeight: 600, color: '#e6e9f0', marginBottom: 12 }}>
                📋 Summary Preview
              </div>
              <SummaryRow label="Property" value={form.propertyName || '—'} />
              <SummaryRow label="Type" value={form.propertyType || '—'} />
              <SummaryRow label="Location" value={form.area ? `${form.area}, ${form.city}` : '—'} />
              <SummaryRow label="Risk Level" value={form.riskLevel ? form.riskLevel.toUpperCase() : '—'} />
              <SummaryRow label="Price" value={form.price ? `₹${form.price}` : '—'} highlight />
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div style={s.navRow}>
          <button onClick={prevStep} disabled={step === 1}
            style={{ ...s.secondaryBtn, opacity: step === 1 ? 0.4 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}>
            ← Back
          </button>

          {step < 3 ? (
            <button onClick={nextStep} disabled={!canProceed()}
              style={{ ...s.primaryBtn, opacity: canProceed() ? 1 : 0.5, cursor: canProceed() ? 'pointer' : 'not-allowed' }}>
              Next Step →
            </button>
          ) : (
            <button onClick={submit} disabled={!canProceed()}
              style={{ ...s.primaryBtn, opacity: canProceed() ? 1 : 0.5, cursor: canProceed() ? 'pointer' : 'not-allowed' }}>
              ✓ Submit Listing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Reusable input components ───
function FormField({ label, placeholder, value, onChange, type = 'text', fullWidth }) {
  return (
    <div style={{ ...s.field, gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
      <label style={s.label}>{label}</label>
      <input type={type} placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)}
        style={s.input} />
    </div>
  )
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={s.input}>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt || 'Select type...'}</option>
        ))}
      </select>
    </div>
  )
}

function FormTextarea({ label, placeholder, value, onChange, rows = 3 }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <textarea placeholder={placeholder} rows={rows}
        value={value} onChange={e => onChange(e.target.value)}
        style={{ ...s.input, resize: 'vertical', fontFamily: "'Sora',sans-serif" }} />
    </div>
  )
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div style={s.summaryRow}>
      <span style={{ color: '#7b8299', fontSize: 13 }}>{label}</span>
      <span style={{
        color: highlight ? '#f0a500' : '#e6e9f0',
        fontSize: 13,
        fontWeight: highlight ? 700 : 600,
      }}>
        {value}
      </span>
    </div>
  )
}

// ─── Styles ───
const s = {
  headerRow: {
    marginBottom: 24,
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
  stepper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    padding: '18px 20px',
    gap: 8,
    flexWrap: 'wrap',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: '1 1 200px',
    minWidth: 0,
  },
  stepCircle: {
    width: 32, height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
    transition: 'all .2s',
  },
  stepLabel: {
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  stepLine: {
    flex: 1,
    height: 2,
    minWidth: 20,
    transition: 'background .3s',
  },
  card: {
    background: '#111318',
    border: '1px solid #222736',
    borderRadius: 12,
    padding: 24,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1px solid #222736',
  },
  cardHdIco: {
    width: 40, height: 40,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  cardHdTitle: {
    fontFamily: "'Crimson Pro',serif",
    fontSize: 18,
    fontWeight: 600,
    color: '#e6e9f0',
  },
  cardHdSub: {
    fontSize: 12,
    color: '#7b8299',
    marginTop: 2,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },
  field: { marginBottom: 16 },
  label: {
    display: 'block',
    fontSize: 12,
    color: '#7b8299',
    marginBottom: 7,
    fontWeight: 600,
  },
  input: {
    width: '100%',
    background: '#171b23',
    border: '1px solid #222736',
    borderRadius: 8,
    padding: '11px 14px',
    color: '#e6e9f0',
    fontSize: 14,
    fontFamily: "'Sora',sans-serif",
    outline: 'none',
  },
  riskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  },
  riskCard: {
    border: '2px solid',
    borderRadius: 10,
    padding: 16,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all .15s',
  },
  uploadBox: {
    border: '2px dashed #222736',
    borderRadius: 10,
    padding: '32px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#171b23',
  },
  priceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12,
  },
  priceCard: {
    border: '2px solid',
    borderRadius: 10,
    padding: 16,
    cursor: 'pointer',
    transition: 'all .15s',
  },
  summary: {
    background: '#0a0c10',
    border: '1px solid #222736',
    borderRadius: 10,
    padding: 18,
    marginTop: 8,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #222736',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTop: '1px solid #222736',
  },
  primaryBtn: {
    background: '#f0a500',
    color: '#0a0c10',
    border: 'none',
    padding: '11px 24px',
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Sora',sans-serif",
    transition: 'opacity .2s',
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#7b8299',
    border: '1px solid #222736',
    padding: '11px 20px',
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Sora',sans-serif",
  },
}