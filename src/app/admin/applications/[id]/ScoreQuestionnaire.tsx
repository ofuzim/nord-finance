'use client'

import { useState } from 'react'
import { creditScoreSections, type CreditScoreFormConfig } from '@/lib/creditScoreModel'

function getOptionLabel(formConfig: CreditScoreFormConfig, fieldKey: string, value: number | undefined): { label: string; unmapped: boolean } | null {
  if (value === undefined || value === null) return null
  const field = formConfig.flatMap(section => section.fields).find(item => item.key === fieldKey)
  if (!field) return { label: String(value), unmapped: true }
  const option = field.options.find(o => o.value === value)
  return option ? { label: option.label, unmapped: false } : { label: String(value), unmapped: true }
}

export function ScoreQuestionnaire({
  formResponses,
  formConfig = creditScoreSections,
}: {
  formResponses: Record<string, number>;
  formConfig?: CreditScoreFormConfig;
}) {
  const [open, setOpen] = useState(false)
  const configuredFields = formConfig.flatMap(section => section.fields)
  const configuredKeys = new Set(configuredFields.map(field => field.key))
  const unmappedResponses = Object.entries(formResponses).filter(([key]) => !configuredKeys.has(key))

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Credit Score Inputs
        </span>
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px 24px' }}>
            {configuredFields.map(field => {
              const answer = getOptionLabel(formConfig, field.key, formResponses[field.key])
              return (
                <div key={field.key}>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                    {field.label}
                  </p>
                  <p style={{ color: answer ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.25)', fontSize: 13, lineHeight: 1.5 }}>
                    {answer?.label ?? '—'}
                    {answer?.unmapped && (
                      <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}> · unmapped</span>
                    )}
                  </p>
                </div>
              )
            })}
          </div>

          {unmappedResponses.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <p style={{ color: '#C39529', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
                Unmapped Responses
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px 24px' }}>
                {unmappedResponses.map(([key, value]) => (
                  <div key={key}>
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                      {key}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.5 }}>
                      {value} <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>· unmapped</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
