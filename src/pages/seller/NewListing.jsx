import { useState } from 'react'

// ─── Property type ke hisaab se konse fields dikhne chahiye ───
const PROPERTY_FIELDS = {
  RESIDENTIAL: {
    label: 'Residential',
    icon: '🏠',
    fields: ['colonyApartment', 'flatHouseNo', 'landmark', 'pinCode', 'city', 'tehsil', 'surveyNo', 'propertyArea', 'isBuilt'],
  },
  COMMERCIAL: {
    label: 'Commercial',
    icon: '🏢',
    fields: ['colonyApartment', 'flatHouseNo', 'landmark', 'pinCode', 'city', 'tehsil', 'surveyNo', 'propertyArea', 'isBuilt'],
  },
  AGRICULTURAL: {
    label: 'Agricultural',
    icon: '🌾',
    fields: ['khasraNo', 'address', 'city', 'tehsil', 'surveyNo'],
  },
  PLOT: {
    label: 'Plot',
    icon: '📐',
    fields: ['colonyApartment', 'flatHouseNo', 'landmark', 'pinCode', 'city', 'tehsil', 'surveyNo', 'propertyArea', 'isBuilt'],
  },
  OTHER: {
    label: 'Other',
    icon: '🏗️',
    fields: ['colonyApartment', 'flatHouseNo', 'landmark', 'pinCode', 'city', 'tehsil', 'surveyNo', 'propertyArea', 'isBuilt'],
  },
}

export default function NewListing() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    // Step 1
    propertyType: '',
    // Agricultural ke liye purana address field
    address: '',
    // Non-agricultural ke liye naye address fields
    colonyApartment: '',
    flatHouseNo: '',
    landmark: '',
    pinCode: '',
    city: '',
    tehsil: '',
    surveyNo: '',
    khasraNo: '',
    propertyArea: '',
    isBuilt: '',
    // Step 2
    caseExists: '',
    caseType: '',
    caseStatus: '',
    courtName: '',
    partiesInvolved: '',
    loanDefault: false,
    lenderName: '',
    sellerNotes: '',
    documents: [],
    // Step 3
    price: '',
    reportType: 'standard',
  })

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const selectedType = PROPERTY_FIELDS[form.propertyType]
  const isAgricultural = form.propertyType === 'AGRICULTURAL'

  const showField = (fieldName) => {
    if (!selectedType) return false
    return selectedType.fields.includes(fieldName)
  }

  const nextStep = () => { if (step < 3) setStep(step + 1) }
  const prevStep = () => { if (step > 1) setStep(step - 1) }
  const submit   = () => {
    alert('Listing submit ho gayi! 🎉')
    console.log('Form data:', form)
  }

  const canProceed = () => {
    if (step === 1) {
      if (!form.propertyType) return false
      if (isAgricultural) {
        if (!form.address || !form.city || !form.tehsil) return false
        if (!form.khasraNo) return false
        return true
      }
      if (!form.colonyApartment || !form.flatHouseNo || !form.pinCode || !form.city || !form.tehsil) return false
      if (!form.propertyArea) return false
      if (!form.isBuilt) return false
      return true
    }
    if (step === 2) return form.caseExists !== ''
    if (step === 3) return form.price && parseInt(form.price) > 0
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
          { n: 2, label: 'Case & Risk Info' },
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
              <div style={{ ...s.stepLine, background: step > st.n ? '#f0a500' : '#222736' }} />
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
                <div style={s.cardHdSub}>Pehle property type chunein — phir relevant fields fill karein</div>
              </div>
            </div>

            {/* ── Property Type Selector ── */}
            <div style={s.field}>
              <label style={s.label}>Property Type *</label>
              <div style={s.typeGrid}>
                {Object.entries(PROPERTY_FIELDS).map(([key, val]) => {
                  const active = form.propertyType === key
                  return (
                    <div
                      key={key}
                      onClick={() => {
                        update('propertyType', key)
                        // Type change hone par fields reset karo
                        update('khasraNo', '')
                        update('surveyNo', '')
                        update('address', '')
                        update('colonyApartment', '')
                        update('flatHouseNo', '')
                        update('landmark', '')
                        update('pinCode', '')
                        update('propertyArea', '')
                        update('isBuilt', '')
                      }}
                      style={{
                        ...s.typeCard,
                        borderColor: active ? '#f0a500' : '#222736',
                        background: active ? 'rgba(240,165,0,0.08)' : '#171b23',
                      }}
                    >
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{val.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: active ? '#f0a500' : '#e6e9f0' }}>
                        {val.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Conditional Fields — type select karne ke baad dikhenge ── */}
            {form.propertyType && (
              <div style={s.fieldsSection}>
                <div style={s.fieldsSectionHd}>
                  <span style={{ fontSize: 13 }}>
                    {selectedType.icon} {selectedType.label} ke liye required fields
                  </span>
                </div>

                <div style={s.formGrid}>

                  {/* Khasra Number — sirf Agricultural mein */}
                  {showField('khasraNo') && (
                    <FormField
                      label="Khasra Number *"
                      placeholder="e.g. 890/2"
                      value={form.khasraNo}
                      onChange={v => update('khasraNo', v)}
                    />
                  )}

                  {/* Full Address — sirf Agricultural mein (purana field) */}
                  {showField('address') && (
                    <FormField
                      label="Full Address *"
                      placeholder="Ghar/Dukan number, street, locality"
                      value={form.address}
                      onChange={v => update('address', v)}
                      fullWidth
                    />
                  )}

                  {/* Colony / Apartment — non-agricultural */}
                  {showField('colonyApartment') && (
                    <FormField
                      label="Colony / Apartment Name *"
                      placeholder="e.g. Shastri Nagar / Sunrise Apartments"
                      value={form.colonyApartment}
                      onChange={v => update('colonyApartment', v)}
                      fullWidth
                    />
                  )}

                  {/* Flat / House Number — non-agricultural */}
                  {showField('flatHouseNo') && (
                    <FormField
                      label="Flat / House Number *"
                      placeholder="e.g. B-204 / 12"
                      value={form.flatHouseNo}
                      onChange={v => update('flatHouseNo', v)}
                    />
                  )}

                  {/* Landmark — non-agricultural */}
                  {showField('landmark') && (
                    <FormField
                      label="Landmark"
                      placeholder="e.g. Near City Hospital"
                      value={form.landmark}
                      onChange={v => update('landmark', v)}
                    />
                  )}

                  {/* Pin Code — non-agricultural */}
                  {showField('pinCode') && (
                    <FormField
                      label="Pin Code *"
                      placeholder="e.g. 302001"
                      value={form.pinCode}
                      onChange={v => update('pinCode', v.replace(/\D/g, '').slice(0, 6))}
                    />
                  )}

                  {/* City */}
                  {showField('city') && (
                    <FormField
                      label="City *"
                      placeholder="e.g. Jaipur"
                      value={form.city}
                      onChange={v => update('city', v)}
                    />
                  )}

                  {/* Tehsil */}
                  {showField('tehsil') && (
                    <FormField
                      label="Tehsil *"
                      placeholder="e.g. Sanganer"
                      value={form.tehsil}
                      onChange={v => update('tehsil', v)}
                    />
                  )}

                  {/* Survey Number — sabke liye */}
                  {showField('surveyNo') && (
                    <FormField
                      label="Survey Number"
                      placeholder="e.g. 1234/B"
                      value={form.surveyNo}
                      onChange={v => update('surveyNo', v)}
                    />
                  )}

                  {/* Property Area — non-agricultural */}
                  {showField('propertyArea') && (
                    <FormField
                      label="Property Area *"
                      placeholder="e.g. 1200 sq ft"
                      value={form.propertyArea}
                      onChange={v => update('propertyArea', v)}
                    />
                  )}

                </div>

                {/* Built or Vacant Land — non-agricultural, yes/no style cards */}
                {showField('isBuilt') && (
                  <div style={{ ...s.field, marginTop: 4 }}>
                    <label style={s.label}>Property Bana Hua Hai Ya Khali Land Hai? *</label>
                    <div style={s.yesNoGrid}>
                      {[
                        { val: 'built',  label: 'Bana Hua Hai', icon: '🏗️', color: '#4f8ef7' },
                        { val: 'vacant', label: 'Khali Land Hai',  icon: '🟫', color: '#23c55e' },
                      ].map(opt => {
                        const active = form.isBuilt === opt.val
                        return (
                          <div
                            key={opt.val}
                            onClick={() => update('isBuilt', opt.val)}
                            style={{
                              ...s.yesNoCard,
                              borderColor: active ? opt.color : '#222736',
                              background: active ? `rgba(${opt.val === 'built' ? '79,142,247' : '35,197,94'},0.08)` : '#171b23',
                            }}
                          >
                            <span style={{ fontSize: 22 }}>{opt.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: active ? opt.color : '#e6e9f0' }}>
                              {opt.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Placeholder jab type select nahi kiya */}
            {!form.propertyType && (
              <div style={s.placeholder}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>👆</div>
                <div style={{ color: '#e6e9f0', fontWeight: 600, fontSize: 14 }}>
                  Upar se property type chunein
                </div>
                <div style={{ color: '#7b8299', fontSize: 12, marginTop: 4 }}>
                  Type select karne ke baad relevant fields automatically dikhenge
                </div>
              </div>
            )}
          </>
        )}

        {/* ── STEP 2: Case & Risk Info ── */}
        {step === 2 && (
          <>
            <div style={s.cardHeader}>
              <div style={{ ...s.cardHdIco, background: 'rgba(245,160,0,0.1)' }}>⚠️</div>
              <div>
                <div style={s.cardHdTitle}>Case & Risk Information</div>
                <div style={s.cardHdSub}>Property ke legal aur financial risks clearly batao</div>
              </div>
            </div>

            {/* Case exists? */}
            <div style={s.field}>
              <label style={s.label}>Kya koi court case hai? *</label>
              <div style={s.yesNoGrid}>
                {[
                  { val: 'true',  label: 'Haan, case hai',  icon: '⚖️', color: '#f04444' },
                  { val: 'false', label: 'Nahi, koi case nahi', icon: '✅', color: '#23c55e' },
                ].map(opt => {
                  const active = form.caseExists === opt.val
                  return (
                    <div
                      key={opt.val}
                      onClick={() => update('caseExists', opt.val)}
                      style={{
                        ...s.yesNoCard,
                        borderColor: active ? opt.color : '#222736',
                        background: active ? `rgba(${opt.val === 'true' ? '240,68,68' : '35,197,94'},0.08)` : '#171b23',
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{opt.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: active ? opt.color : '#e6e9f0' }}>
                        {opt.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Case details — sirf tab dikho jab caseExists = true */}
            {form.caseExists === 'true' && (
              <div style={s.caseSection}>
                <div style={s.caseSectionHd}>⚖️ Case Details</div>
                <div style={s.formGrid}>
                  <div style={s.field}>
                    <label style={s.label}>Case Type</label>
                    <select value={form.caseType} onChange={e => update('caseType', e.target.value)} style={s.input}>
                      <option value="">Select...</option>
                      <option value="PARTITION">Partition</option>
                      <option value="TITLE_DISPUTE">Title Dispute</option>
                      <option value="LOAN_DEFAULT">Loan Default</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Case Status</label>
                    <select value={form.caseStatus} onChange={e => update('caseStatus', e.target.value)} style={s.input}>
                      <option value="">Select...</option>
                      <option value="ACTIVE">Active</option>
                      <option value="STAYED">Stayed</option>
                      <option value="DISPOSED">Disposed</option>
                    </select>
                  </div>
                  <FormField label="Court Name" placeholder="e.g. District Court, Jaipur"
                    value={form.courtName} onChange={v => update('courtName', v)} />
                  <FormField label="Parties Involved" placeholder="Names of parties in case"
                    value={form.partiesInvolved} onChange={v => update('partiesInvolved', v)} />
                </div>
              </div>
            )}

            {/* Loan Default */}
            <div style={{ ...s.field, marginTop: 8 }}>
              <label style={s.label}>Loan Default / Bank Dues?</label>
              <div style={s.yesNoGrid}>
                {[
                  { val: true,  label: 'Haan, dues hain', icon: '🏦', color: '#f04444' },
                  { val: false, label: 'Nahi', icon: '✅', color: '#23c55e' },
                ].map(opt => {
                  const active = form.loanDefault === opt.val
                  return (
                    <div
                      key={String(opt.val)}
                      onClick={() => update('loanDefault', opt.val)}
                      style={{
                        ...s.yesNoCard,
                        borderColor: active ? opt.color : '#222736',
                        background: active ? `rgba(${opt.val ? '240,68,68' : '35,197,94'},0.08)` : '#171b23',
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{opt.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: active ? opt.color : '#e6e9f0' }}>
                        {opt.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {form.loanDefault === true && (
              <FormField label="Lender Name" placeholder="Bank / NBFC ka naam"
                value={form.lenderName} onChange={v => update('lenderName', v)} />
            )}

            <FormTextarea label="Seller Notes (Optional)"
              placeholder="Koi aur zaroori information jo buyers ko pata honi chahiye"
              value={form.sellerNotes} onChange={v => update('sellerNotes', v)} rows={3} />

            {/* Documents */}
            <div style={s.field}>
              <label style={s.label}>Supporting Documents</label>
              <div style={s.uploadBox}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
                <div style={{ color: '#e6e9f0', fontSize: 14, fontWeight: 600 }}>
                  Drop files here or click to upload
                </div>
                <div style={{ color: '#7b8299', fontSize: 12, marginTop: 4 }}>
                  PDF, JPG, PNG — max 10MB each
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
                  { id: 'basic',    name: 'Basic',    price: 199, desc: 'Quick overview' },
                  { id: 'standard', name: 'Standard', price: 299, desc: 'Detailed report' },
                  { id: 'premium',  name: 'Premium',  price: 499, desc: 'Full investigation' },
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

            {/* Summary */}
            <div style={s.summary}>
              <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 16, fontWeight: 600, color: '#e6e9f0', marginBottom: 12 }}>
                📋 Summary Preview
              </div>
              <SummaryRow label="Property Type" value={PROPERTY_FIELDS[form.propertyType]?.label || '—'} />
              {isAgricultural ? (
                <SummaryRow label="Address" value={form.address || '—'} />
              ) : (
                <>
                  <SummaryRow label="Colony / Apartment" value={form.colonyApartment || '—'} />
                  <SummaryRow label="Flat / House No." value={form.flatHouseNo || '—'} />
                  {form.landmark && <SummaryRow label="Landmark" value={form.landmark} />}
                  <SummaryRow label="Pin Code" value={form.pinCode || '—'} />
                </>
              )}
              <SummaryRow label="City" value={form.city || '—'} />
              <SummaryRow label="Tehsil" value={form.tehsil || '—'} />
              {form.surveyNo && <SummaryRow label="Survey No." value={form.surveyNo} />}
              {form.khasraNo  && <SummaryRow label="Khasra No." value={form.khasraNo} />}
              {!isAgricultural && form.propertyArea && <SummaryRow label="Property Area" value={form.propertyArea} />}
              {!isAgricultural && form.isBuilt && (
                <SummaryRow label="Construction Status" value={form.isBuilt === 'built' ? '🏗️ Bana Hua Hai' : '🟫 Khali Land Hai'} />
              )}
              <SummaryRow label="Case Exists" value={form.caseExists === 'true' ? '⚖️ Yes' : '✅ No'} />
              <SummaryRow label="Price" value={form.price ? `₹${form.price}` : '—'} highlight />
            </div>
          </>
        )}

        {/* Navigation */}
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

// ─── Reusable Components ───
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
      <span style={{ color: highlight ? '#f0a500' : '#e6e9f0', fontSize: 13, fontWeight: highlight ? 700 : 600 }}>
        {value}
      </span>
    </div>
  )
}

const s = {
  headerRow:    { marginBottom: 24 },
  title:        { fontFamily: "'Crimson Pro',serif", fontSize: 26, fontWeight: 600, color: '#e6e9f0' },
  subtitle:     { color: '#7b8299', fontSize: 14, marginTop: 4 },
  stepper:      { display: 'flex', alignItems: 'center', marginBottom: 24, background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: '18px 20px', gap: 8, flexWrap: 'wrap' },
  stepItem:     { display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 200px', minWidth: 0 },
  stepCircle:   { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, transition: 'all .2s' },
  stepLabel:    { fontSize: 13, whiteSpace: 'nowrap' },
  stepLine:     { flex: 1, height: 2, minWidth: 20, transition: 'background .3s' },
  card:         { background: '#111318', border: '1px solid #222736', borderRadius: 12, padding: 24 },
  cardHeader:   { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #222736' },
  cardHdIco:    { width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  cardHdTitle:  { fontFamily: "'Crimson Pro',serif", fontSize: 18, fontWeight: 600, color: '#e6e9f0' },
  cardHdSub:    { fontSize: 12, color: '#7b8299', marginTop: 2 },
  typeGrid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 },
  typeCard:     { border: '2px solid', borderRadius: 10, padding: '16px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s' },
  fieldsSection:   { marginTop: 20, background: '#0d1017', border: '1px solid #222736', borderRadius: 10, padding: 18 },
  fieldsSectionHd: { color: '#f0a500', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 },
  formGrid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  field:        { marginBottom: 16 },
  label:        { display: 'block', fontSize: 12, color: '#7b8299', marginBottom: 7, fontWeight: 600 },
  input:        { width: '100%', background: '#171b23', border: '1px solid #222736', borderRadius: 8, padding: '11px 14px', color: '#e6e9f0', fontSize: 14, fontFamily: "'Sora',sans-serif", outline: 'none', boxSizing: 'border-box' },
  placeholder:  { textAlign: 'center', padding: '36px 20px', border: '2px dashed #222736', borderRadius: 10, marginTop: 16 },
  yesNoGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  yesNoCard:    { border: '2px solid', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all .15s' },
  caseSection:  { background: 'rgba(240,68,68,0.04)', border: '1px solid rgba(240,68,68,0.2)', borderRadius: 10, padding: 16, marginBottom: 16 },
  caseSectionHd:{ color: '#f04444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 },
  uploadBox:    { border: '2px dashed #222736', borderRadius: 10, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: '#171b23' },
  priceGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 },
  priceCard:    { border: '2px solid', borderRadius: 10, padding: 16, cursor: 'pointer', transition: 'all .15s' },
  summary:      { background: '#0a0c10', border: '1px solid #222736', borderRadius: 10, padding: 18, marginTop: 8 },
  summaryRow:   { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222736' },
  navRow:       { display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #222736' },
  primaryBtn:   { background: '#f0a500', color: '#0a0c10', border: 'none', padding: '11px 24px', borderRadius: 9, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", transition: 'opacity .2s' },
  secondaryBtn: { background: 'transparent', color: '#7b8299', border: '1px solid #222736', padding: '11px 20px', borderRadius: 9, fontSize: 14, fontWeight: 600, fontFamily: "'Sora',sans-serif" },
}