import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown, Check, Cpu } from 'lucide-react'

const ACCENTS = {
  violet: { ring: 'ring-violet-500/40', soft: 'rgba(168,85,247,0.15)', icon: 'text-violet-400', sel: 'bg-violet-500/10 text-violet-300', mark: 'text-violet-400' },
  amber:  { ring: 'ring-amber-500/40',  soft: 'rgba(234,179,8,0.15)',  icon: 'text-amber-400',  sel: 'bg-amber-500/10 text-amber-300',  mark: 'text-amber-400' },
}

/* Resalta la parte del nombre que coincide con la búsqueda */
function Highlight({ text, query, markClass }) {
  if (!query) return text
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <span className={`font-semibold ${markClass}`}>{text.slice(i, i + query.length)}</span>
      {text.slice(i + query.length)}
    </>
  )
}

export default function SearchableSelect({ options = [], value, excludeId, onChange, placeholder = 'Buscar procesador…', disabled, accent = 'violet' }) {
  const [query, setQuery] = useState('')
  const [open, setOpen]   = useState(false)
  const [hi, setHi]       = useState(0)   // índice resaltado para teclado
  const ref               = useRef(null)
  const inputRef          = useRef(null)
  const listRef           = useRef(null)
  const a = ACCENTS[accent] ?? ACCENTS.violet

  const selected = options.find(c => c.id === value)

  const filtered = useMemo(() => {
    const base = options.filter(c => c.id !== excludeId)
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter(c => c.nombre.toLowerCase().includes(q))
  }, [options, excludeId, query])

  /* Cerrar al hacer clic fuera */
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  /* Reset del resaltado al filtrar */
  useEffect(() => { setHi(0) }, [query, open])

  /* Mantener visible el item resaltado */
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector(`[data-idx="${hi}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [hi, open])

  const choose = cpu => { onChange(cpu.id); setQuery(''); setOpen(false) }

  const onKeyDown = e => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[hi]) choose(filtered[hi]) }
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => { if (!disabled) { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 30) } }}
        className={`group w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-left transition-all duration-200
          ${open ? `ring-1 ${a.ring} bg-base-50` : 'bg-white/[0.03] hover:bg-white/[0.05]'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          border border-white/[0.06]`}
      >
        <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
          style={{ background: selected ? a.soft : 'rgba(255,255,255,0.04)' }}>
          <Cpu className={`w-3 h-3 ${selected ? a.icon : 'text-white/50'}`} />
        </div>
        <span className={`flex-1 text-[13px] truncate ${selected ? 'text-white/90' : 'text-white/55'}`}>
          {selected ? selected.nombre : placeholder}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl overflow-hidden shadow-2xl shadow-black/60 animate-fade-in"
          style={{ background: 'rgba(14,14,24,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>

          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.05]">
            <Search className={`w-3 h-3 ${a.icon} shrink-0`} />
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-[13px] text-white/80 placeholder-white/45 outline-none focus:outline-none focus-visible:outline-none"
              placeholder="Filtrar por nombre…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <span className="text-[9px] text-white/46 font-mono hidden sm:inline">↑↓ Enter</span>
          </div>

          <div ref={listRef} className="max-h-56 overflow-y-auto py-0.5" role="listbox">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-center text-white/52 text-xs">
                Sin resultados para <span className={a.mark}>"{query}"</span>
              </p>
            ) : (
              filtered.map((cpu, idx) => {
                const active = value === cpu.id
                const focused = idx === hi
                return (
                  <button
                    key={cpu.id}
                    type="button"
                    data-idx={idx}
                    role="option"
                    aria-selected={active}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left transition-colors
                      ${active ? a.sel : focused ? 'bg-white/[0.06] text-white/90' : 'text-white/75 hover:bg-white/[0.04] hover:text-white/80'}`}
                    onMouseEnter={() => setHi(idx)}
                    onMouseDown={e => { e.preventDefault(); choose(cpu) }}
                  >
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                      {active && <Check className={`w-3 h-3 ${a.icon}`} />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] truncate">
                        <Highlight text={cpu.nombre} query={query} markClass={a.mark} />
                      </span>
                      {(cpu.cores || cpu.tipo) && (
                        <span className="block text-[10px] text-white/52 font-mono truncate">
                          {cpu.cores ? `${cpu.cores}C / ${cpu.threads}T` : ''}{cpu.tipo ? ` · ${cpu.tipo}` : ''}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })
            )}
          </div>

          <div className="border-t border-white/[0.05] px-3.5 py-1.5 flex justify-between">
            <span className="text-[10px] text-white/46 font-mono">{filtered.length} cpus</span>
            <span className="text-[10px] text-white/46 font-mono">ESC cerrar</span>
          </div>
        </div>
      )}
    </div>
  )
}
