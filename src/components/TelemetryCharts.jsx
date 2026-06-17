import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { Clock, TrendingUp, Zap, Layers } from 'lucide-react'

const COLORS = { cpu_a: '#06b6d4', cpu_b: '#818cf8' }

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2.5 text-xs shadow-2xl"
      style={{ background: 'rgba(8,12,30,0.97)', border: '1px solid rgba(99,102,241,0.2)', backdropFilter: 'blur(16px)' }}>
      <p className="text-slate-400 mb-1 truncate max-w-[140px]">{label}</p>
      <p className="font-bold score-badge" style={{ color: payload[0]?.fill }}>
        {Number(payload[0]?.value).toFixed(4)}
        <span className="text-slate-600 font-normal ml-1">{unit}</span>
      </p>
    </div>
  )
}

function MiniChart({ title, hint, data, unit, icon: Icon, iconColor, note }) {
  return (
    <div className="rounded-2xl p-5 animate-slide-up"
      style={{ background: 'rgba(8,12,28,0.75)', border: '1px solid rgba(255,255,255,0.06)' }}>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          <div>
            <p className="text-xs font-semibold text-slate-300 leading-none">{title}</p>
            <p className="text-[10px] text-slate-600 leading-none mt-0.5">{hint}</p>
          </div>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full text-slate-600 border border-white/5"
          style={{ background: 'rgba(255,255,255,0.03)' }}>{note}</span>
      </div>

      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} barSize={48} margin={{ top: 18, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.07)" vertical={false} />
          <XAxis
            dataKey="nombre"
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip unit={unit} />}
            cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 6 }}
          />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="valor"
              position="top"
              style={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              formatter={v => Number(v).toFixed(3)}
            />
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={COLORS[entry.key]}
                style={{ filter: `drop-shadow(0 4px 8px ${COLORS[entry.key]}40)` }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-4 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[d.key] }} />
            <span className="text-[10px] text-slate-600 truncate max-w-[100px]">{d.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TelemetryCharts({ resultado }) {
  /* ── Mapeo real de la API ─────────────────────────────────────────── */
  const a = resultado?.telemetria?.cpu_a
  const b = resultado?.telemetria?.cpu_b

  const shortName = n => {
    if (!n) return '—'
    const parts = n.split(' ')
    return parts.length > 3 ? parts.slice(0, 3).join(' ') + '…' : n
  }

  const latenciaData = [
    { nombre: shortName(a?.nombre), valor: a?.T_ciclo,         key: 'cpu_a' },
    { nombre: shortName(b?.nombre), valor: b?.T_ciclo,         key: 'cpu_b' },
  ]

  const amdahlData = [
    { nombre: shortName(a?.nombre), valor: a?.amdahl_speedup,  key: 'cpu_a' },
    { nombre: shortName(b?.nombre), valor: b?.amdahl_speedup,  key: 'cpu_b' },
  ]

  const scoreData = [
    { nombre: shortName(a?.nombre), valor: a?.score_predicho,  key: 'cpu_a' },
    { nombre: shortName(b?.nombre), valor: b?.score_predicho,  key: 'cpu_b' },
  ]

  const pesoData = [
    { nombre: `${shortName(a?.nombre)} (single)`, valor: a?.peso_single, key: 'cpu_a' },
    { nombre: `${shortName(b?.nombre)} (single)`, valor: b?.peso_single, key: 'cpu_b' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MiniChart
        title="Score Predicho (ML)"
        hint="Predicción del modelo PyTorch"
        note="Mayor es mejor ↑"
        data={scoreData}
        unit="pts"
        icon={Zap}
        iconColor="text-cyan-400"
      />
      <MiniChart
        title="Amdahl Speedup"
        hint="Aceleración teórica paralela"
        note="Mayor es mejor ↑"
        data={amdahlData}
        unit="×"
        icon={TrendingUp}
        iconColor="text-emerald-400"
      />
      <MiniChart
        title="Latencia T_ciclo"
        hint="Tiempo de ciclo (1 / baseClock)"
        note="Menor es mejor ↓"
        data={latenciaData}
        unit="ns"
        icon={Clock}
        iconColor="text-orange-400"
      />
      <MiniChart
        title="Peso Single-Core (IA)"
        hint="Importancia asignada por Gemini"
        note="Según tu contexto"
        data={pesoData}
        unit=""
        icon={Layers}
        iconColor="text-violet-400"
      />
    </div>
  )
}
