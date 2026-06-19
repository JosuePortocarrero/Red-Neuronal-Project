import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { Clock, TrendingUp, Zap, Layers } from 'lucide-react'

const C = { cpu_a: '#a855f7', cpu_b: '#eab308' }

function Tip({ active, payload, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-2.5 py-1.5 text-[11px] shadow-2xl"
      style={{ background: 'rgba(8,8,15,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="font-bold score" style={{ color: payload[0]?.fill }}>
        {Number(payload[0]?.value).toFixed(4)}
      </span>
      <span className="text-white/52 ml-1">{unit}</span>
    </div>
  )
}

function Chart({ title, hint, badge, data, unit, icon: Icon, iconColor }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'rgba(14,14,22,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3 h-3 ${iconColor}`} />
          <span className="text-[11px] font-medium text-white/72">{title}</span>
        </div>
        <span className="text-[8px] font-mono text-white/48 px-1.5 py-0.5 rounded border border-white/[0.04]">{badge}</span>
      </div>
      <p className="text-[9px] text-white/48 mb-3">{hint}</p>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} barSize={40} margin={{ top: 16, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="nombre" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.42)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip unit={unit} />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="valor" position="top" style={{ fill: 'rgba(255,255,255,0.55)', fontSize: 8, fontFamily: 'JetBrains Mono' }} formatter={v => Number(v).toFixed(3)} />
            {data.map((e, i) => (
              <Cell key={i} fill={C[e.key]} fillOpacity={0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: C[d.key] }} />
            <span className="text-[9px] text-white/55 truncate max-w-[80px]">{d.nombre}</span>
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

  return (
    <div className="surface rounded-2xl p-5 animate-slide-up-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #a855f7, #eab308)' }} />
        <span className="text-[11px] font-semibold text-white/62 uppercase tracking-widest">Telemetría</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Chart title="Score predicho" hint="Predicción del modelo" badge="Mayor ↑"
          data={mk('score_predicho')} unit="pts" icon={Zap} iconColor="text-violet-400" />
        <Chart title="Amdahl speedup" hint="Aceleración paralela" badge="Mayor ↑"
          data={mk('amdahl_speedup')} unit="×" icon={TrendingUp} iconColor="text-emerald-400" />
        <Chart title="Latencia T_ciclo" hint="Tiempo de ciclo" badge="Menor ↓"
          data={mk('T_ciclo')} unit="s" icon={Clock} iconColor="text-orange-400" />
        <Chart title="Peso single-core" hint="Según tu contexto" badge="IA"
          data={mk('peso_single')} unit="" icon={Layers} iconColor="text-sky-400" />
      </div>
    </div>
  )
}
