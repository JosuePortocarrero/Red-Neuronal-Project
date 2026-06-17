import { useEffect, useState } from 'react'

const STEPS = [
  { label: 'Extrayendo parámetros AMC…',        pct: 15 },
  { label: 'Aplicando Taxonomía de Flynn…',      pct: 35 },
  { label: 'Calculando Ley de Amdahl…',          pct: 55 },
  { label: 'Consultando modelo Gemini IA…',      pct: 75 },
  { label: 'Generando análisis arquitectónico…', pct: 90 },
]

export default function LoadingState() {
  const [step, setStep] = useState(0)
  const [pct, setPct]   = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => {
        const next = s < STEPS.length - 1 ? s + 1 : s
        setPct(STEPS[next].pct)
        return next
      })
    }, 900)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => { setPct(STEPS[0].pct) }, [])

  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-8 rounded-2xl border border-white/5"
      style={{ background: 'rgba(8,12,28,0.5)' }}>

      {/* Spinning chip */}
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/20 animate-spin-slow" />
        {/* Inner card */}
        <div className="absolute inset-2 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
          {/* 3x3 grid — chip cores */}
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i}
                className="w-2 h-2 rounded-[2px] transition-all duration-500"
                style={{
                  background: i <= step * 1.5
                    ? 'rgba(6,182,212,0.7)'
                    : 'rgba(99,102,241,0.15)',
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl animate-glow-pulse pointer-events-none" />
      </div>

      {/* Step label */}
      <div className="text-center space-y-2">
        <p className="text-sm text-slate-300 font-medium transition-all duration-500">
          {STEPS[step].label}
        </p>
        <p className="text-xs text-slate-600">Modelo Híbrido AMC + Gemini 1.5</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 space-y-2">
        <div className="h-1 rounded-full overflow-hidden bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #0891b2, #6366f1)',
              boxShadow: '0 0 12px rgba(6,182,212,0.6)',
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-700">Procesando…</span>
          <span className="text-[10px] text-slate-600 score-badge">{pct}%</span>
        </div>
      </div>
    </div>
  )
}
