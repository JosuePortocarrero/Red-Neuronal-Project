import { Cpu, BookOpen } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5"
      style={{ background: 'rgba(4,6,15,0.85)', backdropFilter: 'blur(24px)' }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          {/* Chip icon */}
          <div className="relative w-8 h-8 shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 opacity-90" />
            <div className="absolute inset-0 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            {/* Glow */}
            <div className="absolute inset-0 rounded-lg bg-cyan-500/20 blur-md -z-10 scale-150" />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-tight text-gradient-primary leading-none">
              Oráculo CPU
            </h1>
            <p className="text-[10px] text-slate-600 leading-none mt-0.5 tracking-widest uppercase">
              Predictor Arquitectónico · AMC + IA
            </p>
          </div>
        </div>

        {/* Right side badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/6"
          style={{ background: 'rgba(99,102,241,0.06)' }}>
          <BookOpen className="w-3 h-3 text-indigo-400" />
          <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
            Flynn · Amdahl
          </span>
        </div>
      </div>
    </header>
  )
}
