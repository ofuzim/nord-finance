'use client'

import React, { useMemo, useRef, useState } from 'react'
import { updateCreditScoreConfig } from '@/app/actions/admin'
import { defaultKycConfig, getKycGroupItems, kycFieldGroups, normalizeKycConfig, type KycConfig, type KycFieldItem } from '@/lib/kycConfig'
import {
  defaultCreditScoreForm,
  defaultCreditScoreFormula,
  defaultCreditScoreTiers,
  normalizeCreditScoreFormConfig,
  normalizeCreditScoreFormula,
  normalizeCreditScoreTiers,
  getSectionFields,
  getSectionSliders,
  type CreditScoreFormConfig,
  type CreditScoreFormField,
  type CreditScoreFormItem,
  type CreditScoreFormSection,
  type CreditScoreSliderField,
  type CreditScoreSliderKey,
} from '@/lib/creditScoreModel'

// ─── Constants ──────────────────────────────────────────────────────────────

const FORMULA_LABELS: Record<string, string> = {
  base_score: 'Base Score',
  multiplier: 'Multiplier',
  min_score: 'Min Score',
  max_score: 'Max Score',
}

const PALETTE_DRAG_KEY = 'nord-palette-type'

type TabKey = 'form' | 'tiers' | 'formula' | 'kyc'

type DragState =
  | { type: 'section'; sectionIndex: number }
  | { type: 'item'; sectionIndex: number; itemIndex: number }
  | null

type DropIndicator =
  | { kind: 'section'; insertBefore: number }
  | { kind: 'item'; sectionIndex: number; insertBefore: number }
  | null

type KycDragState = { groupIndex: number; itemIndex: number } | null
type KycDropIndicator = { groupIndex: number; insertBefore: number } | null

type PendingLeaveAction = 'back' | 'reload'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'form', label: 'Score' },
  { key: 'tiers', label: 'Tiers' },
  { key: 'formula', label: 'Params' },
  { key: 'kyc', label: 'KYC' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(value: string, fallback: string): string {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return slug || fallback
}

function scoreColor(value: number): string {
  if (value >= 80) return '#22c55e'
  if (value >= 50) return '#C39529'
  return '#ef4444'
}

function reorder<T>(items: T[], from: number, to: number): T[] {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

// ─── Drop line indicator ──────────────────────────────────────────────────────

function SectionGhost({ section }: { section: CreditScoreFormSection }) {
  return (
    <div style={{ border: '1.5px dashed rgba(195,149,41,0.5)', borderRadius: 10, backgroundColor: 'rgba(195,149,41,0.06)', opacity: 0.6, pointerEvents: 'none', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,0.2)">
        {[0, 6, 12].map((y) => [0, 5].map((x) => <circle key={`${x}-${y}`} cx={x + 2} cy={y + 2} r="1.5" />))}
      </svg>
      <span style={{ flex: 1, color: section.title ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {section.title || 'Untitled section'}
      </span>
      <span style={{ fontSize: 11, color: '#C39529', backgroundColor: 'rgba(195,149,41,0.12)', padding: '2px 8px', borderRadius: 4 }}>{section.weight}</span>
    </div>
  )
}

function ItemGhost({ item }: { item: CreditScoreFormItem }) {
  if (item.itemType === 'slider') {
    return (
      <div style={{ border: '1.5px dashed rgba(195,149,41,0.45)', borderRadius: 8, backgroundColor: 'rgba(195,149,41,0.05)', opacity: 0.6, pointerEvents: 'none', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,0.15)">
          {[0, 6, 12].map((y) => [0, 5].map((x) => <circle key={`${x}-${y}`} cx={x + 2} cy={y + 2} r="1.5" />))}
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0 }}><line x1="1" y1="5" x2="13" y2="5" stroke="rgba(195,149,41,0.5)" strokeWidth="1.5" strokeLinecap="round" /><circle cx="9" cy="5" r="2.5" fill="rgba(195,149,41,0.5)" /></svg>
        <span style={{ color: 'rgba(195,149,41,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>Slider</span>
        <span style={{ flex: 1, color: 'rgba(255,255,255,0.45)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label || item.key}</span>
      </div>
    )
  }
  return (
    <div style={{ border: '1.5px dashed rgba(255,255,255,0.18)', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', opacity: 0.6, pointerEvents: 'none', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,0.15)">
        {[0, 6, 12].map((y) => [0, 5].map((x) => <circle key={`${x}-${y}`} cx={x + 2} cy={y + 2} r="1.5" />))}
      </svg>
      <span style={{ flex: 1, fontSize: 13, color: item.label ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.label || 'Untitled question'}
      </span>
    </div>
  )
}

function KycFieldGhost({ item }: { item: KycFieldItem }) {
  const [key, label] = item
  return (
    <div style={{ border: '1.5px dashed rgba(195,149,41,0.45)', borderRadius: 8, backgroundColor: 'rgba(195,149,41,0.05)', opacity: 0.65, pointerEvents: 'none', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,0.15)">
        {[0, 6, 12].map((y) => [0, 5].map((x) => <circle key={`${x}-${y}`} cx={x + 2} cy={y + 2} r="1.5" />))}
      </svg>
      <span style={{ flex: 1, color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.24)', fontSize: 10, fontFamily: 'monospace' }}>{key}</span>
    </div>
  )
}

function paletteGhostItem(type: string): CreditScoreFormItem {
  if (type === 'slider') return { itemType: 'slider', key: 'monthlyIncome', label: 'New Slider', min: 0, max: 100, step: 1, defaultValue: 0, scoreImpact: 46, minLabel: '', maxLabel: '', format: 'currency' }
  return { itemType: 'field', key: '__new__', label: type === 'radio' ? 'New Radio Pills Question' : 'New Dropdown Question', type: type === 'radio' ? 'radio' : 'select', options: [] }
}

function itemPreviewSlot(sectionIndex: number, insertBefore: number, dragging: DragState): number {
  if (dragging?.type === 'item' && dragging.sectionIndex === sectionIndex && insertBefore > dragging.itemIndex) {
    return insertBefore + 1
  }
  return insertBefore
}

function kycPreviewSlot(groupIndex: number, insertBefore: number, dragging: KycDragState): number {
  if (dragging && dragging.groupIndex === groupIndex && insertBefore > dragging.itemIndex) {
    return insertBefore + 1
  }
  return insertBefore
}

function configSnapshot(value: unknown): string {
  return JSON.stringify(value)
}

// ─── Primitive UI helpers ────────────────────────────────────────────────────

function inp(width: string | number = '100%'): React.CSSProperties {
  return {
    width,
    backgroundColor: 'rgba(255,255,255,0.055)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    padding: '9px 12px',
    color: 'white',
    fontFamily: "'Poppins', sans-serif",
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  }
}

function sel(width: string | number = '100%'): React.CSSProperties {
  return {
    ...inp(width),
    appearance: 'none',
    cursor: 'pointer',
    paddingRight: 32,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%23C39529' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 11px center',
  }
}

function DragHandle({ onDragStart, onDragEnd, ghostRef }: { onDragStart: () => void; onDragEnd: () => void; ghostRef?: React.RefObject<HTMLElement | null> }) {
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        if (ghostRef?.current) {
          const el = ghostRef.current
          const rect = el.getBoundingClientRect()
          e.dataTransfer.setDragImage(el, e.clientX - rect.left, e.clientY - rect.top)
        }
        e.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      title="Drag to reorder"
      style={{ background: 'none', border: 'none', padding: '4px 5px', cursor: 'grab', color: 'rgba(255,255,255,0.28)', flexShrink: 0, lineHeight: 0 }}
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
        {[0, 6, 12].map((y) => (
          [0, 5].map((x) => <circle key={`${x}-${y}`} cx={x + 2} cy={y + 2} r="1.5" />)
        ))}
      </svg>
    </button>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
      style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <path d="M2.5 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Badge({ children, color = 'rgba(255,255,255,0.1)', text = 'rgba(255,255,255,0.45)' }: { children: React.ReactNode; color?: string; text?: string }) {
  return (
    <span style={{ backgroundColor: color, color: text, borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function IconBtn({ onClick, tone = 'neutral', title, children }: { onClick: () => void; tone?: 'neutral' | 'danger' | 'add'; title?: string; children: React.ReactNode }) {
  const c = { neutral: { bg: 'rgba(255,255,255,0.055)', border: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }, danger: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', color: '#f87171' }, add: { bg: 'rgba(195,149,41,0.1)', border: 'rgba(195,149,41,0.25)', color: '#C39529' } }[tone]
  return (
    <button type="button" onClick={onClick} title={title} style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, borderRadius: 6, padding: '7px 11px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
      {children}
    </button>
  )
}

function SaveButton({ loading, saved, onClick, label = 'Save Changes' }: { loading: boolean; saved: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} style={{ backgroundColor: saved ? 'rgba(34,197,94,0.15)' : '#C39529', color: saved ? '#22c55e' : '#000', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', borderRadius: 8, padding: '10px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
      {loading && <span style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', display: 'inline-block', animation: 'settings-spin 0.75s linear infinite' }} />}
      {saved && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2 6.5 5 9.5 10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {loading ? 'Saving…' : saved ? 'Saved' : label}
    </button>
  )
}

// ─── Palette sidebar ─────────────────────────────────────────────────────────

const PALETTE_ITEMS = [
  {
    type: 'question',
    label: 'Dropdown Select',
    description: 'Scrollable dropdown with scored answer options',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="2" y="4" width="16" height="4" rx="2" />
        <rect x="2" y="11" width="16" height="4" rx="2" opacity="0.4" />
      </svg>
    ),
  },
  {
    type: 'radio',
    label: 'Radio Pills',
    description: 'Inline clickable pill buttons — ideal for short option lists like gender or yes/no',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="2" y="6" width="7" height="8" rx="4" fill="currentColor" opacity="0.5" stroke="none" />
        <rect x="11" y="6" width="7" height="8" rx="4" />
      </svg>
    ),
  },
  {
    type: 'slider',
    label: 'Numeric Slider',
    description: 'Range slider for monetary or percentage inputs like income',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="2" y1="10" x2="18" y2="10" />
        <circle cx="12" cy="10" r="3" fill="currentColor" stroke="none" opacity="0.7" />
      </svg>
    ),
  },
] as const

function PaletteSidebar({ onDragStart, onDragEnd }: { onDragStart: (type: string) => void; onDragEnd: () => void }) {
  const [draggingType, setDraggingType] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const ghostRefs = useRef<Record<string, HTMLDivElement | null>>({})

  React.useEffect(() => {
    if (!dragActive) return
    const style = document.createElement('style')
    style.textContent = '*, *::before, *::after { cursor: grabbing !important; }'
    document.head.appendChild(style)
    return () => { style.remove() }
  }, [dragActive])

  // Off-screen ghost previews that look like the actual cards
  const dots = (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,0.2)">
      {[0, 6, 12].map((y) => [0, 5].map((x) => <circle key={`${x}-${y}`} cx={x + 2} cy={y + 2} r="1.5" />))}
    </svg>
  )
  const cardBase: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, width: 420 }

  return (
    <div style={{ width: '100%' }}>
      {/* Ghost elements used as drag images — rendered off-screen */}
      <div style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div ref={(el) => { ghostRefs.current['question'] = el }}
          style={{ ...cardBase, backgroundColor: 'rgba(20,20,28,0.98)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {dots}
          <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>New Dropdown Question</span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>dropdown</span>
        </div>
        <div ref={(el) => { ghostRefs.current['radio'] = el }}
          style={{ ...cardBase, backgroundColor: 'rgba(20,20,28,0.98)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {dots}
          <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>New Radio Pills Question</span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>radio</span>
        </div>
        <div ref={(el) => { ghostRefs.current['slider'] = el }}
          style={{ ...cardBase, backgroundColor: 'rgba(20,20,28,0.98)', border: '1px solid rgba(195,149,41,0.14)' }}>
          {dots}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0 }}><line x1="1" y1="5" x2="13" y2="5" stroke="#C39529" strokeWidth="1.5" strokeLinecap="round" /><circle cx="9" cy="5" r="2.5" fill="#C39529" /></svg>
          <span style={{ color: '#C39529', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>Slider</span>
          <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>New Slider</span>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        Field Types
      </p>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, lineHeight: 1.6, marginBottom: 16 }}>
        Drag a field type and drop it onto any section to add it.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PALETTE_ITEMS.map((item) => {
          const isBeingDragged = draggingType === item.type && dragActive
          return (
            <div key={item.type} style={isBeingDragged ? { height: 0, overflow: 'hidden', pointerEvents: 'none' } : undefined}>
              <div
                ref={(el) => { itemRefs.current[item.type] = el }}
                draggable
                onDragStart={(e) => {
                  const ghost = ghostRefs.current[item.type]
                  if (ghost) e.dataTransfer.setDragImage(ghost, 20, ghost.offsetHeight / 2)
                  e.dataTransfer.setData(PALETTE_DRAG_KEY, item.type)
                  e.dataTransfer.effectAllowed = 'copy'
                  setDraggingType(item.type)
                  onDragStart(item.type)
                  requestAnimationFrame(() => setDragActive(true))
                }}
                onDragEnd={() => { setDraggingType(null); setDragActive(false); onDragEnd() }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  cursor: 'grab',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{ color: '#C39529', opacity: 0.85 }}>{item.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: 12, fontWeight: 600 }}>{item.label}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, lineHeight: 1.5, margin: 0 }}>{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 18, padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: 8 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, lineHeight: 1.6 }}>
          Drop onto any section to append, or drag between existing questions to reorder.
        </p>
      </div>
    </div>
  )
}

// ─── Option row ───────────────────────────────────────────────────────────────

function OptionRow({ option, index, total, onChange, onRemove }: { option: { label: string; value: number }; index: number; total: number; onChange: (p: Partial<typeof option>) => void; onRemove: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, width: 14, flexShrink: 0, textAlign: 'right' }}>{index + 1}</span>
      <input value={option.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Answer label" style={{ ...inp(), flex: 1 }} aria-label="Answer label" />
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <input type="number" value={option.value} onChange={(e) => onChange({ value: Number(e.target.value) })} style={{ ...inp(90), paddingRight: 26 }} aria-label="Score value" />
        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, borderRadius: '50%', backgroundColor: scoreColor(option.value), pointerEvents: 'none' }} />
      </div>
      {total > 1 && (
        <button type="button" onClick={onRemove} title="Remove answer" style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.5)', cursor: 'pointer', padding: 4, flexShrink: 0, lineHeight: 0 }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><line x1="2" y1="2" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="11" y1="2" x2="2" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  )
}

// ─── Question card ────────────────────────────────────────────────────────────

function QuestionCard({ field, sectionIndex, itemIndex, dragging, dragActive, onDragStart, onDragEnd, onDragOver, onDrop, onUpdate, onRemove }: { field: CreditScoreFormField; sectionIndex: number; itemIndex: number; dragging: DragState; dragActive: boolean; onDragStart: () => void; onDragEnd: () => void; onDragOver: (e: React.DragEvent) => void; onDrop: (e: React.DragEvent) => void; onUpdate: (p: Partial<CreditScoreFormField>) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isDraggingThis = dragging?.type === 'item' && dragging.sectionIndex === sectionIndex && dragging.itemIndex === itemIndex
  const fieldType = field.type ?? 'select'
  const scoreRange = field.options.length ? `${Math.min(...field.options.map((o) => o.value))}–${Math.max(...field.options.map((o) => o.value))}` : '–'

  return (
    <div ref={cardRef} onDragOver={onDragOver} onDrop={onDrop} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, opacity: isDraggingThis && dragActive ? 0.15 : 1, transition: 'opacity 0.1s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => setOpen((v) => !v)}>
        <span onClick={(e) => e.stopPropagation()}>
          <DragHandle onDragStart={onDragStart} onDragEnd={onDragEnd} ghostRef={cardRef} />
        </span>
        <span style={{ flex: 1, fontSize: 13, color: field.label ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {field.label || 'Untitled question'}
        </span>
        <Badge color={fieldType === 'radio' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.07)'} text={fieldType === 'radio' ? '#a5b4fc' : 'rgba(255,255,255,0.4)'}>
          {fieldType === 'radio' ? 'Radio pills' : 'Dropdown'}
        </Badge>
        <Badge>{field.options.length} answers</Badge>
        <Badge color="rgba(195,149,41,0.1)" text="#C39529">{scoreRange}</Badge>
        <span style={{ color: 'rgba(255,255,255,0.28)', display: 'flex' }}><Chevron open={open} /></span>
      </div>

      {open && (
        <div style={{ padding: '0 12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 10, margin: '12px 0 14px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Question label</p>
              <input value={field.label} onChange={(e) => onUpdate({ label: e.target.value })} style={inp()} placeholder="e.g. Employment stability" aria-label="Question label" />
            </div>
            <div style={{ width: 160 }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Field key</p>
              <input value={field.key} onChange={(e) => onUpdate({ key: slugify(e.target.value, field.key) })} style={{ ...inp(), fontFamily: 'monospace', color: '#C39529', fontSize: 12 }} aria-label="Saved field key" />
            </div>
            <div style={{ flexShrink: 0 }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Display as</p>
              <div style={{ display: 'flex', gap: 4, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: 3 }}>
                {(['select', 'radio'] as const).map((t) => (
                  <button key={t} type="button" onClick={(e) => { e.stopPropagation(); onUpdate({ type: t }) }} style={{ background: fieldType === t ? (t === 'radio' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.1)') : 'transparent', color: fieldType === t ? (t === 'radio' ? '#a5b4fc' : 'white') : 'rgba(255,255,255,0.35)', border: 'none', borderRadius: 5, padding: '5px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {t === 'select' ? 'Dropdown' : 'Radio pills'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ width: 14 }} />
            <p style={{ flex: 1, color: 'rgba(255,255,255,0.28)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Answer label</p>
            <p style={{ width: 90, color: 'rgba(255,255,255,0.28)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Score value</p>
            <span style={{ width: 22 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {field.options.map((option, optionIndex) => (
              <OptionRow key={`${field.key}-${optionIndex}`} option={option} index={optionIndex} total={field.options.length}
                onChange={(p) => onUpdate({ options: field.options.map((item, i) => i === optionIndex ? { ...item, ...p } : item) })}
                onRemove={() => onUpdate({ options: field.options.filter((_, i) => i !== optionIndex) })}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <IconBtn tone="add" onClick={() => onUpdate({ options: [...field.options, { label: 'New answer', value: 50 }] })}>+ Add answer</IconBtn>
            <IconBtn tone="danger" onClick={onRemove}>Remove question</IconBtn>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Slider card ──────────────────────────────────────────────────────────────

function SliderCard({ slider, sectionIndex, itemIndex, dragging, dragActive, onDragStart, onDragEnd, onDragOver, onDrop, onUpdate, onRemove }: { slider: CreditScoreSliderField; sectionIndex: number; itemIndex: number; dragging: DragState; dragActive: boolean; onDragStart: () => void; onDragEnd: () => void; onDragOver: (e: React.DragEvent) => void; onDrop: (e: React.DragEvent) => void; onUpdate: (p: Partial<CreditScoreSliderField>) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isDraggingThis = dragging?.type === 'item' && dragging.sectionIndex === sectionIndex && dragging.itemIndex === itemIndex
  const dbCol = slider.key === 'monthlyIncome' ? 'monthly_income' : slider.key === 'obligations' ? 'monthly_obligations' : 'down_payment_percentage'
  return (
    <div ref={cardRef} onDragOver={onDragOver} onDrop={onDrop} style={{ backgroundColor: 'rgba(195,149,41,0.06)', border: '1px solid rgba(195,149,41,0.14)', borderRadius: 8, opacity: isDraggingThis && dragActive ? 0.15 : 1, transition: 'opacity 0.1s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => setOpen((v) => !v)}>
        <span onClick={(e) => e.stopPropagation()}>
          <DragHandle onDragStart={onDragStart} onDragEnd={onDragEnd} ghostRef={cardRef} />
        </span>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0 }}><line x1="1" y1="5" x2="13" y2="5" stroke="#C39529" strokeWidth="1.5" strokeLinecap="round" /><circle cx="9" cy="5" r="2.5" fill="#C39529" /></svg>
        <span style={{ color: '#C39529', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>Slider</span>
        <span style={{ flex: 1, fontFamily: 'monospace', color: slider.label ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {slider.label || dbCol}
        </span>
        <Badge color="rgba(195,149,41,0.1)" text="rgba(195,149,41,0.6)">{dbCol}</Badge>
        <span style={{ color: 'rgba(255,255,255,0.28)', display: 'flex' }}><Chevron open={open} /></span>
      </div>

      {open && <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(195,149,41,0.1)' }}><div style={{ paddingTop: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Slider type</p>
          <select value={slider.key} onChange={(e) => onUpdate({ key: e.target.value as CreditScoreSliderKey })} style={{ ...sel(), fontFamily: 'monospace', fontSize: 12, color: '#C39529' }}>
            <option value="monthlyIncome">monthlyIncome</option>
            <option value="obligations">obligations</option>
            <option value="downPayment">downPayment</option>
          </select>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Display label</p>
          <input value={slider.label} onChange={(e) => onUpdate({ label: e.target.value })} style={inp()} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
        {([['Min value', 'min', slider.min], ['Max value', 'max', slider.max]] as [string, keyof CreditScoreSliderField, number][]).map(([label, field, value]) => (
          <div key={field}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
            <input type="number" value={value} onChange={(e) => onUpdate({ [field]: Number(e.target.value) })} style={inp()} aria-label={label} />
          </div>
        ))}
        <div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Min label</p>
          <input value={slider.minLabel} onChange={(e) => onUpdate({ minLabel: e.target.value })} style={inp()} placeholder="e.g. ₦0" />
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Max label</p>
          <input value={slider.maxLabel} onChange={(e) => onUpdate({ maxLabel: e.target.value })} style={inp()} placeholder="e.g. ₦100M+" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {([['Step', 'step', slider.step], ['Default', 'defaultValue', slider.defaultValue]] as [string, keyof CreditScoreSliderField, number][]).map(([label, field, value]) => (
          <div key={field}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
            <input type="number" value={value} onChange={(e) => onUpdate({ [field]: Number(e.target.value) })} style={inp()} aria-label={label} />
          </div>
        ))}
        <div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Format</p>
          <select value={slider.format} onChange={(e) => onUpdate({ format: e.target.value as CreditScoreSliderField['format'] })} style={sel()}>
            <option value="currency">Currency</option>
            <option value="percent">Percent</option>
            <option value="number">Number</option>
          </select>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Score value</p>
          <input type="number" value={slider.scoreImpact} onChange={(e) => onUpdate({ scoreImpact: Number(e.target.value) })} style={inp()} aria-label="Score value" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
        <IconBtn tone="danger" onClick={onRemove}>Remove slider</IconBtn>
      </div>
    </div></div>}
    </div>
  )
}

function KycFieldRow({ item, groupIndex, itemIndex, required, dragging, dragActive, onDragStart, onDragEnd, onToggle }: {
  item: KycFieldItem
  groupIndex: number
  itemIndex: number
  required: boolean
  dragging: KycDragState
  dragActive: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onToggle: () => void
}) {
  const [key, label] = item
  const rowRef = useRef<HTMLDivElement>(null)
  const isDraggingThis = dragging?.groupIndex === groupIndex && dragging.itemIndex === itemIndex

  return (
    <div
      ref={rowRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        opacity: isDraggingThis && dragActive ? 0.15 : 1,
        transition: 'opacity 0.1s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <DragHandle onDragStart={onDragStart} onDragEnd={onDragEnd} ghostRef={rowRef} />
        <div style={{ minWidth: 0 }}>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</p>
          <p style={{ color: 'rgba(255,255,255,0.24)', fontSize: 10, fontFamily: 'monospace' }}>{key}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        style={{
          border: `1px solid ${required ? 'rgba(195,149,41,0.35)' : 'rgba(255,255,255,0.12)'}`,
          backgroundColor: required ? 'rgba(195,149,41,0.12)' : 'rgba(255,255,255,0.04)',
          color: required ? '#C39529' : 'rgba(255,255,255,0.45)',
          borderRadius: 999,
          padding: '7px 12px',
          minWidth: 86,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {required ? 'Required' : 'Optional'}
      </button>
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ section, sectionIndex, dragging, dragActive, dropIndicator, draggedItem, paletteDragging, setDragging, onDragEnd, setDropIndicator, onUpdate, onRemove, onAddField, onAddSlider, onUpdateItem, onRemoveItem, onDropItem }: {
  section: CreditScoreFormSection; sectionIndex: number; dragging: DragState; dragActive: boolean; dropIndicator: DropIndicator; draggedItem: CreditScoreFormItem | null; paletteDragging: string | null
  setDragging: (s: DragState) => void; onDragEnd: () => void; setDropIndicator: (d: DropIndicator) => void
  onUpdate: (p: Partial<CreditScoreFormSection>) => void; onRemove: () => void; onAddField: (type?: 'select' | 'radio', insertAt?: number) => void; onAddSlider: (insertAt?: number) => void
  onUpdateItem: (itemIndex: number, p: Partial<CreditScoreFormItem>) => void; onRemoveItem: (itemIndex: number) => void
  onDropItem: () => void
}) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isDraggingThis = dragging?.type === 'section' && dragging.sectionIndex === sectionIndex

  const handleDrop = (e: React.DragEvent) => {
    const paletteType = e.dataTransfer.getData(PALETTE_DRAG_KEY)
    const insertAt = dropIndicator?.kind === 'item' && dropIndicator.sectionIndex === sectionIndex ? dropIndicator.insertBefore : undefined
    if (paletteType === 'question') { e.preventDefault(); onAddField('select', insertAt); return }
    if (paletteType === 'radio') { e.preventDefault(); onAddField('radio', insertAt); return }
    if (paletteType === 'slider') { e.preventDefault(); onAddSlider(insertAt); return }
    onDropItem()
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = e.dataTransfer.types.includes(PALETTE_DRAG_KEY) ? 'copy' : 'move'
      }}
      onDrop={handleDrop}
      ref={cardRef}
      style={{ border: `1px solid ${open ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.025)', opacity: isDraggingThis && dragActive ? 0.15 : 1, transition: 'opacity 0.1s ease, border-color 0.15s ease', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }} onClick={() => setOpen((v) => !v)}>
        <span onClick={(e) => e.stopPropagation()}>
          <DragHandle onDragStart={() => setDragging({ type: 'section', sectionIndex })} onDragEnd={() => onDragEnd()} ghostRef={cardRef} />
        </span>
        <span style={{ flex: 1, color: section.title ? 'white' : 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {section.title || 'Untitled section'}
        </span>
        <Badge color="rgba(195,149,41,0.12)" text="#C39529">{section.weight}</Badge>
        {getSectionSliders(section).length > 0 && <Badge>{getSectionSliders(section).length} slider{getSectionSliders(section).length !== 1 ? 's' : ''}</Badge>}
        <Badge>{getSectionFields(section).length} question{getSectionFields(section).length !== 1 ? 's' : ''}</Badge>
        <span style={{ color: 'rgba(255,255,255,0.28)', display: 'flex' }}><Chevron open={open} /></span>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '18px 16px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Section name</p>
              <input value={section.title} onChange={(e) => onUpdate({ title: e.target.value, id: slugify(e.target.value, section.id) })} style={inp()} placeholder="e.g. Income & Cash Flow" onClick={(e) => e.stopPropagation()} />
            </div>
            <div style={{ width: 110 }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Weight</p>
              <input value={section.weight} onChange={(e) => onUpdate({ weight: e.target.value })} style={inp()} placeholder="e.g. 30%" aria-label="Section weight" onClick={(e) => e.stopPropagation()} />
            </div>
          </div>

          {section.items.length > 0 && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}
              onDragOver={(e) => {
                const isPalette = e.dataTransfer.types.includes(PALETTE_DRAG_KEY)
                if (!isPalette && (!dragging || dragging.type !== 'item')) return
                e.preventDefault(); e.stopPropagation()
                e.dataTransfer.dropEffect = isPalette ? 'copy' : 'move'
                const cards = Array.from((e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[data-drag-item]'))
                  .filter((card) => !(dragging?.type === 'item' && dragging.sectionIndex === sectionIndex && Number(card.dataset.dragItemIndex) === dragging.itemIndex))
                let insertBefore = cards.length
                for (let i = 0; i < cards.length; i++) {
                  const card = cards[i]
                  const rect = card.getBoundingClientRect()
                  // Cap at 40px so tall expanded cards don't require dragging to their visual midpoint
                  if (e.clientY < rect.top + Math.min(rect.height / 2, 40)) { insertBefore = i; break }
                }
                setDropIndicator({ kind: 'item', sectionIndex, insertBefore })
              }}
              onDrop={(e) => {
                e.stopPropagation()
                const paletteType = e.dataTransfer.getData(PALETTE_DRAG_KEY)
                const insertAt = dropIndicator?.kind === 'item' && dropIndicator.sectionIndex === sectionIndex ? dropIndicator.insertBefore : section.items.length
                if (paletteType === 'question') { onAddField('select', insertAt); return }
                if (paletteType === 'radio') { onAddField('radio', insertAt); return }
                if (paletteType === 'slider') { onAddSlider(insertAt); return }
                onDropItem()
              }}
            >
              {(draggedItem || paletteDragging) && dropIndicator?.kind === 'item' && dropIndicator.sectionIndex === sectionIndex &&
                !(dragging?.type === 'item' && dragging.sectionIndex === sectionIndex && dropIndicator.insertBefore === dragging.itemIndex) &&
                itemPreviewSlot(sectionIndex, dropIndicator.insertBefore, dragging) === 0 && (
                <ItemGhost item={draggedItem ?? paletteGhostItem(paletteDragging!)} />
              )}
              {section.items.map((item, itemIdx) => {
                const previewSlot = dropIndicator?.kind === 'item' && dropIndicator.sectionIndex === sectionIndex ? itemPreviewSlot(sectionIndex, dropIndicator.insertBefore, dragging) : null
                const showGhostAfter = (draggedItem || paletteDragging) && previewSlot === itemIdx + 1 &&
                  !(dragging?.type === 'item' && dragging.sectionIndex === sectionIndex && dropIndicator?.insertBefore === dragging.itemIndex)
                const isBeingDragged = dragging?.type === 'item' && dragging.sectionIndex === sectionIndex && dragging.itemIndex === itemIdx && dragActive
                return (
                  <React.Fragment key={item.itemType === 'slider' ? `${section.id}-slider-${item.key}-${itemIdx}` : item.key}>
                    <div data-drag-item data-drag-item-index={itemIdx} style={isBeingDragged ? { height: 0, overflow: 'hidden', pointerEvents: 'none' } : undefined}>
                      {item.itemType === 'slider' ? (
                        <SliderCard
                          slider={item}
                          dragging={dragging}
                          dragActive={dragActive}
                          sectionIndex={sectionIndex}
                          itemIndex={itemIdx}
                          onDragStart={() => setDragging({ type: 'item', sectionIndex, itemIndex: itemIdx })}
                          onDragEnd={() => onDragEnd()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => { e.preventDefault() }}
                          onUpdate={(p) => onUpdateItem(itemIdx, p)}
                          onRemove={() => onRemoveItem(itemIdx)}
                        />
                      ) : (
                        <QuestionCard field={item} sectionIndex={sectionIndex} itemIndex={itemIdx} dragging={dragging} dragActive={dragActive}
                          onDragStart={() => setDragging({ type: 'item', sectionIndex, itemIndex: itemIdx })}
                          onDragEnd={() => onDragEnd()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => { e.preventDefault() }}
                          onUpdate={(p) => onUpdateItem(itemIdx, p)}
                          onRemove={() => onRemoveItem(itemIdx)}
                        />
                      )}
                    </div>
                    {showGhostAfter && <ItemGhost item={draggedItem ?? paletteGhostItem(paletteDragging!)} />}
                  </React.Fragment>
                )
              })}
            </div>
          )}

          {section.items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: paletteDragging ? 'rgba(195,149,41,0.5)' : 'rgba(255,255,255,0.2)', fontSize: 12, border: `1px dashed ${paletteDragging ? 'rgba(195,149,41,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 7, marginBottom: 14, transition: 'all 0.15s ease' }}>
              {paletteDragging ? `Drop here to add` : 'Drop a field type here, or use the buttons below.'}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <IconBtn tone="add" onClick={() => onAddField('select')}>+ Dropdown</IconBtn>
              <IconBtn tone="add" onClick={() => onAddField('radio')}>+ Radio pills</IconBtn>
              <IconBtn tone="add" onClick={onAddSlider}>+ Slider</IconBtn>
            </div>
            <IconBtn tone="danger" onClick={onRemove}>Remove section</IconBtn>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function SettingsForm({ initialConfig }: { initialConfig: Record<string, any> }) {
  const userDefaults = initialConfig.user_default_config ?? null
  const initialFormSnapshot = useRef(configSnapshot(normalizeCreditScoreFormConfig(initialConfig.credit_score_form ?? defaultCreditScoreForm)))

  const [activeTab, setActiveTab] = useState<TabKey>('form')
  const [formConfig, setFormConfig] = useState<CreditScoreFormConfig>(() => normalizeCreditScoreFormConfig(initialConfig.credit_score_form ?? defaultCreditScoreForm))
  const [tiers, setTiers] = useState<any[]>(() => normalizeCreditScoreTiers(initialConfig.score_tiers ?? defaultCreditScoreTiers))
  const [formula, setFormula] = useState<Record<string, number>>(() => normalizeCreditScoreFormula(initialConfig.score_formula ?? defaultCreditScoreFormula))
  const [kycConfig, setKycConfig] = useState<KycConfig>(() => normalizeKycConfig(initialConfig.kyc_config ?? defaultKycConfig))
  const [dragging, setDragging] = useState<DragState>(null)
  const [dropIndicator, setDropIndicator] = useState<DropIndicator>(null)
  const [dragActive, setDragActive] = useState(false)
  const [paletteDragging, setPaletteDragging] = useState<string | null>(null)
  const [kycDragging, setKycDragging] = useState<KycDragState>(null)
  const [kycDropIndicator, setKycDropIndicator] = useState<KycDropIndicator>(null)

  const draggedSection = dragging?.type === 'section' ? formConfig[dragging.sectionIndex] : null
  const draggedItem = dragging?.type === 'item' ? (formConfig[dragging.sectionIndex]?.items[dragging.itemIndex] ?? null) : null
  const draggedKycItem = kycDragging ? getKycGroupItems(kycFieldGroups[kycDragging.groupIndex], kycConfig)[kycDragging.itemIndex] : null
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [restoredBanner, setRestoredBanner] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [pendingLeaveHref, setPendingLeaveHref] = useState<string | null>(null)
  const [pendingLeaveAction, setPendingLeaveAction] = useState<PendingLeaveAction>('back')
  const allowLeaveRef = useRef(false)

  const formFieldCount = useMemo(() => formConfig.reduce((sum, s) => sum + getSectionFields(s).length, 0), [formConfig])
  const formDirty = useMemo(() => configSnapshot(normalizeCreditScoreFormConfig(formConfig)) !== initialFormSnapshot.current, [formConfig])

  const sectionWeightTotal = useMemo(() => {
    return formConfig.reduce((sum, s) => {
      const n = parseFloat(String(s.weight).replace('%', ''))
      return sum + (isNaN(n) ? 0 : n)
    }, 0)
  }, [formConfig])
  const weightOk = Math.abs(sectionWeightTotal - 100) < 0.5
  const weightOver = sectionWeightTotal > 100.5

  const save = async (key: string, value: unknown) => {
    setLoading((c) => ({ ...c, [key]: true }))
    const result = await updateCreditScoreConfig({ configKey: key, configValue: value })
    setLoading((c) => ({ ...c, [key]: false }))
    if ('error' in result) { alert(result.error); return }
    if (key === 'credit_score_form') initialFormSnapshot.current = configSnapshot(normalizeCreditScoreFormConfig(value))
    setSaved((c) => ({ ...c, [key]: true }))
    setTimeout(() => setSaved((c) => ({ ...c, [key]: false })), 2500)
  }

  const saveAsDefault = async () => {
    await save('user_default_config', {
      credit_score_form: normalizeCreditScoreFormConfig(formConfig),
      score_tiers: tiers,
      score_formula: formula,
      kyc_config: normalizeKycConfig(kycConfig),
    })
  }

  const restoreDefaults = () => {
    if (!confirm('Restore all settings to defaults? This resets your local edits (you still need to Save each tab to persist).')) return
    const source = userDefaults ?? {}
    setFormConfig(normalizeCreditScoreFormConfig(source.credit_score_form ?? defaultCreditScoreForm))
    setTiers(normalizeCreditScoreTiers(source.score_tiers ?? defaultCreditScoreTiers))
    setFormula(normalizeCreditScoreFormula(source.score_formula ?? defaultCreditScoreFormula))
    setKycConfig(normalizeKycConfig(source.kyc_config ?? defaultKycConfig))
    setRestoredBanner(true)
    setTimeout(() => setRestoredBanner(false), 4000)
  }

  const updateSection = (si: number, patch: Partial<CreditScoreFormSection>) =>
    setFormConfig((c) => c.map((s, i) => i === si ? { ...s, ...patch } : s))

  const updateItem = (si: number, itemIdx: number, patch: Partial<CreditScoreFormItem>) =>
    setFormConfig((c) => c.map((s, i) => i !== si ? s : { ...s, items: s.items.map((item, j) => j === itemIdx ? { ...item, ...patch } as CreditScoreFormItem : item) }))

  const removeItem = (si: number, itemIdx: number) =>
    setFormConfig((c) => c.map((s, i) => i !== si ? s : { ...s, items: s.items.filter((_, j) => j !== itemIdx) }))

  const addSection = () =>
    setFormConfig((c) => [...c, { id: `section_${Date.now()}`, title: `New Section ${c.length + 1}`, weight: '0%', items: [] }])

  const addField = (si: number, type: 'select' | 'radio' = 'select', insertAt?: number) =>
    setFormConfig((c) => c.map((s, i) => {
      if (i !== si) return s
      const nextItems = [...s.items]
      const index = Math.max(0, Math.min(insertAt ?? nextItems.length, nextItems.length))
      nextItems.splice(index, 0, { itemType: 'field' as const, key: `question_${Date.now()}`, label: `New Question ${getSectionFields(s).length + 1}`, type, options: [{ label: 'Best answer', value: 100 }, { label: 'Average answer', value: 60 }] })
      return { ...s, items: nextItems }
    }))

  const addSlider = (si: number, insertAt?: number) =>
    setFormConfig((c) => c.map((s, i) => {
      if (i !== si) return s
      const usedKeys = new Set(getSectionSliders(s).map((sl) => sl.key))
      const key = (['monthlyIncome', 'obligations', 'downPayment'] as CreditScoreSliderKey[]).find((k) => !usedKeys.has(k)) ?? 'monthlyIncome'
      const nextItems = [...s.items]
      const index = Math.max(0, Math.min(insertAt ?? nextItems.length, nextItems.length))
      nextItems.splice(index, 0, { itemType: 'slider' as const, key, label: key === 'monthlyIncome' ? 'Monthly Net Income (₦)' : key === 'obligations' ? 'Existing Monthly Obligations (₦)' : 'Down Payment Percentage', min: 0, max: key === 'obligations' ? 5000000 : key === 'monthlyIncome' ? 100000000 : 70, step: key === 'obligations' ? 100000 : key === 'monthlyIncome' ? 250000 : 5, defaultValue: key === 'downPayment' ? 30 : 0, scoreImpact: key === 'monthlyIncome' ? 46 : key === 'obligations' ? -34 : 54, minLabel: key === 'downPayment' ? '0%' : '₦0', maxLabel: key === 'obligations' ? '₦5M+' : key === 'monthlyIncome' ? '₦100M+' : '70%+', format: key === 'downPayment' ? 'percent' : 'currency' })
      return { ...s, items: nextItems }
    }))

  const endDrag = () => {
    setDragging(null)
    setDropIndicator(null)
    setKycDragging(null)
    setKycDropIndicator(null)
    setDragActive(false)
  }

  const setKycGroupOrder = (groupIndex: number, orderedItems: KycFieldItem[]) => {
    setKycConfig((current) => {
      const next = normalizeKycConfig(current)
      orderedItems.forEach(([key], index) => {
        next[key] = { ...next[key], order: index }
      })
      return next
    })
  }

  // Inject grabbing cursor while dragging (overrides browser default)
  React.useEffect(() => {
    if (!dragActive) return
    const style = document.createElement('style')
    style.textContent = '*, *::before, *::after { cursor: grabbing !important; }'
    document.head.appendChild(style)
    return () => { style.remove() }
  }, [dragActive])

  React.useEffect(() => {
    if (!formDirty) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowLeaveRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [formDirty])

  React.useEffect(() => {
    if (!formDirty) return

    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    window.history.pushState({ nordSettingsGuard: true }, '', currentUrl)

    const promptLeave = (href: string | null, action: PendingLeaveAction = 'back') => {
      setPendingLeaveHref(href)
      setPendingLeaveAction(action)
      setShowLeaveModal(true)
    }

    const handlePopState = () => {
      if (allowLeaveRef.current) return
      window.history.pushState({ nordSettingsGuard: true }, '', currentUrl)
      promptLeave(null, 'back')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const isKeyboardReload = event.key === 'F5' || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'r')
      if (!isKeyboardReload) return
      event.preventDefault()
      promptLeave(null, 'reload')
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (allowLeaveRef.current || event.defaultPrevented) return
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(target instanceof HTMLAnchorElement)) return
      if (target.target && target.target !== '_self') return
      if (target.href === window.location.href) return

      event.preventDefault()
      promptLeave(target.href)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [formDirty])

  const continueLeaving = () => {
    allowLeaveRef.current = true
    setShowLeaveModal(false)
    if (pendingLeaveHref) {
      window.location.assign(pendingLeaveHref)
      return
    }
    if (pendingLeaveAction === 'reload') {
      window.location.reload()
      return
    }
    window.history.back()
  }

  const dropSection = () => {
    if (!dragging || dragging.type !== 'section' || !dropIndicator || dropIndicator.kind !== 'section') { endDrag(); return }
    const from = dragging.sectionIndex
    let to = dropIndicator.insertBefore
    if (to > from) to = to - 1
    if (from !== to) setFormConfig((c) => reorder(c, from, to))
    endDrag()
  }

  const dropItem = (targetSI: number) => {
    if (!dragging || dragging.type !== 'item' || !dropIndicator || dropIndicator.kind !== 'item') { endDrag(); return }
    const { sectionIndex: fromSI, itemIndex: fromIdx } = dragging
    const insertAt = dropIndicator.insertBefore
    setFormConfig((c) => {
      const next = c.map((s) => ({ ...s, items: [...s.items] }))
      const [item] = next[fromSI].items.splice(fromIdx, 1)
      next[targetSI].items.splice(insertAt, 0, item)
      return next
    })
    endDrag()
  }

  const dropKycItem = (targetGroupIndex: number) => {
    if (!kycDragging || !kycDropIndicator || kycDropIndicator.groupIndex !== targetGroupIndex) { endDrag(); return }
    const from = kycDragging.itemIndex
    const to = kycDropIndicator.insertBefore
    const items = getKycGroupItems(kycFieldGroups[targetGroupIndex], kycConfig)
    if (from !== to) setKycGroupOrder(targetGroupIndex, reorder(items, from, to))
    endDrag()
  }

  return (
    <>
      <style>{`
        @keyframes settings-spin { to { transform: rotate(360deg); } }
        .settings-tab-btn:hover { color: rgba(255,255,255,0.85) !important; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', gap: 2, padding: 4, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
          {tabs.map((tab) => (
            <button key={tab.key} type="button" className="settings-tab-btn" onClick={() => setActiveTab(tab.key)} style={{ backgroundColor: activeTab === tab.key ? '#C39529' : 'transparent', color: activeTab === tab.key ? '#000' : 'rgba(255,255,255,0.5)', border: 'none', borderRadius: 7, padding: '9px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s ease' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Score Builder ── */}
      {activeTab === 'form' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 28 }}>
          {/* Main content */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: weightOver || (!weightOk && formConfig.length > 0) ? 10 : 18 }}>
              <div>
                <p style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Score Builder</p>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>
                  {formConfig.length} section{formConfig.length !== 1 ? 's' : ''} · {formFieldCount} question{formFieldCount !== 1 ? 's' : ''}
                  {formConfig.length > 0 && (
                    <> · weights total:{' '}
                      <span style={{ color: weightOk ? '#22c55e' : weightOver ? '#ef4444' : '#C39529', fontWeight: 600 }}>
                        {sectionWeightTotal.toFixed(0)}%
                      </span>
                    </>
                  )}
                </p>
              </div>
              <SaveButton loading={!!loading.credit_score_form} saved={!!saved.credit_score_form} onClick={() => save('credit_score_form', normalizeCreditScoreFormConfig(formConfig))} />
            </div>

            {formConfig.length > 0 && weightOver && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.4"/><line x1="7" y1="4" x2="7" y2="7.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="10" r="0.8" fill="#ef4444"/></svg>
                <p style={{ color: '#f87171', fontSize: 12 }}>Section weights total <strong>{sectionWeightTotal.toFixed(0)}%</strong> — reduce some section weights to reach 100%.</p>
              </div>
            )}
            {formConfig.length > 0 && !weightOver && !weightOk && (
              <div style={{ backgroundColor: 'rgba(195,149,41,0.07)', border: '1px solid rgba(195,149,41,0.18)', borderRadius: 8, padding: '10px 14px', marginBottom: 18 }}>
                <p style={{ color: '#C39529', fontSize: 12 }}>Section weights total <strong>{sectionWeightTotal.toFixed(0)}%</strong> — increase some section weights to reach 100%.</p>
              </div>
            )}

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes(PALETTE_DRAG_KEY)) {
                  e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; return
                }
                if (!dragging || dragging.type !== 'section') return
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                const cards = Array.from((e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[data-drag-section]'))
                let insertBefore = cards.length
                for (let i = 0; i < cards.length; i++) {
                  const rect = cards[i].getBoundingClientRect()
                  // Cap at 40px so tall open sections don't require dragging to their visual midpoint
                  if (e.clientY < rect.top + Math.min(rect.height / 2, 40)) { insertBefore = i; break }
                }
                setDropIndicator({ kind: 'section', insertBefore })
              }}
              onDrop={(e) => { e.preventDefault(); dropSection() }}
            >
              {draggedSection && dropIndicator?.kind === 'section' && dropIndicator.insertBefore === 0 &&
                !(dragging?.type === 'section' && dragging.sectionIndex === 0) && (
                <SectionGhost section={draggedSection} />
              )}
              {formConfig.map((section, si) => (
                <React.Fragment key={section.id}>
                  <div data-drag-section style={dragging?.type === 'section' && dragging.sectionIndex === si && dragActive ? { height: 0, overflow: 'hidden', pointerEvents: 'none' } : undefined}>
                    <SectionCard section={section} sectionIndex={si} dragging={dragging} dragActive={dragActive} dropIndicator={dropIndicator} draggedItem={draggedItem} paletteDragging={paletteDragging}
                      setDragging={(s) => { setDragging(s); if (s) requestAnimationFrame(() => setDragActive(true)) }}
                      onDragEnd={endDrag}
                      setDropIndicator={setDropIndicator}
                      onUpdate={(p) => updateSection(si, p)}
                      onRemove={() => setFormConfig((c) => c.filter((_, i) => i !== si))}
                      onAddField={(type, insertAt) => addField(si, type, insertAt)}
                      onAddSlider={(insertAt) => addSlider(si, insertAt)}
                      onUpdateItem={(itemIdx, p) => updateItem(si, itemIdx, p)}
                      onRemoveItem={(itemIdx) => removeItem(si, itemIdx)}
                      onDropItem={() => dropItem(si)}
                    />
                  </div>
                  {draggedSection && dropIndicator?.kind === 'section' && dropIndicator.insertBefore === si + 1 &&
                    !(dragging?.type === 'section' && (dragging.sectionIndex === si || dragging.sectionIndex === si + 1)) && (
                    <SectionGhost section={draggedSection} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {formConfig.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.2)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10 }}>
                No sections yet. Add your first section or drag a field type from the palette.
              </div>
            )}

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IconBtn tone="add" onClick={addSection}>+ Add section</IconBtn>
              <SaveButton loading={!!loading.credit_score_form} saved={!!saved.credit_score_form} onClick={() => save('credit_score_form', normalizeCreditScoreFormConfig(formConfig))} />
            </div>
          </div>

          {/* Right palette */}
          <div style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto', overflowX: 'hidden', paddingBottom: 8 }}>
              <PaletteSidebar onDragStart={(t) => setPaletteDragging(t)} onDragEnd={() => { setPaletteDragging(null); setDropIndicator(null) }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Tiers ── */}
      {activeTab === 'tiers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Score Tiers</p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>Configure interest rate, tenor, and down payment per tier</p>
            </div>
            <SaveButton loading={!!loading.score_tiers} saved={!!saved.score_tiers} onClick={() => save('score_tiers', tiers)} />
          </div>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 120px 130px 140px', gap: '0 12px', padding: '0 0 8px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 4 }}>
            {['Key (system)', 'Label', 'Min Score', 'Interest %', 'Max Tenor', 'Min Down %'].map((h) => (
              <p key={h} style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</p>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tiers.map((tier, i) => (
              <div key={tier.name ?? i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 120px 130px 140px', gap: '0 12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                <div style={{ ...inp(), fontFamily: 'monospace', fontSize: 12, color: 'rgba(195,149,41,0.5)', backgroundColor: 'rgba(255,255,255,0.02)', cursor: 'default', userSelect: 'none' }} title="System key — not editable">{tier.name}</div>
                <input type="text" value={tier.label} onChange={(e) => setTiers((t) => t.map((item, j) => j === i ? { ...item, label: e.target.value } : item))} style={inp()} />
                {(['min_score', 'interest_rate', 'max_tenor_months', 'min_down_payment'] as string[]).map((field) => (
                  <input key={field} type="number" value={tier[field]} onChange={(e) => setTiers((t) => t.map((item, j) => j === i ? { ...item, [field]: parseFloat(e.target.value) } : item))} style={inp()} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Formula ── */}
      {activeTab === 'formula' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Formula Parameters</p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>Controls how the score is computed from form responses</p>
            </div>
            <SaveButton loading={!!loading.score_formula} saved={!!saved.score_formula} onClick={() => save('score_formula', formula)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
            {Object.entries(formula).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{FORMULA_LABELS[key] ?? key}</label>
                <input type="number" value={Number(val)} step="any" onChange={(e) => setFormula((p) => ({ ...p, [key]: parseFloat(e.target.value) }))} style={{ ...inp(120) }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── KYC ── */}
      {activeTab === 'kyc' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>KYC Requirements</p>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>Choose which application fields and documents are required.</p>
            </div>
            <SaveButton loading={!!loading.kyc_config} saved={!!saved.kyc_config} onClick={() => save('kyc_config', normalizeKycConfig(kycConfig))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {kycFieldGroups.map((group, groupIndex) => {
              const items = getKycGroupItems(group, kycConfig)
              return (
              <div key={group.title} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.025)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <p style={{ color: '#C39529', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{group.title}</p>
                  <Badge>{items.length} fields</Badge>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column' }}
                  onDragOver={(e) => {
                    if (!kycDragging || kycDragging.groupIndex !== groupIndex) return
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    const rows = Array.from((e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[data-drag-kyc-item]'))
                      .filter((row) => !(kycDragging.groupIndex === groupIndex && Number(row.dataset.dragKycItemIndex) === kycDragging.itemIndex))
                    let insertBefore = rows.length
                    for (let i = 0; i < rows.length; i++) {
                      const rect = rows[i].getBoundingClientRect()
                      if (e.clientY < rect.top + Math.min(rect.height / 2, 40)) { insertBefore = i; break }
                    }
                    setKycDropIndicator({ groupIndex, insertBefore })
                  }}
                  onDrop={(e) => { e.preventDefault(); dropKycItem(groupIndex) }}
                >
                  {draggedKycItem && kycDropIndicator?.groupIndex === groupIndex &&
                    !(kycDragging?.groupIndex === groupIndex && kycDropIndicator.insertBefore === kycDragging.itemIndex) &&
                    kycPreviewSlot(groupIndex, kycDropIndicator.insertBefore, kycDragging) === 0 && (
                    <KycFieldGhost item={draggedKycItem} />
                  )}
                  {items.map((item, itemIndex) => {
                    const [key] = item
                    const required = kycConfig[key]?.required ?? false
                    const previewSlot = kycDropIndicator?.groupIndex === groupIndex ? kycPreviewSlot(groupIndex, kycDropIndicator.insertBefore, kycDragging) : null
                    const showGhostAfter = draggedKycItem && previewSlot === itemIndex + 1 &&
                      !(kycDragging?.groupIndex === groupIndex && kycDropIndicator?.insertBefore === kycDragging.itemIndex)
                    const isBeingDragged = kycDragging?.groupIndex === groupIndex && kycDragging.itemIndex === itemIndex && dragActive
                    return (
                      <React.Fragment key={key}>
                        <div data-drag-kyc-item data-drag-kyc-item-index={itemIndex} style={isBeingDragged ? { height: 0, overflow: 'hidden', pointerEvents: 'none' } : undefined}>
                          <KycFieldRow
                            item={item}
                            groupIndex={groupIndex}
                            itemIndex={itemIndex}
                            required={required}
                            dragging={kycDragging}
                            dragActive={dragActive}
                            onDragStart={() => { setKycDragging({ groupIndex, itemIndex }); requestAnimationFrame(() => setDragActive(true)) }}
                            onDragEnd={endDrag}
                            onToggle={() => setKycConfig((current) => {
                              const normalized = normalizeKycConfig(current)
                              return { ...normalized, [key]: { ...normalized[key], required: !required } }
                            })}
                          />
                        </div>
                        {showGhostAfter && <KycFieldGhost item={draggedKycItem} />}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Defaults footer ── */}
      <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 2 }}>Defaults</p>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11 }}>
            {userDefaults ? 'You have a saved default snapshot.' : 'No custom default saved — restore uses factory values.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {restoredBanner && (
            <span style={{ color: '#C39529', fontSize: 11 }}>Defaults loaded — save each tab to apply.</span>
          )}
          <button type="button" onClick={restoreDefaults} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
            ↩ Restore {userDefaults ? 'saved default' : 'factory default'}
          </button>
          <button type="button" onClick={saveAsDefault} disabled={!!loading.user_default_config} style={{ background: 'none', border: 'none', color: saved.user_default_config ? '#22c55e' : 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
            {loading.user_default_config ? 'Saving…' : saved.user_default_config ? '✓ Saved as default' : 'Save current as default'}
          </button>
        </div>
      </div>

      {/* Unsaved changes confirmation modal */}
      {showLeaveModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 400,
          backgroundColor: 'rgba(0,0,0,0.76)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            width: 'min(420px, 100%)',
            backgroundColor: 'rgba(10,10,10,0.95)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 18,
            padding: '36px 32px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
          }}>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600, fontSize: 11,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#C39529', marginBottom: 12,
            }}>
              Cancel Changes
            </p>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400, fontSize: 14, lineHeight: 1.8,
              color: 'rgba(255,255,255,0.65)', marginBottom: 28,
            }}>
              Are you sure you want to leave? Your score builder changes will not be saved.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowLeaveModal(false); setPendingLeaveHref(null) }}
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  borderRadius: 100, padding: '12px 24px',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Keep Going
              </button>
              <button
                onClick={continueLeaving}
                style={{
                  border: '1px solid #C39529',
                  background: 'transparent',
                  color: '#C39529',
                  borderRadius: 100, padding: '12px 24px',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
