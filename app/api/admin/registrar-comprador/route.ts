import { NextRequest, NextResponse } from 'next/server'
import { protegerAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const guard = await protegerAdmin()
  if (guard) return guard

  const body = await req.json().catch(() => null)
  const { codigo, nombre, telefono, cedula, correo } = body ?? {}

  if (!codigo || !nombre || !telefono || !cedula) {
    return NextResponse.json(
      { error: 'Faltan campos: código, nombre, teléfono y cédula' },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  const { data, error } = await supabase.rpc('usar_codigo', {
    p_codigo: String(codigo).trim().toUpperCase(),
    p_nombre: String(nombre).trim(),
    p_telefono: String(telefono).trim(),
    p_cedula: String(cedula).trim(),
    p_correo: correo?.trim() ?? null,
  })

  if (error) {
    const msg = error.message ?? ''
    if (msg.includes('CODIGO_NO_ENCONTRADO'))
      return NextResponse.json({ error: 'Código no válido.' }, { status: 404 })
    if (msg.includes('CODIGO_YA_USADO'))
      return NextResponse.json({ error: 'Este código ya fue utilizado.' }, { status: 409 })
    if (msg.includes('RIFA_NO_ACTIVA'))
      return NextResponse.json({ error: 'La rifa está cerrada.' }, { status: 400 })
    if (msg.includes('PUESTOS_INSUFICIENTES'))
      return NextResponse.json({ error: 'No hay puestos suficientes.' }, { status: 400 })
    return NextResponse.json({ error: 'Error al registrar el comprador.' }, { status: 500 })
  }

  return NextResponse.json(data)
}
