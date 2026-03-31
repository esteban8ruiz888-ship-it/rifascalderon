'use client'

import { useState } from 'react'

interface NumeroAsignado {
  numero: number
}

interface Comprador {
  id: string
  nombre: string
  telefono: string
  cedula: string
  correo: string | null
  creado_en: string
  numeros_asignados: NumeroAsignado[]
}

interface Props {
  compradores: Comprador[]
}

export default function TablaCompradores({ compradores }: Props) {
  const [busqueda, setBusqueda] = useState('')

  const filtrados = compradores.filter((c) => {
    const q = busqueda.toLowerCase()
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.cedula.includes(q) ||
      c.telefono.includes(q) ||
      (c.correo ?? '').toLowerCase().includes(q)
    )
  })

  function handleExportarCSV() {
    window.open('/api/admin/compradores?formato=csv', '_blank')
  }

  return (
    <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-[#E8C97A] font-bold text-lg">
          Compradores ({compradores.length})
        </h2>
        <button
          onClick={handleExportarCSV}
          className="text-sm border border-[rgba(201,168,76,0.3)] text-[#9E8A60] hover:text-[#FAF6EE] px-4 py-2 rounded-lg transition-colors"
        >
          Exportar CSV
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, cédula, teléfono o correo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] text-sm"
      />

      {filtrados.length === 0 ? (
        <p className="text-[#9E8A60] text-sm text-center py-8">
          {compradores.length === 0 ? 'No hay compradores aún.' : 'Sin resultados.'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9E8A60] text-xs uppercase tracking-wider border-b border-[rgba(201,168,76,0.1)]">
                <th className="text-left pb-3 pr-4">Nombre</th>
                <th className="text-left pb-3 pr-4">Teléfono</th>
                <th className="text-left pb-3 pr-4">Cédula</th>
                <th className="text-left pb-3 pr-4">Números</th>
                <th className="text-left pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(201,168,76,0.05)]">
              {filtrados.map((c) => (
                <tr key={c.id} className="hover:bg-[#2C2518]/30 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="text-[#FAF6EE] font-medium">{c.nombre}</p>
                    {c.correo && <p className="text-[#9E8A60] text-xs">{c.correo}</p>}
                  </td>
                  <td className="py-3 pr-4 text-[#FAF6EE]">{c.telefono}</td>
                  <td className="py-3 pr-4 text-[#FAF6EE]">{c.cedula}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {c.numeros_asignados.slice(0, 6).map((n) => (
                        <span
                          key={n.numero}
                          className="bg-[#2C2518] text-[#E8C97A] font-mono text-xs px-1.5 py-0.5 rounded"
                        >
                          {String(n.numero).padStart(4, '0')}
                        </span>
                      ))}
                      {c.numeros_asignados.length > 6 && (
                        <span className="text-[#9E8A60] text-xs">
                          +{c.numeros_asignados.length - 6}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-[#9E8A60] text-xs">
                    {new Date(c.creado_en).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
