import { Sparkles, Copy, Check } from 'lucide-react'
import { useState } from 'react'

// Términos de Arquitectura de Computadoras a resaltar (modelo v2).
const RE = /(Ley de Amdahl|Amdahl|speedup|eficiencia|fracción paralela|rendimiento relativo|paralelismo|Flynn|SISD|SIMD|MIMD|MISD|T_ciclo|tiempo de ciclo|pipeline|cach[eé]|single-core|multi-core|núcleos?|η)/gi

// Resaltado SEGURO con nodos React (sin dangerouslySetInnerHTML → sin riesgo XSS).
function resaltar(texto) {
  if (!texto) return null
  // split con un único grupo de captura: los términos quedan en los índices impares.
  return texto.split(RE).map((parte, i) =>
    i % 2 === 1
      ? <mark key={i} className="bg-violet-500/15 text-violet-200 px-0.5 rounded font-medium">{parte}</mark>
      : <span key={i}>{parte}</span>
  )
}

export default function AnalysisPanel({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="surface rounded-2xl p-5 animate-slide-up-2 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-white/85">Análisis del profesor</p>
            <p className="text-[10px] text-white/55 font-mono">Amdahl · eficiencia η · rendimiento relativo</p>
          </div>
        </div>
        <button onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-white/60 hover:text-white/80 transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          {copied ? <><Check className="w-2.5 h-2.5 text-emerald-400" /> Copiado</> : <><Copy className="w-2.5 h-2.5" /> Copiar</>}
        </button>
      </div>

      <div className="rounded-xl p-4 max-h-[26rem] overflow-y-auto"
        style={{ background: 'rgba(8,8,15,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
        {text ? (
          <p className="text-[13px] text-white/80 leading-relaxed whitespace-pre-wrap">
            {resaltar(text)}
          </p>
        ) : (
          <p className="text-white/55 text-xs italic">Sin análisis disponible.</p>
        )}
      </div>
    </div>
  )
}
