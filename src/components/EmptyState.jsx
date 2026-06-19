import { Cpu } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="surface rounded-2xl h-full min-h-[535px] flex flex-col items-center justify-center gap-8 px-6">

      {/* Chip illustration */}
      <div className="relative animate-float">
        <div className="w-28 h-28 rounded-3xl flex items-center justify-center"
          style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.18)' }}>
          <Cpu className="w-12 h-12 text-violet-400/70" />
        </div>

        {/* Circuit lines */}
        {[
          'w-8 h-px -left-10 top-1/3',
          'w-8 h-px -left-10 top-2/3',
          'w-8 h-px -right-10 top-1/3',
          'w-8 h-px -right-10 top-2/3',
          'h-8 w-px top-[-38px] left-1/3',
          'h-8 w-px top-[-38px] left-2/3',
          'h-8 w-px bottom-[-38px] left-1/3',
          'h-8 w-px bottom-[-38px] left-2/3',
        ].map((pos, i) => (
          <div key={i} className={`absolute ${pos}`}
            style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.3), transparent)' }} />
        ))}

        {/* Corner nodes */}
        {['top-[-42px] left-1/3', 'top-[-42px] left-2/3', 'bottom-[-42px] left-1/3', 'bottom-[-42px] left-2/3',
          '-left-[42px] top-1/3', '-left-[42px] top-2/3', '-right-[42px] top-1/3', '-right-[42px] top-2/3'
        ].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full`}
            style={{ background: 'rgba(168,85,247,0.45)' }} />
        ))}
      </div>

      <div className="mt-5 text-center space-y-3 max-w-md">
        <p className="text-white/90 text-xl font-semibold">Configura la comparación</p>
        <p className="text-white/55 text-sm leading-relaxed">
          Selecciona dos procesadores y describe tu carga de trabajo.
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {[
          { n: '1', t: 'Elige CPUs' },
          { n: '2', t: 'Describe el uso' },
          { n: '3', t: 'Resultados' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-mono"
                style={{ background: 'rgba(168,85,247,0.18)', color: '#c4b5fd', border: '1px solid rgba(168,85,247,0.3)' }}>
                {s.n}
              </span>
              <span className="text-[13px] text-white/55">{s.t}</span>
            </div>
            {i < 2 && <div className="w-6 h-px bg-white/[0.1]" />}
          </div>
        ))}
      </div>
    </div>
  )
}
