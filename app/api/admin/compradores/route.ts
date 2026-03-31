import { NextRequest, NextResponse } from 'next/server'
import { protegerAdmin } from '@/lib/admin-auth'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const guard = await protegerAdmin()
  if (guard) return guard

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('compradores')
    .select('id, nombre, telefono, cedula, correo, creado_en, numeros_asignados(numero)')
    .order('creado_en', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al obtener compradores' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  if (searchParams.get('formato') === 'csv') {
    const filas = [
      'Nombre,Teléfono,Cédula,Correo,Números,Fecha',
      ...(data ?? []).map((c) => {
        const nums = (c.numeros_asignados as { numero: number }[])
          .map((n) => String(n.numero).padStart(4, '0'))
          .join(' | ')
        return `"${c.nombre}","${c.telefono}","${c.cedula}","${c.correo ?? ''}","${nums}","${c.creado_en}"`
      }),
    ]
    return new NextResponse(filas.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="compradores.csv"',
      },
    })
  }

  return NextResponse.json(data ?? [])
}
