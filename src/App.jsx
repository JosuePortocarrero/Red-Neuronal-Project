import { useState, useEffect } from 'react'
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

  /* Cargar catálogo */
  useEffect(() => {
    axios.get(`${API}/cpus`)
      .then(res => {
        const normalizado = res.data.map(cpu => ({
          id:     cpu.id,
          nombre: cpu.cpuName
            ? `${cpu.manufacturer ?? ''} ${cpu.cpuName}`.trim()
            : (cpu.nombre ?? cpu.name ?? cpu.model ?? `CPU #${cpu.id}`),
        }))
        setCpus(normalizado)
      })
      .catch(() => setError('No se pudo conectar al backend. Verifica que FastAPI esté corriendo en localhost:8000.'))
  }, [])

  const handleAnalizar = async () => {
    if (!cpuA || !cpuB)   return setError('Selecciona ambos procesadores.')
    if (cpuA === cpuB)     return setError('Elige dos CPUs diferentes para comparar.')
    if (!contexto.trim())  return setError('Describe tu caso de uso para que la IA pueda analizarlo.')

    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      const { data } = await axios.post(`${API}/predict`, {
        id_cpu_a:        Number(cpuA),
        id_cpu_b:        Number(cpuB),
        contexto_usuario: contexto,
      })
      setResultado(data)
    } catch (e) {
      setError(e.response?.data?.detail ?? 'Error al procesar la predicción. Revisa la consola del backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 bg-[#04060f]" />
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-glow-cyan pointer-events-none" />
      <div className="fixed inset-0 bg-glow-indigo pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-6 items-start">

            {/* Sidebar de configuración */}
            <div className="lg:sticky lg:top-20">
              <InputPanel
                cpus={cpus}
                cpuA={cpuA}
                cpuB={cpuB}
                setCpuA={setCpuA}
                setCpuB={setCpuB}
                contexto={contexto}
                setContexto={setContexto}
                loading={loading}
                error={error}
                onAnalizar={handleAnalizar}
              />
            </div>

            {/* Panel de resultados */}
            <div className="space-y-5">
              {!loading && !resultado && <EmptyState />}
              {loading                 && <LoadingState />}

              {!loading && resultado && (
                <>
                  <VerdictSection  resultado={resultado} />
                  <AnalysisPanel   text={resultado.explicacion_amc} />
                  <TelemetryCharts resultado={resultado} />
                </>
              )}
            </div>
          </div>
        </main>

        <footer className="border-t border-white/4 py-5">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-[10px] text-slate-700 uppercase tracking-widest">
              Oráculo CPU · Predictor Híbrido AMC + IA
            </p>
            <div className="flex items-center gap-2">
              {['Taxonomía de Flynn', 'Ley de Amdahl', 'Gemini 1.5'].map(tag => (
                <span key={tag}
                  className="text-[9px] text-slate-700 px-2 py-0.5 rounded-full border border-white/4">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
