import { Zap, Loader2, AlertCircle, SlidersHorizontal } from 'lucide-react'
import SearchableSelect from './SearchableSelect'

export default function InputPanel({ cpus, cpuA, cpuB, setCpuA, setCpuB, contexto, setContexto, loading, error, onAnalizar }) {
  return (
    <aside className="glass-card rounded-2xl p-6 flex flex-col gap-5">

      {/* Panel header */}
      <div className="flex items-center gap-2 pb-1 border-b border-white/5">
        <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Configurar Análisis
        </span>
      </div>

      {/* CPU A */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-[10px] font-bold text-cyan-400">A</span>
          <label className="text-xs text-slate-400 font-medium">Contendiente A</label>
        </div>
        <SearchableSelect
          options={cpus}
          value={cpuA}
          onChange={setCpuA}
          placeholder="Buscar procesador..."
          disabled={loading}
        />
      </div>

      {/* VS Divider */}
      <div className="flex items-center gap-3 -my-1">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.2))' }} />
        <div className="w-7 h-7 rounded-full border border-white/8 flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.08)' }}>
          <span className="text-[9px] font-black text-slate-500 tracking-widest">VS</span>
        </div>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(99,102,241,0.2))' }} />
      </div>

      {/* CPU B */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-[10px] font-bold text-indigo-400">B</span>
          <label className="text-xs text-slate-400 font-medium">Contendiente B</label>
        </div>
        <SearchableSelect
          options={cpus}
          value={cpuB}
          onChange={setCpuB}
          placeholder="Buscar procesador..."
          disabled={loading}
        />
      </div>

      {/* Contexto */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Contexto de Uso
        </label>
        <textarea
          rows={5}
          className="input-field resize-none"
          placeholder="Describe tu caso: ¿Renderizado 3D? ¿Gaming competitivo? ¿Compilación masiva? ¿Streaming + edición simultánea? Cuanto más detallado, más preciso el veredicto..."
          value={contexto}
          onChange={e => setContexto(e.target.value)}
          disabled={loading}
        />
        <p className="text-[10px] text-slate-600 leading-relaxed">
          La IA analiza tu carga de trabajo usando la Taxonomía de Flynn y la Ley de Amdahl.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl p-3 text-xs"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
          <span className="text-red-300 leading-relaxed">{error}</span>
        </div>
      )}

      {/* CTA Button */}
      <button
        type="button"
        onClick={onAnalizar}
        disabled={loading}
        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2.5 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analizando arquitectura…</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Analizar Arquitectura</span>
          </>
        )}
        {/* Shimmer overlay on button */}
        {!loading && (
          <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none" />
        )}
      </button>
    </aside>
  )
}
