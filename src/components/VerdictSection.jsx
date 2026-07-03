import { Trophy, Zap, TrendingUp, Gauge, Layers, Activity, Scale } from 'lucide-react'

function Bar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="h-1 rounded-full overflow-hidden bg-white/[0.04] mt-1">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function Row({ icon: Icon, label, vA, vB, higherBetter = true, fmt, highlight = false }) {
  const a = parseFloat(vA) || 0, b = parseFloat(vB) || 0
  const aW = higherBetter ? a > b : a < b
  const bW = higherBetter ? b > a : b < a
  const f  = fmt ?? (v => v != null ? Number(v).toFixed(2) : '—')
  const m  = Math.max(a, b)
  return (
    <div className={`grid grid-cols-[1fr,108px,1fr] gap-2 items-center py-1.5 border-b border-white/[0.04] last:border-0 ${highlight ? 'bg-violet-500/[0.04] rounded-lg px-1' : ''}`}>
      <div className="text-right">
        <span className={`text-[13px] font-semibold score ${aW ? 'text-violet-300' : 'text-white/60'}`}>{f(vA)}</span>
        <Bar value={a} max={m} color={aW ? '#a855f7' : 'rgba(255,255,255,0.08)'} />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <Icon className={`w-3.5 h-3.5 ${highlight ? 'text-violet-300' : 'text-white/55'}`} />
        <span className="text-[9px] text-white/60 uppercase tracking-wider text-center leading-tight">{label}</span>
      </div>
      <div>
        <span className={`text-[13px] font-semibold score ${bW ? 'text-amber-300' : 'text-white/60'}`}>{f(vB)}</span>
        <Bar value={b} max={m} color={bW ? '#eab308' : 'rgba(255,255,255,0.08)'} />
      </div>
    </div>
  )
}

export default function VerdictSection({ resultado }) {
  const { veredicto, telemetria } = resultado
  const a = telemetria?.cpu_a
  const b = telemetria?.cpu_b
  const empate = veredicto?.empate_practico
  const aWins = !empate && veredicto?.ganador === a?.nombre
  const bWins = !empate && veredicto?.ganador === b?.nombre

  const n = veredicto?.rendimiento_relativo
  const P = veredicto?.fraccion_paralela ?? a?.fraccion_paralela ?? 0
  const pctParalelo = Math.round(P * 100)
  const lecturaP = P < 0.3 ? 'mayormente serial · manda el single-core'
    : P > 0.7 ? 'muy paralela · mandan los núcleos'
    : 'equilibrada · pesan single y multi'

  return (
    <div className="animate-slide-up space-y-4">

      {/* Banner: empate práctico o ganador */}
      {empate ? (
        <div className="surface-elevated rounded-2xl p-5 flex items-center gap-4" style={{ border: '1px solid rgba(56,189,248,0.25)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)' }}>
            <Scale className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/60 uppercase tracking-[0.15em] mb-1">Empate práctico · para tu carga</p>
            <p className="text-[13px] font-semibold text-white/90 leading-snug">
              Ambos rinden casi igual — no vale la pena cambiar.
            </p>
          </div>
          <div className="text-right shrink-0 pl-3">
            <p className="text-[10px] text-white/55 uppercase tracking-wider">Diferencia</p>
            <p className="text-lg font-bold score text-sky-300">{n != null ? `${Number(n).toFixed(2)}×` : '—'}</p>
            <p className="text-[9px] text-white/50">imperceptible</p>
          </div>
        </div>
      ) : (
        <div className="surface-elevated winner-glow rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(168,85,247,0.15))', border: '1px solid rgba(234,179,8,0.2)' }}>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/60 uppercase tracking-[0.15em] mb-1">Veredicto · para tu carga</p>
            <p className="text-base font-bold text-winner truncate">
              {veredicto?.fabricante_ganador} {veredicto?.ganador}
            </p>
          </div>
          <div className="text-right shrink-0 pl-3">
            <p className="text-[10px] text-white/55 uppercase tracking-wider">Rinde</p>
            <p className="text-xl font-bold score text-emerald-400">{n != null ? `${Number(n).toFixed(2)}×` : '—'}</p>
            <p className="text-[9px] text-white/50">más rápido</p>
          </div>
        </div>
      )}

      {/* Workload (P) chip */}
      <div className="surface rounded-xl px-4 py-2.5 flex items-center gap-3">
        <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="text-[11px] text-white/65">
          <span className="font-semibold text-sky-300">{pctParalelo}% paralela</span>
          <span className="text-white/60"> · {lecturaP}</span>
          <span className="text-white/40"> (P={Number(P).toFixed(2)})</span>
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pctParalelo}%`, background: 'linear-gradient(90deg,#38bdf8,#a855f7)' }} />
        </div>
      </div>

      {/* Comparison card */}
      <div className="surface rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-[1fr,108px,1fr] gap-2 items-center">
          <div className={`rounded-xl p-3 text-center ${aWins ? 'winner-glow' : ''}`}
            style={{ background: aWins ? 'rgba(168,85,247,0.06)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {aWins && <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />}
            <div className="text-[10px] font-mono font-bold mb-1" style={{ color: '#c084fc' }}>CPU — A</div>
            <p className="text-[12px] font-semibold text-white/90 leading-tight">{a?.fabricante} {a?.nombre}</p>
            <p className="text-[10px] text-white/55 font-mono mt-0.5">{a?.cores}C/{a?.threads}T · {a?.baseClock}GHz</p>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-[11px] font-black text-white/50">VS</span>
          </div>

          <div className={`rounded-xl p-3 text-center ${bWins ? 'winner-glow' : ''}`}
            style={{ background: bWins ? 'rgba(234,179,8,0.04)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {bWins && <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />}
            <div className="text-[10px] font-mono font-bold mb-1" style={{ color: '#fbbf24' }}>CPU — B</div>
            <p className="text-[12px] font-semibold text-white/90 leading-tight">{b?.fabricante} {b?.nombre}</p>
            <p className="text-[10px] text-white/55 font-mono mt-0.5">{b?.cores}C/{b?.threads}T · {b?.baseClock}GHz</p>
          </div>
        </div>

        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.015)' }}>
          <Row icon={Zap}        label="Rendimiento"     vA={a?.score_predicho}        vB={b?.score_predicho} />
          <Row icon={Gauge}      label="Eficiencia η"    vA={a?.eta}                   vB={b?.eta}                   highlight
               fmt={v => v != null ? Number(v).toFixed(3) : '—'} />
          <Row icon={TrendingUp} label="Speedup Amdahl"  vA={a?.amdahl_speedup}        vB={b?.amdahl_speedup}
               fmt={v => v != null ? `${Number(v).toFixed(2)}×` : '—'} />
          <Row icon={Layers}     label="CB Multi (real)" vA={a?.score_cinebench_multi} vB={b?.score_cinebench_multi}
               fmt={v => v != null ? Number(v).toLocaleString() : '—'} />
        </div>
        <p className="text-[10px] text-white/45 text-center leading-snug">
          η = eficiencia de escalado real estimada por la red (Amdahl ideal = 1.00). El ganador se decide por el rendimiento corregido para tu situación.
        </p>
      </div>
    </div>
  )
}
