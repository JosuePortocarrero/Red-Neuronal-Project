import { Cpu } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-white/6">

      {/* Animated icon */}
      <div className="relative animate-float">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(8,12,28,0.9)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <Cpu className="w-7 h-7 text-slate-600" />
        </div>
        {/* Corner dots — chip pins */}
        {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full border border-slate-700 bg-slate-900`} />
        ))}
        {/* Side pins */}
        {['-left-3 top-1/2 -translate-y-1/2', '-right-3 top-1/2 -translate-y-1/2'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} flex flex-col gap-1`}>
            {[0,1,2].map(j => (
              <div key={j} className="w-1.5 h-0.5 rounded-full bg-slate-700" />
            ))}
          </div>
        ))}
      </div>

      <div className="text-center space-y-1.5">
        <p className="text-slate-400 text-sm font-medium">Configura la comparación</p>
        <p className="text-slate-700 text-xs max-w-xs leading-relaxed">
          Selecciona dos procesadores, describe tu caso de uso y el modelo híbrido AMC + IA generará el veredicto.
        </p>
      </div>

      {/* Steps hint */}
      <div className="flex items-center gap-3">
        {['Elige CPUs', 'Describe uso', 'Analiza'].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                {i + 1}
              </span>
              <span className="text-[10px] text-slate-600">{step}</span>
            </div>
            {i < 2 && <div className="w-3 h-px bg-slate-800" />}
          </div>
        ))}
      </div>
    </div>
  )
}
