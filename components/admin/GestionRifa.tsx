'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Rifa {
  id: string
  nombre: string
  premio: string
  total_puestos: number
  estado: string
  fecha_sorteo: string | null
}

interface Props {
  rifa: Rifa | null
}

export default function GestionRifa({ rifa }: Props) {
  const router = useRouter()
  const [nombre, setNombre] = useState(rifa?.nombre ?? '')
  const [premio, setPremio] = useState(rifa?.premio ?? '')
  const [totalNumeros, setTotalNumeros] = useState(String(rifa?.total_puestos ?? 10000))
  const [fechaSorteo, setFechaSorteo] = useState(rifa?.fecha_sorteo ? rifa.fecha_sorteo.slice(0, 10) : '')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    setExito('')

    try {
      const res = await fetch('/api/admin/rifa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: rifa?.id,
          nombre: nombre.trim(),
          premio: premio.trim(),
          total_puestos: Number(totalNumeros),
          fecha_sorteo: fechaSorteo || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al guardar')
        return
      }
      setExito(rifa ? 'Rifa actualizada correctamente.' : 'Rifa creada correctamente.')
      router.refresh()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#E8C97A] font-bold text-lg">
          {rifa ? 'Editar rifa' : 'Crear rifa'}
        </h2>
        {rifa && (
          <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 font-semibold">
            {rifa.estado}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
            Nombre de la rifa
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Rifa de Mayo 2026"
            required
            className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] text-sm"
          />
        </div>

        <div>
          <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
            Premio
          </label>
          <input
            type="text"
            value={premio}
            onChange={(e) => setPremio(e.target.value)}
            placeholder="Ej. iPhone 16 Pro"
            required
            className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] text-sm"
          />
        </div>

        <div>
          <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
            Total de números
          </label>
          <input
            type="number"
            value={totalNumeros}
            onChange={(e) => setTotalNumeros(e.target.value)}
            min={1}
            required
            className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] text-sm"
          />
        </div>

        <div>
          <label className="block text-[#9E8A60] text-xs uppercase tracking-wider mb-1">
            Fecha del sorteo
          </label>
          <input
            type="date"
            value={fechaSorteo}
            onChange={(e) => setFechaSorteo(e.target.value)}
            className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] focus:outline-none focus:border-[#C9A84C] text-sm"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {exito && (
          <p className="text-green-400 text-sm bg-green-900/20 border border-green-900/30 rounded-lg px-4 py-3">
            {exito}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-[#C9A84C] hover:bg-[#E8C97A] disabled:opacity-50 text-[#0E0C08] font-bold py-2.5 rounded-lg transition-colors text-sm"
        >
          {cargando ? 'Guardando...' : rifa ? 'Guardar cambios' : 'Crear rifa'}
        </button>
      </form>
    </div>
  )
}
