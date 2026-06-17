import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Check, Cpu } from 'lucide-react'

export default function SearchableSelect({ options = [], value, onChange, placeholder = 'Buscar procesador...', disabled }) {
  const [query, setQuery]   = useState('')
  const [open, setOpen]     = useState(false)
  const containerRef        = useRef(null)
  const inputRef            = useRef(null)

  const selected = options.find(c => c.id === value)

  const filtered = query.trim()
    ? options.filter(c => c.nombre.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    if (disabled) return
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleSelect = cpu => {
    onChange(cpu.id)
    setQuery('')
    setOpen(false)
  }

  const handleKey = e => {
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef} onKeyDown={handleKey}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200
          ${open
            ? 'border-cyan-500/60 bg-slate-900/80 shadow-[0_0_0_3px_rgba(6,182,212,0.08)]'
            : 'border-white/8 bg-slate-900/50 hover:border-white/15'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
        <span className={`flex-1 text-sm truncate ${selected ? 'text-slate-200' : 'text-slate-500'}`}>
          {selected ? selected.nombre : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden"
          style={{ background: 'rgba(8,12,30,0.97)', backdropFilter: 'blur(24px)' }}>

          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/6">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
              placeholder="Filtrar por nombre..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="text-slate-600 hover:text-slate-400 text-xs"
                onClick={() => setQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-slate-600 text-xs">Sin resultados para</p>
                <p className="text-slate-500 text-sm font-medium mt-0.5">"{query}"</p>
              </div>
            ) : (
              filtered.map(cpu => {
                const isActive = value === cpu.id
                return (
                  <button
                    key={cpu.id}
                    type="button"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                      ${isActive
                        ? 'bg-cyan-950/40 text-cyan-300'
                        : 'text-slate-300 hover:bg-white/4'
                      }`}
                    onMouseDown={e => { e.preventDefault(); handleSelect(cpu) }}
                  >
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                      {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </span>
                    <span className="text-sm">{cpu.nombre}</span>
                  </button>
                )
              })
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-white/6 px-4 py-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-700">{filtered.length} procesadores</span>
            <span className="text-[10px] text-slate-700">ESC para cerrar</span>
          </div>
        </div>
      )}
    </div>
  )
}
