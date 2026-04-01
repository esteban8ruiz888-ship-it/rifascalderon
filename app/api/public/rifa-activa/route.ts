import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('rifas')
    .select('id, nombre, premio, descripcion, precio_por_numero, total_puestos, puestos_vendidos, imagen_url, estado, fecha_sorteo')
    .eq('estado', 'activa')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No hay rifa activa' }, { status: 404 })
  }

  return NextResponse.json(data)
}
