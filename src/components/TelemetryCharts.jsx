import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList, Legend,
} from 'recharts'
import { TrendingUp, Zap, Gauge, Layers } from 'lucide-react'

const C = { cpu_a: '#a855f7', cpu_b: '#eab308' }

const fmtNum = v => {
  const n = Number(v)
  if (!isFinite(n)) return '—'
  return Math.abs(n) >= 100 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toFixed(3)
}

function Tip({ active, payload, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-2.5 py-1.5 text-[11px] shadow-2xl"
      style={{ background: 'rgba(8,8,15,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="font-bold score" style={{ color: payload[0]?.fill }}>{fmtNum(payload[0]?.value)}</span>
      <span className="text-white/60 ml-1">{unit}</span>
    </div>
  )
}

function Chart({ title, hint, badge, data, unit, icon: Icon, iconColor }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(14,14,22,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          <span className="text-[11px] font-medium text-white/78">{title}</span>
        </div>
        <span className="text-[8px] font-mono text-white/55 px-1.5 py-0.5 rounded border border-white/[0.05]">{badge}</span>
      </div>
      <p className="text-[10px] text-white/55 mb-3">{hint}</p>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} barSize={40} margin={{ top: 16, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="nombre" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip unit={unit} />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="valor" position="top" style={{ fill: 'rgba(255,255,255,0.62)', fontSize: 8, fontFamily: 'JetBrains Mono' }} formatter={fmtNum} />
            {data.map((e, i) => <Cell key={i} fill={C[e.key]} fillOpacity={0.72} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: C[d.key] }} />
            <span className="text-[10px] text-white/62 truncate max-w-[90px]">{d.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TelemetryCharts({ resultado }) {
  const a = resultado?.telemetria?.cpu_a
  const b = resultado?.telemetria?.cpu_b
  const sn = n => { if (!n) return '—'; const p = n.split(' '); return p.length > 3 ? p.slice(0, 3).join(' ') : n }

  const mk = (field) => [
    { nombre: sn(a?.nombre), valor: a?.[field], key: 'cpu_a' },
    { nombre: sn(b?.nombre), valor: b?.[field], key: 'cpu_b' },
  ]

  // Núcleos efectivos para la carga: P · N · η (paralelismo realmente aprovechado).
  const efectivos = [
    { nombre: sn(a?.nombre), valor: (a?.fraccion_paralela ?? 0) * (a?.cores ?? 0) * (a?.eta ?? 1), key: 'cpu_a' },
    { nombre: sn(b?.nombre), valor: (b?.fraccion_paralela ?? 0) * (b?.cores ?? 0) * (b?.eta ?? 1), key: 'cpu_b' },
  ]

  // Amdahl ideal (η=1) vs rendimiento corregido por la red (η real).
  const idealReal = [a, b].filter(Boolean).map((c) => {
    const P = c.fraccion_paralela ?? 0
    const single = c.score_cinebench_single ?? 0
    const ideal = single * ((1 - P) + P * c.cores) // η = 1
    return { nombre: sn(c.nombre), ideal: Math.round(ideal), real: Math.round(c.score_predicho ?? 0) }
  })

  return (
    <div className="surface rounded-2xl p-5 animate-slide-up-3 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #a855f7, #eab308)' }} />
        <span className="text-[11px] font-semibold text-white/70 uppercase tracking-widest">Telemetría</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Chart title="Rendimiento" hint="Ajustado a tu carga" badge="Mayor ↑"
          data={mk('score_predicho')} unit="pts" icon={Zap} iconColor="text-violet-400" />
        <Chart title="Eficiencia η" hint="Amdahl ideal = 1.00" badge="Red"
          data={mk('eta')} unit="" icon={Gauge} iconColor="text-emerald-400" />
        <Chart title="Speedup Amdahl" hint="Aceleración paralela" badge="Mayor ↑"
          data={mk('amdahl_speedup')} unit="×" icon={TrendingUp} iconColor="text-sky-400" />
        <Chart title="Núcleos efectivos" hint="Paralelismo aprovechado (P·N·η)" badge="Situación"
          data={efectivos} unit="" icon={Layers} iconColor="text-orange-400" />
      </div>

      {/* Gráfico estrella: la red corrige el ideal de Amdahl */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(14,14,22,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Gauge className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-medium text-white/78">Amdahl ideal vs. corregido por la red</span>
        </div>
        <p className="text-[10px] text-white/55 mb-3">
          La Ley de Amdahl asume escalado perfecto (η=1). La red ajusta ese ideal con la eficiencia real de cada CPU.
        </p>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={idealReal} barGap={6} margin={{ top: 18, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="nombre" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ background: 'rgba(8,8,15,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }} />
            <Bar dataKey="ideal" name="Ideal (Amdahl)" fill="rgba(255,255,255,0.22)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="real" name="Corregido (red)" fill="#10b981" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
