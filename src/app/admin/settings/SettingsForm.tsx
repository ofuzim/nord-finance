'use client'

import { useMemo, useState } from 'react'
import { updateCreditScoreConfig } from '@/app/actions/admin'
import {
  defaultCreditScoreForm,
  defaultCreditScoreFormula,
  defaultCreditScoreTiers,
  normalizeCreditScoreFormConfig,
  normalizeCreditScoreFormula,
  normalizeCreditScoreTiers,
  type CreditScoreFormConfig,
  type CreditScoreFormField,
  type CreditScoreFormSection,
  type CreditScoreSliderField,
  type CreditScoreSliderKey,
} from '@/lib/creditScoreModel'

const FORMULA_LABELS: Record<string, string> = {
  base_score: 'Base Score',
  multiplier: 'Multiplier',
  income_boost_max: 'Income Boost Max',
  income_boost_divisor: 'Income Boost Divisor',
  down_payment_boost_max: 'Down Payment Boost Max',
  down_payment_boost_divisor: 'Down Payment Divisor',
  obligation_penalty_max: 'Obligation Penalty Max',
  obligation_penalty_divisor: 'Obligation Penalty Divisor',
  min_score: 'Min Score',
  max_score: 'Max Score',
}

type TabKey = 'form' | 'weights' | 'tiers' | 'formula'
type DragState =
  | { type: 'section'; sectionIndex: number }
  | { type: 'field'; sectionIndex: number; fieldIndex: number }
  | null

const tabs: { key: TabKey; label: string }[] = [
  { key: 'form', label: 'Form Builder' },
  { key: 'weights', label: 'Weights' },
  { key: 'tiers', label: 'Tiers' },
  { key: 'formula', label: 'Formula' },
]

function slugify(value: string, fallback: string): string {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return slug || fallback
}

function fieldStyle(width: string | number = '100%'): React.CSSProperties {
  return {
    width,
    backgroundColor: 'rgba(255,255,255,0.055)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '10px 12px',
    color: 'white',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }
}

function SaveButton({ loading, saved, onClick }: { loading: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        backgroundColor: saved ? 'rgba(34,197,94,0.15)' : '#C39529',
        color: saved ? '#22c55e' : '#000',
        border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
        borderRadius: 8,
        padding: '10px 18px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? 'Saving...' : saved ? 'Saved' : 'Save'}
    </button>
  )
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '22px 24px', marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 20 }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{title}</p>
        {action}
      </div>
      {children}
    </div>
  )
}

function SmallButton({ children, onClick, tone = 'neutral' }: { children: React.ReactNode; onClick: () => void; tone?: 'neutral' | 'danger' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: tone === 'danger' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.055)',
        border: `1px solid ${tone === 'danger' ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.1)'}`,
        color: tone === 'danger' ? '#f87171' : 'rgba(255,255,255,0.74)',
        borderRadius: 8,
        padding: '8px 10px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

function reorder<T>(items: T[], from: number, to: number): T[] {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function SettingsForm({ initialConfig }: { initialConfig: Record<string, any> }) {
  const [activeTab, setActiveTab] = useState<TabKey>('form')
  const [formConfig, setFormConfig] = useState<CreditScoreFormConfig>(
    normalizeCreditScoreFormConfig(initialConfig.credit_score_form ?? defaultCreditScoreForm)
  )
  const [weights, setWeights] = useState<Record<string, number>>(initialConfig.section_weights ?? {})
  const [tiers, setTiers] = useState<any[]>(normalizeCreditScoreTiers(initialConfig.score_tiers ?? defaultCreditScoreTiers))
  const [formula, setFormula] = useState<Record<string, number>>(normalizeCreditScoreFormula(initialConfig.score_formula ?? defaultCreditScoreFormula))
  const [dragging, setDragging] = useState<DragState>(null)

  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const weightTotal = Object.values(weights).reduce((a, b) => a + Number(b), 0)
  const weightOk = Math.abs(weightTotal - 1) < 0.001
  const formFieldCount = useMemo(() => formConfig.reduce((sum, section) => sum + section.fields.length, 0), [formConfig])

  const save = async (key: string, value: unknown) => {
    setLoading((current) => ({ ...current, [key]: true }))
    const result = await updateCreditScoreConfig({ configKey: key, configValue: value })
    setLoading((current) => ({ ...current, [key]: false }))
    if ('error' in result) {
      alert(result.error)
      return
    }
    setSaved((current) => ({ ...current, [key]: true }))
    setTimeout(() => setSaved((current) => ({ ...current, [key]: false })), 2500)
  }

  const updateSection = (sectionIndex: number, patch: Partial<CreditScoreFormSection>) => {
    setFormConfig((current) => current.map((section, index) => index === sectionIndex ? { ...section, ...patch } : section))
  }

  const updateField = (sectionIndex: number, fieldIndex: number, patch: Partial<CreditScoreFormField>) => {
    setFormConfig((current) => current.map((section, index) => {
      if (index !== sectionIndex) return section
      return {
        ...section,
        fields: section.fields.map((field, innerIndex) => innerIndex === fieldIndex ? { ...field, ...patch } : field),
      }
    }))
  }

  const updateSlider = (sectionIndex: number, sliderIndex: number, patch: Partial<CreditScoreSliderField>) => {
    setFormConfig((current) => current.map((section, index) => {
      if (index !== sectionIndex) return section
      return {
        ...section,
        sliders: (section.sliders ?? []).map((slider, innerIndex) => innerIndex === sliderIndex ? { ...slider, ...patch } : slider),
      }
    }))
  }

  const addSection = () => {
    const nextNumber = formConfig.length + 1
    setFormConfig((current) => [
      ...current,
      { id: `section_${Date.now()}`, title: `New Section ${nextNumber}`, weight: '0%', fields: [] },
    ])
  }

  const addField = (sectionIndex: number) => {
    setFormConfig((current) => current.map((section, index) => {
      if (index !== sectionIndex) return section
      const nextNumber = section.fields.length + 1
      return {
        ...section,
        fields: [
          ...section.fields,
          {
            key: `question_${Date.now()}`,
            label: `New Question ${nextNumber}`,
            options: [
              { label: 'Best answer', value: 100 },
              { label: 'Average answer', value: 60 },
            ],
          },
        ],
      }
    }))
  }

  const addSlider = (sectionIndex: number) => {
    setFormConfig((current) => current.map((section, index) => {
      if (index !== sectionIndex) return section
      const usedKeys = new Set((section.sliders ?? []).map((slider) => slider.key))
      const key = (['monthlyIncome', 'obligations', 'downPayment'] as CreditScoreSliderKey[]).find((item) => !usedKeys.has(item)) ?? 'monthlyIncome'
      return {
        ...section,
        sliders: [
          ...(section.sliders ?? []),
          {
            key,
            label: key === 'monthlyIncome' ? 'Monthly Net Income (₦)' : key === 'obligations' ? 'Existing Monthly Obligations (₦)' : 'Down Payment Percentage',
            min: 0,
            max: key === 'obligations' ? 5000000 : key === 'monthlyIncome' ? 100000000 : 70,
            step: key === 'obligations' ? 100000 : key === 'monthlyIncome' ? 250000 : 5,
            defaultValue: key === 'downPayment' ? 30 : 0,
            minLabel: key === 'downPayment' ? '0%' : '₦0',
            maxLabel: key === 'obligations' ? '₦5M+' : key === 'monthlyIncome' ? '₦100M+' : '70%+',
            format: key === 'downPayment' ? 'percent' : 'currency',
          },
        ],
      }
    }))
  }

  const dropSection = (targetIndex: number) => {
    if (!dragging || dragging.type !== 'section' || dragging.sectionIndex === targetIndex) return
    setFormConfig((current) => reorder(current, dragging.sectionIndex, targetIndex))
    setDragging(null)
  }

  const dropField = (targetSectionIndex: number, targetFieldIndex: number) => {
    if (!dragging || dragging.type !== 'field') return
    setFormConfig((current) => {
      const next = current.map((section) => ({ ...section, fields: [...section.fields] }))
      const [field] = next[dragging.sectionIndex].fields.splice(dragging.fieldIndex, 1)
      next[targetSectionIndex].fields.splice(targetFieldIndex, 0, field)
      return next
    })
    setDragging(null)
  }

  return (
    <>
      <div style={{ display: 'inline-flex', padding: 4, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, marginBottom: 22, gap: 4 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              backgroundColor: activeTab === tab.key ? '#C39529' : 'transparent',
              color: activeTab === tab.key ? '#000' : 'rgba(255,255,255,0.62)',
              border: 'none',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'form' && (
        <Section
          title={`Form Builder · ${formConfig.length} Sections · ${formFieldCount} Questions`}
          action={<SaveButton loading={!!loading.credit_score_form} saved={!!saved.credit_score_form} onClick={() => save('credit_score_form', normalizeCreditScoreFormConfig(formConfig))} />}
        >
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12, lineHeight: 1.7, marginBottom: 18 }}>
            Drag section or question handles to reorder. The saved value is what lands in <span style={{ color: '#C39529' }}>credit_scores.form_responses</span>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {formConfig.map((section, sectionIndex) => (
              <div
                key={section.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dropSection(sectionIndex)}
                style={{ border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: 16, backgroundColor: 'rgba(0,0,0,0.22)' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '34px minmax(160px, 1fr) 90px auto', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                  <button
                    type="button"
                    draggable
                    onDragStart={() => setDragging({ type: 'section', sectionIndex })}
                    onDragEnd={() => setDragging(null)}
                    title="Drag section"
                    style={{ ...fieldStyle(34), padding: 0, cursor: 'grab', color: '#C39529' }}
                  >
                    ::
                  </button>
                  <input
                    value={section.title}
                    onChange={(event) => updateSection(sectionIndex, { title: event.target.value, id: slugify(event.target.value, section.id) })}
                    style={fieldStyle()}
                  />
                  <input
                    value={section.weight}
                    onChange={(event) => updateSection(sectionIndex, { weight: event.target.value })}
                    style={fieldStyle()}
                    aria-label="Section weight"
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <SmallButton onClick={() => addSlider(sectionIndex)}>Add Slider</SmallButton>
                    <SmallButton onClick={() => addField(sectionIndex)}>Add Question</SmallButton>
                    <SmallButton tone="danger" onClick={() => setFormConfig((current) => current.filter((_, index) => index !== sectionIndex))}>Remove</SmallButton>
                  </div>
                </div>

                {(section.sliders ?? []).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                    {(section.sliders ?? []).map((slider, sliderIndex) => (
                      <div key={`${section.id}-${slider.key}-${sliderIndex}`} style={{ backgroundColor: 'rgba(195,149,41,0.055)', border: '1px solid rgba(195,149,41,0.16)', borderRadius: 8, padding: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '160px minmax(170px, 1fr) 110px 110px 110px 120px auto', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                          <select
                            value={slider.key}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { key: event.target.value as CreditScoreSliderKey })}
                            style={fieldStyle()}
                            aria-label="Slider DB field"
                          >
                            <option value="monthlyIncome">monthlyIncome</option>
                            <option value="obligations">obligations</option>
                            <option value="downPayment">downPayment</option>
                          </select>
                          <input
                            value={slider.label}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { label: event.target.value })}
                            style={fieldStyle()}
                            aria-label="Slider label"
                          />
                          <input
                            type="number"
                            value={slider.min}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { min: Number(event.target.value) })}
                            style={fieldStyle()}
                            aria-label="Slider min"
                          />
                          <input
                            type="number"
                            value={slider.max}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { max: Number(event.target.value) })}
                            style={fieldStyle()}
                            aria-label="Slider max"
                          />
                          <input
                            type="number"
                            value={slider.step}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { step: Number(event.target.value) })}
                            style={fieldStyle()}
                            aria-label="Slider step"
                          />
                          <input
                            type="number"
                            value={slider.defaultValue}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { defaultValue: Number(event.target.value) })}
                            style={fieldStyle()}
                            aria-label="Slider default"
                          />
                          <SmallButton tone="danger" onClick={() => updateSection(sectionIndex, { sliders: (section.sliders ?? []).filter((_, index) => index !== sliderIndex) })}>Remove</SmallButton>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: 8, alignItems: 'center' }}>
                          <input
                            value={slider.minLabel}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { minLabel: event.target.value })}
                            style={fieldStyle()}
                            aria-label="Slider min label"
                            placeholder="Min label"
                          />
                          <input
                            value={slider.maxLabel}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { maxLabel: event.target.value })}
                            style={fieldStyle()}
                            aria-label="Slider max label"
                            placeholder="Max label"
                          />
                          <select
                            value={slider.format}
                            onChange={(event) => updateSlider(sectionIndex, sliderIndex, { format: event.target.value as CreditScoreSliderField['format'] })}
                            style={fieldStyle()}
                            aria-label="Slider display format"
                          >
                            <option value="currency">Currency</option>
                            <option value="percent">Percent</option>
                            <option value="number">Number</option>
                          </select>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.34)', fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>
                          Saves to <span style={{ fontFamily: 'monospace', color: '#C39529' }}>credit_scores.{slider.key === 'monthlyIncome' ? 'monthly_income' : slider.key === 'obligations' ? 'monthly_obligations' : 'down_payment_percentage'}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {section.fields.map((field, fieldIndex) => (
                    <div
                      key={field.key}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.stopPropagation()
                        dropField(sectionIndex, fieldIndex)
                      }}
                      style={{ backgroundColor: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.075)', borderRadius: 8, padding: 14 }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '34px minmax(170px, 1fr) minmax(140px, 220px) auto', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                        <button
                          type="button"
                          draggable
                          onDragStart={(event) => {
                            event.stopPropagation()
                            setDragging({ type: 'field', sectionIndex, fieldIndex })
                          }}
                          onDragEnd={() => setDragging(null)}
                          title="Drag question"
                          style={{ ...fieldStyle(34), padding: 0, cursor: 'grab', color: '#C39529' }}
                        >
                          ::
                        </button>
                        <input
                          value={field.label}
                          onChange={(event) => updateField(sectionIndex, fieldIndex, { label: event.target.value })}
                          style={fieldStyle()}
                          aria-label="Question label"
                        />
                        <input
                          value={field.key}
                          onChange={(event) => updateField(sectionIndex, fieldIndex, { key: slugify(event.target.value, field.key) })}
                          style={{ ...fieldStyle(), fontFamily: 'monospace', color: '#C39529' }}
                          aria-label="Saved field key"
                        />
                        <SmallButton tone="danger" onClick={() => updateSection(sectionIndex, { fields: section.fields.filter((_, index) => index !== fieldIndex) })}>Remove</SmallButton>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px auto', gap: 8, alignItems: 'center' }}>
                        {field.options.map((option, optionIndex) => (
                          <div key={`${field.key}-${optionIndex}`} style={{ display: 'contents' }}>
                            <input
                              value={option.label}
                              onChange={(event) => {
                                const options = field.options.map((item, index) => index === optionIndex ? { ...item, label: event.target.value } : item)
                                updateField(sectionIndex, fieldIndex, { options })
                              }}
                              style={fieldStyle()}
                              aria-label="Answer label"
                            />
                            <input
                              type="number"
                              value={option.value}
                              onChange={(event) => {
                                const options = field.options.map((item, index) => index === optionIndex ? { ...item, value: Number(event.target.value) } : item)
                                updateField(sectionIndex, fieldIndex, { options })
                              }}
                              style={fieldStyle()}
                              aria-label="Answer value"
                            />
                            <SmallButton tone="danger" onClick={() => updateField(sectionIndex, fieldIndex, { options: field.options.filter((_, index) => index !== optionIndex) })}>Remove</SmallButton>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 12 }}>
                        <SmallButton onClick={() => updateField(sectionIndex, fieldIndex, { options: [...field.options, { label: 'New answer', value: 50 }] })}>Add Answer</SmallButton>
                        <p style={{ color: 'rgba(255,255,255,0.34)', fontSize: 12, lineHeight: 1.5 }}>
                          Preview: <span style={{ color: 'rgba(255,255,255,0.78)' }}>{field.label || 'Question'}</span>
                          {' -> '}
                          <span style={{ color: '#C39529' }}>{field.options[0]?.label ?? 'No answer'}</span>
                          {' saves '}
                          <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.72)' }}>{field.options[0]?.value ?? '--'}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
            <SmallButton onClick={addSection}>Add Section</SmallButton>
            <SaveButton loading={!!loading.credit_score_form} saved={!!saved.credit_score_form} onClick={() => save('credit_score_form', normalizeCreditScoreFormConfig(formConfig))} />
          </div>
        </Section>
      )}

      {activeTab === 'weights' && (
        <Section title="Section Weights" action={<SaveButton loading={!!loading.section_weights} saved={!!saved.section_weights} onClick={() => !weightOk ? alert('Weights must sum to 1.0') : save('section_weights', weights)} />}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 20 }}>
            All weights must sum to 1.0. Current total: <span style={{ color: weightOk ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{weightTotal.toFixed(2)}</span>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {Object.entries(weights).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{key.replace(/_/g, ' ')}</label>
                  <span style={{ color: '#C39529', fontSize: 12, fontWeight: 600 }}>{(Number(val) * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0} max={0.5} step={0.05}
                  value={Number(val)}
                  onChange={e => setWeights(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#C39529' }}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeTab === 'tiers' && (
        <Section title="Score Tiers" action={<SaveButton loading={!!loading.score_tiers} saved={!!saved.score_tiers} onClick={() => save('score_tiers', tiers)} />}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Name', 'Label', 'Min Score', 'Interest %', 'Tenor (mo)', 'Down Payment %'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier, i) => (
                  <tr key={tier.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {(['name', 'label', 'min_score', 'interest_rate', 'max_tenor_months', 'min_down_payment'] as const).map(field => (
                      <td key={field} style={{ padding: '10px' }}>
                        <input
                          type={field === 'name' || field === 'label' ? 'text' : 'number'}
                          value={tier[field]}
                          onChange={e => setTiers(prev => prev.map((t, j) => j === i ? { ...t, [field]: field === 'name' || field === 'label' ? e.target.value : parseFloat(e.target.value) } : t))}
                          style={fieldStyle(field === 'name' || field === 'label' ? 150 : 100)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {activeTab === 'formula' && (
        <Section title="Formula Parameters" action={<SaveButton loading={!!loading.score_formula} saved={!!saved.score_formula} onClick={() => save('score_formula', formula)} />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            {Object.entries(formula).map(([key, val]) => (
              <div key={key}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {FORMULA_LABELS[key] ?? key}
                </label>
                <input
                  type="number"
                  value={Number(val)}
                  step="any"
                  onChange={e => setFormula(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                  style={fieldStyle()}
                />
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
