'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  rifaId: string
  whatsappNumber: string
}

const COMBOS = [
  { cantidad: 10, precio: '$15.000', label: 'x10' },
  { cantidad: 20, precio: '$30.000', label: 'x20' },
  { cantidad: 40, precio: '$60.000', label: 'x40' },
]

export default function GeneradorCodigos({ rifaId, whatsappNumber }: Props) {
  const router = useRouter()
  const [comboSeleccionado, setComboSeleccionado] = useState(COMBOS[0])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  async function handleGenerar() {
    setCargando(true)
    setError('')
    setCodigoGenerado(null)
    try {
      const res = await fetch('/api/admin/generar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rifa_id: rifaId,
          cantidad: comboSeleccionado.cantidad,
          combo: comboSeleccionado.label,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al generar el código')
        return
      }
      setCodigoGenerado(data.codigo)
      router.refresh()
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  async function handleCopiar() {
    if (!codigoGenerado) return
    await navigator.clipboard.writeText(codigoGenerado)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const mensajeWhatsApp = codigoGenerado
    ? encodeURIComponent(
        `¡Hola! Tu código de participación para la rifa es: *${codigoGenerado}*\n\nIngresa a https://rifascalderon.com y usa este código para obtener tus ${comboSeleccionado.cantidad} números al instante. ¡Buena suerte! 🎉`
      )
    : ''

  return (
    <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-5 space-y-4">
      <h2 className="text-[#E8C97A] font-bold text-lg">Generar código de pago</h2>

      <div>
        <p className="text-[#9E8A60] text-xs uppercase tracking-wider mb-2">Combo</p>
        <div className="grid grid-cols-3 gap-2">
          {COMBOS.map((c) => (
            <button
              key={c.cantidad}
              onClick={() => setComboSeleccionado(c)}
              className={`p-3 rounded-lg border text-center transition-colors ${
                comboSeleccionado.cantidad === c.cantidad
                  ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#E8C97A]'
                  : 'border-[rgba(201,168,76,0.2)] text-[#9E8A60] hover:border-[#C9A84C]/50'
              }`}
            >
              <div className="font-bold">{c.cantidad} núm.</div>
              <div className="text-xs">{c.precio}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerar}
        disabled={cargando}
        className="w-full bg-[#C9A84C] hover:bg-[#E8C97A] disabled:opacity-50 text-[#0E0C08] font-bold py-3 rounded-lg transition-colors"
      >
        {cargando ? 'Generando...' : 'Generar código'}
      </button>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {codigoGenerado && (
        <div className="bg-[#2C2518] border border-[#C9A84C]/40 rounded-lg p-4 space-y-3">
          <p className="text-[#9E8A60] text-xs uppercase tracking-wider">Código generado</p>
          <p className="text-[#E8C97A] font-mono font-bold text-2xl text-center tracking-widest">
            {codigoGenerado}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCopiar}
              className="flex-1 border border-[rgba(201,168,76,0.3)] text-[#9E8A60] hover:text-[#FAF6EE] py-2 rounded-lg text-sm transition-colors"
            >
              {copiado ? '¡Copiado!' : 'Copiar'}
            </button>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${mensajeWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-2 rounded-lg text-sm text-center transition-colors"
            >
              Enviar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
