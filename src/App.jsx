import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import Header          from './components/Header'
import InputPanel      from './components/InputPanel'
import EmptyState      from './components/EmptyState'
import LoadingState    from './components/LoadingState'
import VerdictSection  from './components/VerdictSection'
import AnalysisPanel   from './components/AnalysisPanel'
import TelemetryCharts from './components/TelemetryCharts'

const API = 'http://localhost:8000/api'

export default function App() {
  const [cpus,      setCpus]      = useState([])
  const [cpuA,      setCpuA]      = useState('')
  const [cpuB,      setCpuB]      = useState('')
  const [contexto,  setContexto]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error,     setError]     = useState(null)
  const [apiStatus, setApiStatus] = useState('checking') // checking | online | offline

  const resultsRef = useRef(null)

  /* ── Cargar catálogo + estado del backend ─────────────────────── */
  useEffect(() => {
    axios.get(`${API}/cpus`)
      .then(res => {
        const normalizado = res.data.map(cpu => ({
          id:         cpu.id,
          nombre:     cpu.cpuName
            ? `${cpu.manufacturer ?? ''} ${cpu.cpuName}`.trim()
            : (cpu.nombre ?? cpu.name ?? `CPU #${cpu.id}`),
          fabricante: cpu.manufacturer ?? '',
          cores:      cpu.cores,
          threads:    cpu.threads,
          tipo:       cpu.type ?? '',
        }))
        setCpus(normalizado)
        setApiStatus('online')
      })
      .catch(() => {
        setApiStatus('offline')
        setError('No se pudo conectar al backend. Verifica que FastAPI esté corriendo en localhost:8000.')
      })
  }, [])

  /* ── Auto-scroll a resultados cuando llegan ───────────────────── */
  useEffect(() => {
    if (resultado && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [resultado])

  const handleAnalizar = async () => {
    if (!cpuA || !cpuB)   return setError('Selecciona ambos procesadores.')
    if (cpuA === cpuB)     return setError('Elige dos CPUs diferentes.')
    if (!contexto.trim())  return setError('Describe tu caso de uso.')

    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      const { data } = await axios.post(`${API}/predict`, {
        id_cpu_a:         Number(cpuA),
        id_cpu_b:         Number(cpuB),
        contexto_usuario: contexto,
      })
      setResultado(data)
    } catch (e) {
      setError(e.response?.data?.detail ?? 'Error al procesar la predicción.')
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = () => {
    setCpuA(cpuB)
    setCpuB(cpuA)
  }

  const handleReset = () => {
    setResultado(null)
    setError(null)
  }

  return (
    <div className="min-h-screen relative">
      <div className="app-bg" />

      {/* Región para lectores de pantalla */}
      <div aria-live="polite" className="sr-only">
        {loading ? 'Analizando arquitectura, por favor espera.'
          : resultado ? `Veredicto listo. Ganador: ${resultado.veredicto?.ganador}.`
          : ''}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header apiStatus={apiStatus} />

        <main className="flex-1 max-w-[1680px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[340px,1fr] gap-6 items-start">

            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-4">
              <InputPanel
                cpus={cpus} cpuA={cpuA} cpuB={cpuB} setCpuA={setCpuA} setCpuB={setCpuB}
                contexto={contexto} setContexto={setContexto}
                loading={loading} error={error} onAnalizar={handleAnalizar}
                onSwap={handleSwap}
              />
            </div>

            <div className="space-y-4" ref={resultsRef}>
              {!loading && !resultado && <EmptyState />}
              {loading                 && <LoadingState />}
              {!loading && resultado   && (
                <>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">
                      Resultado
                    </span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[11px] text-white/58 hover:text-violet-300 transition-colors px-2 py-1 rounded"
                    >
                      ← Nueva comparación
                    </button>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
                    <VerdictSection resultado={resultado} />
                    <AnalysisPanel  text={resultado.explicacion_amc} />
                  </div>
                  <TelemetryCharts resultado={resultado} />
                </>
              )}
            </div>
          </div>
        </main>

        <footer className="border-t border-white/[0.03] py-4 mt-auto">
          <p className="text-center text-[9px] text-white/42 font-mono tracking-widest uppercase">
               AMC + PyTorch + Gemini · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  )
}
