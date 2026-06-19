import { Trophy, DollarSign, Zap, TrendingUp, Cpu, Layers, Clock } from 'lucide-react'

function Bar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="h-1 rounded-full overflow-hidden bg-white/[0.04] mt-1">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function Row({ icon: Icon, label, vA, vB, higherBetter = true, fmt }) {
  const a = parseFloat(vA) || 0, b = parseFloat(vB) || 0
  const aW = higherBetter ? a > b : a < b
  const bW = higherBetter ? b > a : b < a
  const f  = fmt ?? (v => v != null ? Number(v).toFixed(2) : '—')
  const m  = Math.max(a, b)
  return (
    <div className="grid grid-cols-[1fr,100px,1fr] gap-2 items-center py-1.5 border-b border-white/[0.03] last:border-0">
      <div className="text-right">
        <span className={`text-[13px] font-semibold score ${aW ? 'text-violet-300' : 'text-white/55'}`}>{f(vA)}</span>
        <Bar value={a} max={m} color={aW ? '#a855f7' : 'rgba(255,255,255,0.06)'} />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <Icon className="w-3 h-3 text-white/46" />
        <span className="text-[8px] text-white/48 uppercase tracking-wider text-center leading-tight">{label}</span>
      </div>
      <div>
        <span className={`text-[13px] font-semibold score ${bW ? 'text-amber-300' : 'text-white/55'}`}>{f(vB)}</span>
        <Bar value={b} max={m} color={bW ? '#eab308' : 'rgba(255,255,255,0.06)'} />
      </div>
    </div>
  )
}

export default function VerdictSection({ resultado }) {
  const { veredicto, telemetria } = resultado
  const a = telemetria?.cpu_a
  const b = telemetria?.cpu_b
  const aWins = veredicto?.ganador === a?.nombre

  return (
    <div className="animate-slide-up space-y-4">

      {/* Winner banner */}
      <div className="surface-elevated winner-glow rounded-2xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(168,85,247,0.15))', border: '1px solid rgba(234,179,8,0.2)' }}>
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-white/52 uppercase tracking-[0.15em] mb-1">Veredicto</p>
          <p className="text-base font-bold text-winner truncate">
            {veredicto?.fabricante_ganador} {veredicto?.ganador}
          </p>
        </div>
        <div className="text-right shrink-0 pl-3">
          <p className="text-[9px] text-white/48 uppercase tracking-wider">Ventaja</p>
          <p className="text-lg font-bold score text-emerald-400">
            +{veredicto?.diferencia_score?.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Comparison card */}
      <div className="surface rounded-2xl p-5 space-y-4">
        {/* Headers */}
        <div className="grid grid-cols-[1fr,100px,1fr] gap-2 items-center">
          <div className={`rounded-xl p-3 text-center ${aWins ? 'winner-glow' : ''}`}
            style={{ background: aWins ? 'rgba(168,85,247,0.06)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {aWins && <Trophy className="w-3 h-3 text-amber-400 mx-auto mb-1" />}
            <div className="text-[9px] font-mono font-bold mb-1"
              style={{ color: '#c084fc' }}>CPU — A</div>
            <p className="text-[11px] font-semibold text-white/85 leading-tight">{a?.fabricante} {a?.nombre}</p>
            <p className="text-[9px] text-white/48 font-mono mt-0.5">{a?.cores}C/{a?.threads}T · {a?.baseClock}GHz</p>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-[10px] font-black text-white/42">VS</span>
          </div>

          <div className={`rounded-xl p-3 text-center ${!aWins ? 'winner-glow' : ''}`}
            style={{ background: !aWins ? 'rgba(234,179,8,0.04)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {!aWins && <Trophy className="w-3 h-3 text-amber-400 mx-auto mb-1" />}
            <div className="text-[9px] font-mono font-bold mb-1"
              style={{ color: '#fbbf24' }}>CPU — B</div>
            <p className="text-[11px] font-semibold text-white/85 leading-tight">{b?.fabricante} {b?.nombre}</p>
            <p className="text-[9px] text-white/48 font-mono mt-0.5">{b?.cores}C/{b?.threads}T · {b?.baseClock}GHz</p>
          </div>
        </div>

        {/* Metrics rows */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <Row icon={Zap}          label="Score Predicho"   vA={a?.score_predicho}       vB={b?.score_predicho} />
          <Row icon={DollarSign}   label="MSRP (USD)"       vA={a?.precio_usd}           vB={b?.precio_usd}           higherBetter={false}
               fmt={v => v != null ? `$${Number(v).toLocaleString()}` : '—'} />
          <Row icon={TrendingUp}   label="Rend./Dólar"      vA={a?.rendimiento_por_dolar} vB={b?.rendimiento_por_dolar}
               fmt={v => v != null ? Number(v).toFixed(4) : '—'} />
          <Row icon={Cpu}          label="Peso Single"      vA={a?.peso_single}          vB={b?.peso_single}
               fmt={v => v != null ? `${(Number(v)*100).toFixed(0)}%` : '—'} />
          <Row icon={Layers}       label="Peso Multi"       vA={a?.peso_multi}           vB={b?.peso_multi}
               fmt={v => v != null ? `${(Number(v)*100).toFixed(0)}%` : '—'} />
          <Row icon={Clock}        label="CB Single"        vA={a?.score_cinebench_single} vB={b?.score_cinebench_single}
               fmt={v => v != null ? Number(v).toFixed(0) : '—'} />
        </div>
      </div>
    </div>
  )
}
