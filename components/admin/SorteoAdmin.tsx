'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  rifaId: string
  rifaEstado: string
}

interface Ganador {
  nombre: string
  cedula: string
  telefono: string
  numero_ganador: string
}

export default function SorteoAdmin({ rifaId, rifaEstado }: Props) {
  const router = useRouter()
  const [resultadoLoteria, setResultadoLoteria] = useState('')
  const [cargandoCerrar, setCargandoCerrar] = useState(false)
  const [cargandoGanador, setCargandoGanador] = useState(false)
  const [error, setError] = useState('')
  const [ganador, setGanador] = useState<Ganador | null>(null)
  const [rifaCerrada, setRifaCerrada] = useState(rifaEstado === 'cerrada')

  async function handleCerrarRifa() {
    if (!confirm('¿Cerrar la rifa? No se aceptarán más participaciones.')) return
    setCargandoCerrar(true)
    setError('')
    try {
      const res = await fetch('/api/admin/cerrar-rifa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rifa_id: rifaId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Error al cerrar la rifa')
        return
      }
      setRifaCerrada(true)
      router.refresh()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargandoCerrar(false)
    }
  }

  async function handleRegistrarGanador() {
    if (!resultadoLoteria.trim()) {
      setError('Ingresa el resultado de la lotería.')
      return
    }
    setCargandoGanador(true)
    setError('')
    try {
      const res = await fetch('/api/admin/registrar-ganador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rifa_id: rifaId, resultado_loteria: resultadoLoteria.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al registrar el ganador')
        return
      }
      setGanador(data)
      router.refresh()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargandoGanador(false)
    }
  }

  return (
    <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-5 space-y-4">
      <h2 className="text-[#E8C97A] font-bold text-lg">Gestión del sorteo</h2>

      {!rifaCerrada && (
        <div className="space-y-2">
          <p className="text-[#9E8A60] text-sm">
            Cierra la rifa cuando ya no quieras recibir más participaciones.
          </p>
          <button
            onClick={handleCerrarRifa}
            disabled={cargandoCerrar}
            className="w-full border border-red-800/50 text-red-400 hover:bg-red-900/20 disabled:opacity-50 font-semibold py-3 rounded-lg text-sm transition-colors"
          >
            {cargandoCerrar ? 'Cerrando...' : 'Cerrar rifa'}
          </button>
        </div>
      )}

      {rifaCerrada && !ganador && (
        <div className="space-y-3">
          <div className="bg-[#2C2518]/60 border border-[rgba(201,168,76,0.15)] rounded-lg px-4 py-3">
            <p className="text-[#E8C97A] text-sm font-semibold">Rifa cerrada</p>
            <p className="text-[#9E8A60] text-xs mt-1">Ingresa el resultado de la lotería para registrar el ganador.</p>
          </div>
          <div>
            <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
              Resultado lotería (4 dígitos)
            </label>
            <input
              value={resultadoLoteria}
              onChange={(e) => { setResultadoLoteria(e.target.value); setError('') }}
              placeholder="0000"
              maxLength={4}
              className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] font-mono text-2xl text-center tracking-widest"
            />
          </div>
          <button
            onClick={handleRegistrarGanador}
            disabled={cargandoGanador}
            className="w-full bg-[#C9A84C] hover:bg-[#E8C97A] disabled:opacity-50 text-[#0E0C08] font-bold py-3 rounded-lg transition-colors"
          >
            {cargandoGanador ? 'Registrando...' : 'Registrar ganador'}
          </button>
        </div>
      )}

      {ganador && (
        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/40 rounded-lg p-4 space-y-2">
          <p className="text-[#E8C97A] font-bold text-center">🏆 Ganador registrado</p>
          <div className="text-sm space-y-1">
            <p className="text-[#FAF6EE]"><span className="text-[#9E8A60]">Nombre:</span> {ganador.nombre}</p>
            <p className="text-[#FAF6EE]"><span className="text-[#9E8A60]">Cédula:</span> {ganador.cedula}</p>
            <p className="text-[#FAF6EE]"><span className="text-[#9E8A60]">Teléfono:</span> {ganador.telefono}</p>
            <p className="text-[#FAF6EE]">
              <span className="text-[#9E8A60]">Número ganador:</span>{' '}
              <span className="font-mono font-bold text-[#E8C97A] text-lg">{ganador.numero_ganador}</span>
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
    </div>
  )
}
