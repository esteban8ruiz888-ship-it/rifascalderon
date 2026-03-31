import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cedula = searchParams.get('cedula')
  const correo = searchParams.get('correo')

  if (!cedula && !correo) {
    return NextResponse.json(
      { error: 'Debes proporcionar cédula o correo.' },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  if (cedula) {
    const { data, error } = await supabase.rpc('buscar_por_cedula', {
      p_cedula: cedula.trim(),
    })
    if (error) {
      return NextResponse.json({ error: 'Error al buscar. Intenta de nuevo.' }, { status: 500 })
    }
    return NextResponse.json(data ?? [])
  }

  const { data, error } = await supabase.rpc('buscar_por_correo', {
    p_correo: correo!.trim().toLowerCase(),
  })
  if (error) {
    return NextResponse.json({ error: 'Error al buscar. Intenta de nuevo.' }, { status: 500 })
  }
  return NextResponse.json(data ?? [])
}
