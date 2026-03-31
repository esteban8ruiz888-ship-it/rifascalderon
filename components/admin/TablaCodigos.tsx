'use client'

interface Comprador {
  nombre: string
  telefono: string
  cedula: string
}

interface Codigo {
  id: string
  codigo: string
  cantidad: number
  combo: string
  usado: boolean
  creado_en: string
  compradores: Comprador | null
}

interface Props {
  codigos: Codigo[]
}

export default function TablaCodigos({ codigos }: Props) {
  if (codigos.length === 0) {
    return (
      <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-5">
        <h2 className="text-[#E8C97A] font-bold text-lg mb-4">Últimos 20 códigos</h2>
        <p className="text-[#9E8A60] text-sm text-center py-8">No hay códigos generados aún.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-5">
      <h2 className="text-[#E8C97A] font-bold text-lg mb-4">Últimos 20 códigos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#9E8A60] text-xs uppercase tracking-wider border-b border-[rgba(201,168,76,0.1)]">
              <th className="text-left pb-3 pr-4">Código</th>
              <th className="text-left pb-3 pr-4">Combo</th>
              <th className="text-left pb-3 pr-4">Estado</th>
              <th className="text-left pb-3 pr-4">Comprador</th>
              <th className="text-left pb-3">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(201,168,76,0.05)]">
            {codigos.map((c) => (
              <tr key={c.id} className="hover:bg-[#2C2518]/30 transition-colors">
                <td className="py-3 pr-4">
                  <span className="font-mono text-[#E8C97A] font-semibold">{c.codigo}</span>
                </td>
                <td className="py-3 pr-4 text-[#FAF6EE]">{c.combo} — {c.cantidad} núm.</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      c.usado
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}
                  >
                    {c.usado ? 'Usado' : 'Pendiente'}
                  </span>
                </td>
                <td className="py-3 pr-4 text-[#FAF6EE]">
                  {c.compradores ? (
                    <div>
                      <p className="font-medium">{c.compradores.nombre}</p>
                      <p className="text-[#9E8A60] text-xs">{c.compradores.telefono}</p>
                    </div>
                  ) : (
                    <span className="text-[#9E8A60]">—</span>
                  )}
                </td>
                <td className="py-3 text-[#9E8A60] text-xs">
                  {new Date(c.creado_en).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
