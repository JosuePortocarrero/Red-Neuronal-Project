import { useEffect, useState } from 'react'

const PHASES = [
  'Extrayendo datos de la base…',
  'Gemini asignando pesos (Flynn)…',
  'Estimando precios MSRP…',
  'Red neuronal prediciendo score…',
  'Calculando Amdahl Speedup…',
  'Generando explicación académica…',
]

export default function LoadingState() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p < PHASES.length - 1 ? p + 1 : p)), 1100)
    return () => clearInterval(t)
  }, [])

  const pct = Math.round(((phase + 1) / PHASES.length) * 100)

  return (
    <div className="min-h-[420px] flex flex-col items-center justify-center gap-8 rounded-2xl"
      style={{ background: 'rgba(14,14,22,0.4)', border: '1px dashed rgba(168,85,247,0.12)' }}>

      {/* Pulsing orb */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }} />
        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
          {/* Mini grid cores */}
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i}
                className="w-2 h-2 rounded-sm transition-all duration-700"
                style={{
                  background: i <= phase * 1.5
                    ? 'rgba(168,85,247,0.6)'
                    : 'rgba(255,255,255,0.04)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Phase text */}
      <div className="text-center space-y-1">
        <p className="text-white/80 text-sm font-medium">{PHASES[phase]}</p>
        <p className="text-white/46 text-[10px] font-mono">fase {phase + 1} / {PHASES.length}</p>
      </div>

      {/* Progress */}
      <div className="w-48 space-y-1.5">
        <div className="h-0.5 rounded-full overflow-hidden bg-white/[0.04]">
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
              boxShadow: '0 0 12px rgba(168,85,247,0.5)',
            }} />
        </div>
        <p className="text-center text-[10px] text-white/46 font-mono">{pct}%</p>
      </div>
    </div>
  )
}
