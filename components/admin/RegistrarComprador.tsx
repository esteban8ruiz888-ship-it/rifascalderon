'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const COMBOS = [
  { cantidad: 10, valor: 15000, precio: '$15.000', label: 'x10' },
  { cantidad: 20, valor: 30000, precio: '$30.000', label: 'x20' },
  { cantidad: 40, valor: 60000, precio: '$60.000', label: 'x40' },
]

interface Props {
  rifaId: string
  whatsappNumber: string
}

export default function RegistrarComprador({ rifaId, whatsappNumber }: Props) {
  const router = useRouter()
  const [comboSeleccionado, setComboSeleccionado] = useState(COMBOS[0])
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [generando, setGenerando] = useState(false)
  const [errorGenerar, setErrorGenerar] = useState('')

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cedula, setCedula] = useState('')
  const [correo, setCorreo] = useState('')
  const [registrando, setRegistrando] = useState(false)
  const [errorRegistrar, setErrorRegistrar] = useState('')
  const [exitoRegistrar, setExitoRegistrar] = useState('')

  async function handleGenerar() {
    setGenerando(true)
    setErrorGenerar('')
    setCodigoGenerado(null)
    setExitoRegistrar('')
    try {
      const res = await fetch('/api/admin/generar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          rifa_id: rifaId,
          combo: comboSeleccionado.cantidad,
          valor: comboSeleccionado.valor,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorGenerar(data.error ?? 'Error al generar el código')
        return
      }
      setCodigoGenerado(data.codigo)
      router.refresh()
    } catch {
      setErrorGenerar('Error de conexión. Intenta de nuevo.')
    } finally {
      setGenerando(false)
    }
  }

  async function handleCopiar() {
    if (!codigoGenerado) return
    await navigator.clipboard.writeText(codigoGenerado)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function handleRegistrar(e: React.FormEvent) {
    e.preventDefault()
    if (!codigoGenerado) return
    setRegistrando(true)
    setErrorRegistrar('')
    setExitoRegistrar('')
    try {
      const res = await fetch('/api/admin/registrar-comprador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          codigo: codigoGenerado,
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          cedula: cedula.trim(),
          correo: correo.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorRegistrar(data.error ?? 'Error al registrar')
        return
      }
      setExitoRegistrar(`Comprador registrado. Números asignados correctamente.`)
      setNombre('')
      setTelefono('')
      setCedula('')
      setCorreo('')
      setCodigoGenerado(null)
      router.refresh()
    } catch {
      setErrorRegistrar('Error de conexión. Intenta de nuevo.')
    } finally {
      setRegistrando(false)
    }
  }

  const mensajeWhatsApp = codigoGenerado
    ? encodeURIComponent(
        `¡Hola! Tu código de participación para la rifa es: *${codigoGenerado}*\n\nIngresa a https://rifascalderon.com y usa este código para obtener tus ${comboSeleccionado.cantidad} números al instante. ¡Buena suerte! 🎉`
      )
    : ''

  return (
    <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-5 space-y-5">
      <h2 className="text-[#E8C97A] font-bold text-lg">Generar código y registrar comprador</h2>

      {/* Paso 1: Seleccionar combo y generar código */}
      <div className="space-y-3">
        <p className="text-[#9E8A60] text-xs uppercase tracking-wider">Paso 1 — Seleccionar combo</p>
        <div className="grid grid-cols-3 gap-2">
          {COMBOS.map((c) => (
            <button
              key={c.cantidad}
              onClick={() => { setComboSeleccionado(c); setCodigoGenerado(null) }}
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

        <button
          onClick={handleGenerar}
          disabled={generando}
          className="w-full bg-[#C9A84C] hover:bg-[#E8C97A] disabled:opacity-50 text-[#0E0C08] font-bold py-2.5 rounded-lg transition-colors text-sm"
        >
          {generando ? 'Generando...' : 'Generar código'}
        </button>

        {errorGenerar && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-3">
            {errorGenerar}
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

      {/* Paso 2: Registrar comprador (solo visible si hay código) */}
      {codigoGenerado && (
        <div className="space-y-3 border-t border-[rgba(201,168,76,0.1)] pt-4">
          <p className="text-[#9E8A60] text-xs uppercase tracking-wider">Paso 2 — Registrar comprador (opcional)</p>
          <form onSubmit={handleRegistrar} className="space-y-3">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo *"
              required
              className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] text-sm"
            />
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono *"
              required
              className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] text-sm"
            />
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Cédula *"
              required
              className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] text-sm"
            />
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo (opcional)"
              className="w-full bg-[#2C2518] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-2.5 text-[#FAF6EE] placeholder-[#9E8A60] focus:outline-none focus:border-[#C9A84C] text-sm"
            />

            {errorRegistrar && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-3">
                {errorRegistrar}
              </p>
            )}

            <button
              type="submit"
              disabled={registrando}
              className="w-full bg-[#2C2518] border border-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-50 text-[#E8C97A] font-bold py-2.5 rounded-lg transition-colors text-sm"
            >
              {registrando ? 'Registrando...' : 'Registrar comprador'}
            </button>
          </form>
        </div>
      )}

      {exitoRegistrar && (
        <p className="text-green-400 text-sm bg-green-900/20 border border-green-900/30 rounded-lg px-4 py-3">
          {exitoRegistrar}
        </p>
      )}
    </div>
  )
}
