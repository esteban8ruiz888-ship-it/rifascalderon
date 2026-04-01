import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import BarraProgreso from '@/components/BarraProgreso'
import HomeClient from '@/components/HomeClient'

interface Rifa {
  id: string
  nombre: string
  premio: string
  descripcion: string | null
  precio_por_numero: number
  total_puestos: number
  puestos_vendidos: number
  imagen_url: string | null
  estado: string
  fecha_sorteo: string | null
}

async function getRifaActiva(): Promise<Rifa | null> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('rifas')
    .select('id, nombre, premio, descripcion, precio_por_numero, total_puestos, puestos_vendidos, imagen_url, estado, fecha_sorteo')
    .eq('estado', 'activa')
    .single()
  return data ?? null
}

export default async function HomePage() {
  const rifa = await getRifaActiva()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const nequiNumber = process.env.NEXT_PUBLIC_NEQUI_NUMBER ?? ''

  return (
    <main className="min-h-screen bg-[#0E0C08]">
      <Header />
      <div className="pt-16">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/10 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 py-10 text-center">
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3 font-bold">
              ✦ Rifa activa · Solo $1.500 por puesto ✦
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#FAF6EE] mb-3 leading-tight">
              {rifa?.nombre ?? 'Rifas CR'}
            </h1>
            <p className="text-[#C9A84C] font-semibold text-xl mb-2">
              Pulsera de Oro 18k — Oro Italiano
            </p>
            {rifa?.descripcion && (
              <p className="text-[#9E8A60] text-base max-w-2xl mx-auto mb-3">
                {rifa.descripcion}
              </p>
            )}
            {rifa?.fecha_sorteo && (
              <p className="inline-block bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full px-4 py-1 text-[#E8C97A] text-sm font-semibold">
                Sorteo:{' '}
                {new Date(rifa.fecha_sorteo).toLocaleDateString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </section>

        {/* Galería del premio */}
        <section className="max-w-5xl mx-auto px-4 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-bold">El Premio</p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Foto grande izquierda */}
            <div className="col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#C9A84C]/20 shadow-lg shadow-[#C9A84C]/5">
              <Image
                src="/premio-1.jpg"
                alt="Pulsera de oro 18k italiana"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C08]/40 to-transparent" />
            </div>

            {/* Fotos pequeñas derecha */}
            <div className="flex flex-col gap-3">
              <div className="relative flex-1 rounded-2xl overflow-hidden border border-[#C9A84C]/20 min-h-[100px]">
                <Image
                  src="/premio-3.jpg"
                  alt="Pulsera de oro italiana"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative flex-1 rounded-2xl overflow-hidden border border-[#C9A84C]/20 min-h-[100px]">
                <Image
                  src="/premio-4.jpg"
                  alt="Joyería de oro 18k"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Foto ancha abajo */}
            <div className="col-span-3 relative aspect-[16/5] rounded-2xl overflow-hidden border border-[#C9A84C]/20">
              <Image
                src="/premio-5.jpg"
                alt="Joyería de oro italiana"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C08]/30 to-transparent" />
            </div>
          </div>

          {/* Premio principal */}
          <div className="mt-4 bg-gradient-to-r from-[#1A1612] via-[#2C2518] to-[#1A1612] border border-[#C9A84C]/40 rounded-2xl p-5 text-center shadow-lg shadow-[#C9A84C]/10">
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1 font-bold">✦ Premio principal ✦</p>
            <p className="text-[#FAF6EE] text-2xl font-bold mb-1">Pulsera de Oro 18k</p>
            <p className="text-[#9E8A60] text-sm">Oro Italiano — Joyería de lujo auténtica</p>
          </div>
        </section>

        {/* Combos + Foto Silvia y Juan — siempre visibles */}
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
            <h2 className="text-[#FAF6EE] font-bold text-xl">Elige tu combo</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Izquierda: combos + barra + botones */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="relative bg-[#1A1612] border border-[rgba(201,168,76,0.25)] rounded-2xl p-4 text-center hover:border-[#C9A84C]/50 transition-colors">
                  <p className="text-[#E8C97A] font-black text-4xl mb-1">10</p>
                  <p className="text-[#9E8A60] text-xs mb-2">puestos</p>
                  <p className="text-[#FAF6EE] font-bold text-lg">$15.000</p>
                  <p className="text-[#9E8A60] text-xs mt-1">$1.500 c/u</p>
                </div>
                <div className="relative bg-gradient-to-b from-[#2C2518] to-[#1A1612] border-2 border-[#C9A84C] rounded-2xl p-4 text-center shadow-lg shadow-[#C9A84C]/20">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0E0C08] text-xs font-black px-3 py-0.5 rounded-full whitespace-nowrap">
                    ⭐ Popular
                  </span>
                  <p className="text-[#E8C97A] font-black text-4xl mb-1">20</p>
                  <p className="text-[#9E8A60] text-xs mb-2">puestos</p>
                  <p className="text-[#FAF6EE] font-bold text-lg">$30.000</p>
                  <div className="mt-2 bg-[#C9A84C]/15 border border-[#C9A84C]/40 rounded-lg px-2 py-1">
                    <p className="text-[#E8C97A] text-xs font-bold">+$1.000.000</p>
                    <p className="text-[#9E8A60] text-xs">si ganas</p>
                  </div>
                </div>
                <div className="relative bg-[#1A1612] border border-[rgba(201,168,76,0.25)] rounded-2xl p-4 text-center hover:border-[#C9A84C]/50 transition-colors">
                  <p className="text-[#E8C97A] font-black text-4xl mb-1">40</p>
                  <p className="text-[#9E8A60] text-xs mb-2">puestos</p>
                  <p className="text-[#FAF6EE] font-bold text-lg">$60.000</p>
                  <div className="mt-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-lg px-2 py-1">
                    <p className="text-[#E8C97A] text-xs font-bold">+$1.000.000</p>
                    <p className="text-[#9E8A60] text-xs">si ganas</p>
                  </div>
                </div>
              </div>

              {rifa && (
                <div className="bg-[#1A1612] border border-[#C9A84C]/30 rounded-2xl p-4">
                  <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-bold text-center mb-3">
                    Ventas en tiempo real
                  </p>
                  <BarraProgreso
                    rifaId={rifa.id}
                    totalNumeros={rifa.total_puestos}
                    numerosVendidosInicial={rifa.puestos_vendidos}
                  />
                </div>
              )}

              <HomeClient
                rifaNombre={rifa?.nombre ?? 'Rifas CR'}
                whatsappNumber={whatsappNumber}
                nequiNumber={nequiNumber}
              />
            </div>

            {/* Derecha: foto Silvia y Juan */}
            <div className="relative rounded-3xl overflow-hidden border border-[#C9A84C]/30 shadow-2xl shadow-[#C9A84C]/10 min-h-[420px]">
              <Image
                src="/silvia-juan.png"
                alt="Silvia y Juan — Rifas CR"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C08]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-bold mb-1">✦ Rifas CR</p>
                <p className="text-[#FAF6EE] text-xl font-bold leading-tight">Silvia y Juan</p>
                <p className="text-[#9E8A60] text-sm">Tu rifa de confianza</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pasos — siempre visibles */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
            <h2 className="text-[#FAF6EE] font-bold text-xl">¿Cómo participar?</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { paso: '1', titulo: 'Paga por Nequi', texto: `Transfiere el valor del combo al Nequi ${nequiNumber}.` },
              { paso: '2', titulo: 'Envía el comprobante', texto: 'Manda la captura de tu pago por WhatsApp.' },
              { paso: '3', titulo: 'Recibe tu código único', texto: 'Te enviamos un código personalizado (ej: RC-XXXX-XX).' },
              { paso: '4', titulo: 'Ingresa tus datos', texto: 'Llena tu nombre, teléfono y cédula con tu código.' },
              { paso: '5', titulo: 'Selecciona tu combo', texto: 'Elige el combo que pagaste (x10, x20 o x40).' },
              { paso: '6', titulo: '¡Recibe tus números!', texto: 'Tus números aparecen al instante. Guárdalos en "Mis Números".' },
            ].map((item) => (
              <div key={item.paso} className="flex gap-4 bg-[#1A1612] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 hover:border-[#C9A84C]/30 transition-colors">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0E0C08] font-black text-sm flex items-center justify-center shadow-md shadow-[#C9A84C]/20">
                  {item.paso}
                </div>
                <div>
                  <p className="text-[#FAF6EE] font-semibold text-sm">{item.titulo}</p>
                  <p className="text-[#9E8A60] text-sm mt-0.5">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-[#2C2518] border border-[#C9A84C]/40 rounded-xl px-4 py-3 flex gap-3 items-start">
            <span className="text-[#C9A84C] text-lg leading-none mt-0.5">⚠</span>
            <p className="text-[#9E8A60] text-sm">
              <span className="text-[#E8C97A] font-semibold">El código es de uso único.</span>{' '}
              Solo puede ser canjeado una vez. Si tienes algún problema, contáctanos por WhatsApp.
            </p>
          </div>
        </section>

        {/* Cómo funciona / Términos */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
            <h2 className="text-[#FAF6EE] font-bold text-xl">Términos y condiciones</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
          </div>
          <div className="bg-[#1A1612] border border-[rgba(201,168,76,0.15)] rounded-2xl p-6 space-y-4 text-[#9E8A60] text-sm leading-relaxed">
            <div className="flex gap-3">
              <span className="text-[#C9A84C] font-bold shrink-0">1.</span>
              <p><span className="text-[#E8C97A] font-semibold">Participación:</span> Cada número adquirido representa un boleto válido para el sorteo. La participación se confirma una vez recibido el comprobante de pago y asignados los números.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#C9A84C] font-bold shrink-0">2.</span>
              <p><span className="text-[#E8C97A] font-semibold">Pago:</span> El pago se realiza únicamente por Nequi al número indicado. El comprobante debe ser enviado por WhatsApp antes de recibir el código de participación.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#C9A84C] font-bold shrink-0">3.</span>
              <p><span className="text-[#E8C97A] font-semibold">Sorteo:</span> El ganador se seleccionará en vivo a través de las redes sociales de Rifas CR en la fecha indicada. El resultado es definitivo e inapelable.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#C9A84C] font-bold shrink-0">4.</span>
              <p><span className="text-[#E8C97A] font-semibold">Premio:</span> El premio (Pulsera de Oro 18k — Oro Italiano) se entrega personalmente o se coordina su envío con el ganador. No tiene cambio por efectivo.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#C9A84C] font-bold shrink-0">5.</span>
              <p><span className="text-[#E8C97A] font-semibold">Código único:</span> Cada código de pago es de uso único e intransferible. No se aceptan duplicados ni códigos alterados.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#C9A84C] font-bold shrink-0">6.</span>
              <p><span className="text-[#E8C97A] font-semibold">Datos personales:</span> La información suministrada (nombre, cédula, teléfono) se usa exclusivamente para la identificación del ganador y no es compartida con terceros.</p>
            </div>
            <div className="mt-2 pt-4 border-t border-[#C9A84C]/10 text-center">
              <p className="text-[#9E8A60] text-xs">¿Tienes dudas? Contáctanos por <span className="text-[#E8C97A]">WhatsApp</span> — estamos para ayudarte.</p>
              <p className="text-[#C9A84C] font-bold text-sm mt-1">Rifas CR · Tu rifa de confianza</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
