import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { crearSesionAdmin, COOKIE_NAME } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.clave) {
    return NextResponse.json({ error: 'Clave requerida' }, { status: 400 })
  }

  const claveCorrecta = process.env.ADMIN_SECRET_KEY
  if (!claveCorrecta || body.clave !== claveCorrecta) {
    return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, crearSesionAdmin(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60,
  })

  return NextResponse.json({ ok: true })
}
