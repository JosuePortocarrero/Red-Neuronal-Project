import { Trophy, DollarSign, Zap, TrendingUp, Cpu, Layers, Clock, Minus } from 'lucide-react'

function ScoreBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="h-1.5 rounded-full overflow-hidden bg-white/5 mt-1.5">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

function MetricRow({ icon: Icon, label, valueA, valueB, higherIsBetter = true, format }) {
  const a = parseFloat(valueA) || 0
  const b = parseFloat(valueB) || 0
  const aWins = higherIsBetter ? a > b : a < b
  const bWins = higherIsBetter ? b > a : b < a
  const fmt   = format ?? (v => v != null ? Number(v).toFixed(2) : '—')
  const max   = Math.max(a, b)

  return (
    <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center py-2.5 border-b border-white/4 last:border-0">
      <div className="text-right">
        <span className={`text-sm font-semibold score-badge ${aWins ? 'text-cyan-300' : 'text-slate-500'}`}>
          {fmt(valueA)}
        </span>
        <ScoreBar value={a} max={max} color={aWins ? '#06b6d4' : 'rgba(148,163,184,0.2)'} />
      </div>

      <div className="flex flex-col items-center gap-1 min-w-[90px]">
        <Icon className="w-3 h-3 text-slate-600" />
        <span className="text-[9px] text-slate-600 uppercase tracking-wider text-center leading-tight">{label}</span>
      </div>

      <div className="text-left">
        <span className={`text-sm font-semibold score-badge ${bWins ? 'text-indigo-300' : 'text-slate-500'}`}>
          {fmt(valueB)}
        </span>
        <ScoreBar value={b} max={max} color={bWins ? '#818cf8' : 'rgba(148,163,184,0.2)'} />
      </div>
    </div>
  )
}

export default function VerdictSection({ resultado }) {
  /* ── Mapeo de la respuesta real de la API ─────────────────────────── */
  const { veredicto, telemetria } = resultado
  const a = telemetria?.cpu_a
  const b = telemetria?.cpu_b

  const aWins = veredicto?.ganador === a?.nombre

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up space-y-5">

      {/* Banner ganador */}
      <div className="relative rounded-xl overflow-hidden p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.07), rgba(99,102,241,0.07))', border: '1px solid rgba(6,182,212,0.15)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <Trophy className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Veredicto del Oráculo</p>
          <p className="text-sm font-bold text-white truncate">
            {veredicto?.fabricante_ganador} {veredicto?.ganador}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Ventaja</p>
          <p className="text-sm font-bold score-badge text-cyan-400">
            +{veredicto?.diferencia_score?.toFixed(2) ?? '—'}
          </p>
        </div>
        <div className="absolute right-0 top-0 w-32 h-full"
          style={{ background: 'radial-gradient(ellipse at right, rgba(6,182,212,0.07), transparent)' }} />
      </div>

      {/* Cabeceras de CPU */}
      <div className="grid grid-cols-[1fr,40px,1fr] gap-3 items-center">
        <div className={`rounded-xl p-3 text-center relative ${aWins ? 'gradient-border-winner' : ''}`}
          style={{ background: aWins ? 'rgba(6,182,212,0.05)' : 'rgba(255,255,255,0.02)', border: aWins ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
          {aWins && <Trophy className="w-3 h-3 text-cyan-400 mx-auto mb-1" />}
          <span className="inline-flex w-5 h-5 rounded-md text-[10px] font-bold items-center justify-center mb-1.5"
            style={{ background: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.2)' }}>A</span>
          <p className="text-[11px] font-semibold text-slate-300 leading-tight">
            {a?.fabricante} {a?.nombre}
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">{a?.cores}C / {a?.threads}T · {a?.baseClock} GHz</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <Minus className="w-3 h-3 text-slate-600" />
          </div>
        </div>

        <div className={`rounded-xl p-3 text-center relative ${!aWins ? 'gradient-border-winner' : ''}`}
          style={{ background: !aWins ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)', border: !aWins ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
          {!aWins && <Trophy className="w-3 h-3 text-indigo-400 mx-auto mb-1" />}
          <span className="inline-flex w-5 h-5 rounded-md text-[10px] font-bold items-center justify-center mb-1.5"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>B</span>
          <p className="text-[11px] font-semibold text-slate-300 leading-tight">
            {b?.fabricante} {b?.nombre}
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">{b?.cores}C / {b?.threads}T · {b?.baseClock} GHz</p>
        </div>
      </div>

      {/* Tabla de métricas comparativas */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <MetricRow
          icon={Zap}
          label="Score Predicho"
          valueA={a?.score_predicho}
          valueB={b?.score_predicho}
          higherIsBetter={true}
          format={v => v != null ? Number(v).toFixed(2) : '—'}
        />
        <MetricRow
          icon={DollarSign}
          label="Precio MSRP (USD)"
          valueA={a?.precio_usd}
          valueB={b?.precio_usd}
          higherIsBetter={false}
          format={v => v != null ? `$${Number(v).toLocaleString()}` : '—'}
        />
        <MetricRow
          icon={TrendingUp}
          label="Rend. / Dólar"
          valueA={a?.rendimiento_por_dolar}
          valueB={b?.rendimiento_por_dolar}
          higherIsBetter={true}
          format={v => v != null ? Number(v).toFixed(4) : '—'}
        />
        <MetricRow
          icon={Cpu}
          label="Peso Single-Core"
          valueA={a?.peso_single}
          valueB={b?.peso_single}
          higherIsBetter={true}
          format={v => v != null ? `${(Number(v) * 100).toFixed(0)}%` : '—'}
        />
        <MetricRow
          icon={Layers}
          label="Peso Multi-Core"
          valueA={a?.peso_multi}
          valueB={b?.peso_multi}
          higherIsBetter={true}
          format={v => v != null ? `${(Number(v) * 100).toFixed(0)}%` : '—'}
        />
        <MetricRow
          icon={Clock}
          label="Cinebench Single"
          valueA={a?.score_cinebench_single}
          valueB={b?.score_cinebench_single}
          higherIsBetter={true}
          format={v => v != null ? Number(v).toFixed(0) : '—'}
        />
      </div>
    </div>
  )
}
