import { Cpu } from 'lucide-react'

const STATUS = {
  checking: { color: '#eab308', label: 'Conectando…',  pulse: true },
  online:   { color: '#10b981', label: 'Activo', pulse: false },
  offline:  { color: '#ef4444', label: 'Sin conexión',  pulse: false },
}

export default function Header({ apiStatus = 'checking' }) {
  const s = STATUS[apiStatus] ?? STATUS.checking

  return (
    <header className="sticky top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(8,8,15,0.8)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-bold text-brand ">AMC + IA</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tags técnicos */}
          <div className="hidden md:flex items-center gap-1.5">
            {['AMC', 'Flynn', 'Amdahl', 'PyTorch'].map(tag => (
              <span key={tag}
                className="text-[9px] font-mono text-white/55 px-2 py-0.5 rounded border border-white/5">
                {tag}
              </span>
            ))}
          </div>

          {/* Estado del backend */}
          <div className="flex items-center gap-1.5 pl-3 sm:border-l border-white/5"
            title={s.label} aria-label={`Estado del servidor: ${s.label}`}>
            <span className="relative flex w-2 h-2">
              {s.pulse && (
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                  style={{ background: s.color }} />
              )}
              <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: s.color }} />
            </span>
            <span className="hidden sm:inline text-[10px] text-white/60 font-medium">{s.label}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
