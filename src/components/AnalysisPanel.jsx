import { Sparkles, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function AnalysisPanel({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlighted = text?.replace(
    /(Flynn|SISD|SIMD|MISD|MIMD|Amdahl|speedup|paralelismo|latencia|throughput|IPC|CPI|T_ciclo|pipeline|superescalar|out-of-order|caché|cache|branch prediction|peso_single|peso_multi|rendimiento_por_dolar|score_predicho)/gi,
    '<mark>$1</mark>'
  ) ?? ''

  return (
    <div className="surface rounded-2xl p-5 animate-slide-up-2 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/80">Análisis</p>
            <p className="text-[9px] text-white/48 font-mono">Evaluación técnica</p>
          </div>
        </div>
        <button onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-white/52 hover:text-white/68 transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          {copied ? <><Check className="w-2.5 h-2.5 text-emerald-400" /> Copiado</> : <><Copy className="w-2.5 h-2.5" /> Copiar</>}
        </button>
      </div>

      <div className="rounded-xl p-4 max-h-[26rem] overflow-y-auto"
        style={{ background: 'rgba(8,8,15,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
        {text ? (
          <p className="text-[13px] text-white/72 leading-relaxed whitespace-pre-wrap
            [&_mark]:bg-violet-500/15 [&_mark]:text-violet-300 [&_mark]:px-0.5 [&_mark]:rounded [&_mark]:font-medium"
            dangerouslySetInnerHTML={{ __html: highlighted }} />
        ) : (
          <p className="text-white/46 text-xs italic">Sin análisis disponible.</p>
        )}
      </div>
    </div>
  )
}
