import { Zap, Loader2, AlertCircle, ArrowUpDown } from 'lucide-react'
import SearchableSelect from './SearchableSelect'

/* Presets para que el cliente no parta de un textarea vacío */
const PRESETS = [
  { label: 'Gaming',        text: 'Gaming competitivo a 1080p buscando el máximo de FPS. Priorizo rendimiento single-core y baja latencia sobre número de núcleos.' },
  { label: 'Render 3D',     text: 'Renderizado 3D en Blender y Cinema 4D con escenas pesadas. Cargas altamente paralelas que aprovechan todos los núcleos disponibles.' },
  { label: 'Edición 4K',    text: 'Edición y exportación de video 4K en DaVinci Resolve y Premiere. Necesito potencia multi-core para timelines complejos.' },
  { label: 'Compilación',   text: 'Compilación de proyectos de software grandes (C++/Rust) y contenedores. El tiempo de build escala con los hilos disponibles.' },
  { label: 'Ofimática',     text: 'Uso de oficina, navegación con muchas pestañas y multitarea ligera. Equilibrio entre eficiencia y respuesta del sistema.' },
  { label: 'Streaming',     text: 'Streaming y juego en simultáneo (OBS + título AAA). Requiere buen single-core para el juego y multi-core para codificar.' },
]

const MIN_CTX = 15

export default function InputPanel({ cpus, cpuA, cpuB, setCpuA, setCpuB, contexto, setContexto, loading, error, onAnalizar, onSwap }) {
  const ctxLen   = contexto.trim().length
  const canSwap  = cpuA || cpuB
  const ready    = cpuA && cpuB && cpuA !== cpuB && ctxLen >= MIN_CTX

  /* Mensaje guía de por qué el botón no está listo */
  const hint =
    !cpuA || !cpuB        ? 'Selecciona ambos procesadores'
    : cpuA === cpuB       ? 'Elige dos CPUs diferentes'
    : ctxLen < MIN_CTX    ? 'Describe un poco más tu caso de uso'
    : null

  return (
    <aside className="surface-elevated rounded-2xl p-5 flex flex-col gap-5">

      {/* CPU A */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono"
            style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>A</div>
          <span className="text-[11px] text-white/62 font-medium uppercase tracking-wider">Procesador A</span>
        </div>
        <SearchableSelect options={cpus} value={cpuA} excludeId={cpuB} onChange={setCpuA} disabled={loading} accent="violet" />
      </div>

      {/* Divider con botón intercambiar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <button
          type="button"
          onClick={onSwap}
          disabled={loading || !canSwap}
          aria-label="Intercambiar procesador A y B"
          title="Intercambiar A ↔ B"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
          style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.12)' }}
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-amber-500/70" />
        </button>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* CPU B */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono"
            style={{ background: 'rgba(234,179,8,0.12)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.2)' }}>B</div>
          <span className="text-[11px] text-white/62 font-medium uppercase tracking-wider">Procesador B</span>
        </div>
        <SearchableSelect options={cpus} value={cpuB} excludeId={cpuA} onChange={setCpuB} disabled={loading} accent="amber" />
      </div>

      {/* Contexto */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="contexto" className="text-[11px] text-white/62 font-medium uppercase tracking-wider">
            Contexto de uso
          </label>
          <span className={`text-[10px] font-mono ${ctxLen >= MIN_CTX ? 'text-emerald-400/60' : 'text-white/46'}`}>
            {ctxLen} car.
          </span>
        </div>

        {/* Presets rápidos */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button
              key={p.label}
              type="button"
              className="chip"
              data-active={contexto === p.text}
              disabled={loading}
              onClick={() => setContexto(p.text)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <textarea
          id="contexto"
          rows={4}
          className="w-full rounded-lg px-3.5 py-2.5 text-[13px] text-white/80 placeholder-white/45 outline-none resize-none transition-all duration-200 focus:ring-1 focus:ring-violet-500/30"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          placeholder="¿Para qué usarás el procesador? Toca un preset o descríbelo con tus palabras…"
          value={contexto}
          onChange={e => setContexto(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg p-2.5 text-[12px]"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
          <span className="text-red-300/80 leading-relaxed">{error}</span>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={onAnalizar}
          disabled={loading || !ready}
          className="relative w-full py-3 rounded-xl font-semibold text-[13px] text-white transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
            enabled:active:scale-[0.98] enabled:hover:brightness-110
            flex items-center justify-center gap-2"
          style={{
            background: (loading || !ready) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            boxShadow: (loading || !ready) ? 'none' : '0 4px 24px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin text-white/62" /><span className="text-white/62">Procesando…</span></>
          ) : (
            <><Zap className="w-4 h-4" /> Analizar</>
          )}
        </button>
      </div>
    </aside>
  )
}
