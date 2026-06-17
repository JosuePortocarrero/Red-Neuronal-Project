import { Sparkles, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function AnalysisPanel({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* Detect and highlight key academic terms */
  const highlighted = text?.replace(
    /(Flynn|SISD|SIMD|MISD|MIMD|Amdahl|speedup|paralelismo|latencia|throughput|IPC|CPI|T_ciclo|pipeline|superescalar|out-of-order|caché|cache|branch prediction|peso_single|peso_multi|rendimiento_por_dolar|score_predicho)/gi,
    '<mark>$1</mark>'
  ) ?? ''

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 12px rgba(124,58,237,0.3)' }}>
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 leading-none">Análisis del Oráculo</p>
            <p className="text-[10px] text-slate-600 leading-none mt-0.5">Generado por Gemini 1.5 Pro</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200
            text-slate-500 hover:text-slate-300 border border-white/5 hover:border-white/10"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          {copied
            ? <><Check className="w-3 h-3 text-emerald-400" /> Copiado</>
            : <><Copy className="w-3 h-3" /> Copiar</>
          }
        </button>
      </div>

      {/* Analysis text */}
      <div
        className="rounded-xl p-5 text-sm text-slate-400 leading-relaxed overflow-y-auto max-h-72"
        style={{ background: 'rgba(8,12,28,0.6)', border: '1px solid rgba(99,102,241,0.1)' }}
      >
        {text ? (
          <p
            className="whitespace-pre-wrap [&_mark]:bg-indigo-500/15 [&_mark]:text-indigo-300 [&_mark]:px-0.5 [&_mark]:rounded"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        ) : (
          <p className="text-slate-600 text-xs italic">Sin análisis disponible.</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] text-slate-600">
          Taxonomía de Flynn · Ley de Amdahl aplicados al contexto de uso
        </span>
      </div>
    </div>
  )
}
