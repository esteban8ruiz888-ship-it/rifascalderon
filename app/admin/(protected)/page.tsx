import { createServerClient } from '@/lib/supabase/server'
import TablaCodigos from '@/components/admin/TablaCodigos'
import TablaCompradores from '@/components/admin/TablaCompradores'
import SorteoAdmin from '@/components/admin/SorteoAdmin'
import GestionRifa from '@/components/admin/GestionRifa'
import RegistrarComprador from '@/components/admin/RegistrarComprador'

async function getDashboardData() {
  const supabase = createServerClient()

  const [rifaRes, codigosRes, compradoresRes] = await Promise.all([
    supabase
      .from('rifas')
      .select('id, nombre, premio, total_puestos, puestos_vendidos, estado')
      .eq('estado', 'activa')
      .maybeSingle(),
    supabase
      .from('codigos_pago')
      .select('id, codigo, cantidad, combo, usado, creado_en, compradores(nombre, telefono, cedula)')
      .order('creado_en', { ascending: false })
      .limit(20),
    supabase
      .from('compradores')
      .select('id, nombre, telefono, cedula, correo, creado_en, numeros_asignados(numero)')
      .order('creado_en', { ascending: false }),
  ])

  return {
    rifa: rifaRes.data ?? null,
    codigos: codigosRes.data ?? [],
    compradores: compradoresRes.data ?? [],
  }
}

export default async function AdminPage() {
  const { rifa, codigos, compradores } = await getDashboardData()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  const codigosUsados = codigos.filter((c) => c.usado).length
  const totalVendidos = rifa?.puestos_vendidos ?? 0
  const totalNumeros = rifa?.total_puestos ?? 10000
  const porcentaje = ((totalVendidos / totalNumeros) * 100).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Gestión de rifa */}
      <GestionRifa rifa={rifa} />

      {/* Métricas (solo si hay rifa activa) */}
      {rifa && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Compradores', valor: compradores.length },
              { label: 'Números vendidos', valor: totalVendidos.toLocaleString('es-CO') },
              { label: 'Puestos disponibles', valor: (totalNumeros - totalVendidos).toLocaleString('es-CO') },
              { label: 'Ocupación', valor: `${porcentaje}%` },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-4 text-center"
              >
                <p className="text-[#E8C97A] font-bold text-2xl">{m.valor}</p>
                <p className="text-[#9E8A60] text-xs mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Métricas de códigos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-4 text-center">
              <p className="text-[#E8C97A] font-bold text-2xl">{codigos.length}</p>
              <p className="text-[#9E8A60] text-xs mt-1">Códigos generados (últimos 20)</p>
            </div>
            <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.2)] rounded-xl p-4 text-center">
              <p className="text-[#E8C97A] font-bold text-2xl">{codigosUsados}</p>
              <p className="text-[#9E8A60] text-xs mt-1">Códigos redimidos</p>
            </div>
          </div>

          {/* Generador + Tabla códigos */}
          <div className="grid md:grid-cols-2 gap-6">
            <RegistrarComprador rifaId={rifa.id} whatsappNumber={whatsappNumber} />
            <TablaCodigos codigos={codigos as Parameters<typeof TablaCodigos>[0]['codigos']} />
          </div>

          {/* Sorteo */}
          <SorteoAdmin rifaId={rifa.id} rifaEstado={rifa.estado} />

          {/* Compradores */}
          <TablaCompradores compradores={compradores as Parameters<typeof TablaCompradores>[0]['compradores']} />
        </>
      )}
    </div>
  )
}
