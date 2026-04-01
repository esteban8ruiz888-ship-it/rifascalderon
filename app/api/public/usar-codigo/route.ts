import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const { codigo, nombre, telefono, cedula, correo } = body

  if (!codigo || !nombre || !telefono || !cedula) {
    return NextResponse.json(
      { error: 'Faltan campos obligatorios: código, nombre, teléfono y cédula.' },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  const { data, error } = await supabase.rpc('usar_codigo', {
    p_codigo: codigo.trim().toUpperCase(),
    p_nombre: nombre.trim(),
    p_telefono: telefono.trim(),
    p_cedula: cedula.trim(),
    p_correo: correo?.trim() ?? null,
  })

  if (error) {
    const msg = error.message ?? ''
    if (msg.includes('CODIGO_NO_ENCONTRADO')) {
      return NextResponse.json(
        { error: 'Código no válido. Verifica que lo escribiste correctamente.' },
        { status: 404 }
      )
    }
    if (msg.includes('CODIGO_YA_USADO')) {
      return NextResponse.json({ error: 'Este código ya fue utilizado.' }, { status: 409 })
    }
    if (msg.includes('RIFA_NO_ACTIVA')) {
      return NextResponse.json(
        { error: 'La rifa está cerrada. No se aceptan más participaciones.' },
        { status: 400 }
      )
    }
    if (msg.includes('PUESTOS_INSUFICIENTES')) {
      return NextResponse.json(
        { error: 'No hay puestos suficientes disponibles.' },
        { status: 400 }
      )
    }
    console.error('usar_codigo error:', error)
    return NextResponse.json({ error: error.message ?? 'Error de conexión. Intenta de nuevo.' }, { status: 500 })
  }

  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    return NextResponse.json({ error: 'No se pudo procesar el código.' }, { status: 500 })
  }
  return NextResponse.json(row)
}
