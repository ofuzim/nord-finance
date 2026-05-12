'use client'

import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type VolumePoint = {
  label: string
  applications: number
}

type VolumeRangeKey = '7d' | '14d' | '30d' | '90d' | '1y'

type ScoreBand = {
  tierName: string
  label: string
  rangeLabel: string
  count: number
  color: string
}

type VehicleInterest = {
  name: string
  count: number
}

function ChartCard({ title, subtitle, action, children, chartOverflow = 'hidden' }: { title: string; subtitle: string; action?: React.ReactNode; children: React.ReactNode; chartOverflow?: 'hidden' | 'visible' }) {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: chartOverflow }}>
      <div style={{ padding: '18px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>{subtitle}</p>
        </div>
        {action}
      </div>
      <div style={{ height: 260, padding: '16px 14px 18px' }}>{children}</div>
    </div>
  )
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 8,
  color: '#ffffff',
  padding: '10px 12px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.65)',
  zIndex: 50,
}

const pieTooltipStyle: React.CSSProperties = {
  ...tooltipStyle,
  backgroundColor: '#111111',
  border: '1px solid rgba(195,149,41,0.35)',
}

function ScoreDistributionChart({ scoreData }: { scoreData: ScoreBand[] }) {
  const total = scoreData.reduce((sum, item) => sum + item.count, 0)
  const visibleScoreData = scoreData.filter((item) => item.count > 0)
  const donutData = visibleScoreData.length
    ? visibleScoreData
    : [{ tierName: 'empty', label: 'No scores', rangeLabel: '', count: 1, color: 'rgba(255,255,255,0.12)' }]
  const paddingAngle = visibleScoreData.length > 1 ? 2 : 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(108px, 0.7fr)', alignItems: 'center', justifyContent: 'space-between', gap: 10, height: '100%' }}>
      <div style={{ height: 220, position: 'relative', overflow: 'visible' }}>
        {/* Behind the pie so the donut hole reveals totals; ring + tooltips paint above */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 112,
            height: 112,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{total}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>Scores</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              dataKey="count"
              nameKey="label"
              innerRadius={62}
              outerRadius={96}
              paddingAngle={paddingAngle}
              stroke="rgba(0,0,0,0.42)"
              strokeWidth={visibleScoreData.length > 1 ? 1 : 0}
              startAngle={90}
              endAngle={-270}
              animationDuration={450}
              animationEasing="ease-out"
            >
              {donutData.map((entry) => (
                <Cell key={entry.tierName} fill={entry.color} />
              ))}
            </Pie>
            {total > 0 && (
              <Tooltip
                wrapperStyle={{ zIndex: 20, outline: 'none' }}
                contentStyle={pieTooltipStyle}
                labelStyle={{ color: '#ffffff', fontWeight: 600, fontSize: 12, marginBottom: 6 }}
                itemStyle={{ color: '#f5f5f5', fontSize: 13, fontWeight: 600 }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifySelf: 'end', width: '100%' }}>
        {scoreData.map((item) => (
          <div key={item.tierName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '7px 9px', backgroundColor: 'rgba(255,255,255,0.025)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, color: 'rgba(255,255,255,0.62)', fontSize: 11 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}55`, flexShrink: 0 }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ color: 'rgba(255,255,255,0.78)', fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.02em' }}>{item.rangeLabel}</span>
              </span>
            </span>
            <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardCharts({
  volumeRanges,
  scoreData,
  vehicleData,
}: {
  volumeRanges: Record<VolumeRangeKey, VolumePoint[]>
  scoreData: ScoreBand[]
  vehicleData: VehicleInterest[]
}) {
  const [volumeRange, setVolumeRange] = useState<VolumeRangeKey>('14d')
  const volumeData = volumeRanges[volumeRange] ?? volumeRanges['14d']
  const volumeRangeLabel = volumeRange === '1y' ? '1 year' : `${volumeRange.replace('d', '')} days`

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 16, marginBottom: 40 }}>
      <ChartCard
        title="Application Volume"
        subtitle={`Applications created over the last ${volumeRangeLabel}`}
        action={
          <div style={{ display: 'inline-flex', gap: 2, padding: 3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.035)', flexShrink: 0 }}>
            {(['7d', '14d', '30d', '90d', '1y'] as VolumeRangeKey[]).map((range) => {
              const active = range === volumeRange
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => setVolumeRange(range)}
                  style={{
                    border: 'none',
                    borderRadius: 999,
                    backgroundColor: active ? '#C39529' : 'transparent',
                    color: active ? '#000' : 'rgba(255,255,255,0.5)',
                    padding: '6px 9px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                  }}
                >
                  {range === '1y' ? '1Y' : range.toUpperCase()}
                </button>
              )
            })}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={volumeData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.42)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.38)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'rgba(255,255,255,0.75)' }} />
            <Line type="monotone" dataKey="applications" stroke="#C39529" strokeWidth={2.5} dot={{ r: 3, fill: '#C39529' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Credit Score Distribution" subtitle="Applicants grouped by score band" chartOverflow="visible">
        <ScoreDistributionChart scoreData={scoreData} />
      </ChartCard>

      <div style={{ gridColumn: '1 / -1' }}>
        <ChartCard title="Vehicle Interest" subtitle="Most selected vehicles across applications">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vehicleData} layout="vertical" margin={{ top: 4, right: 20, left: 52, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.38)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.28)' }} />
              <Bar dataKey="count" fill="#C39529" radius={[0, 8, 8, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
