import { redirect } from 'next/navigation'
import { verificarAdmin } from '@/lib/admin-auth'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const esAdmin = await verificarAdmin()
  if (!esAdmin) {
    redirect('/admin/login')
  }
  return (
    <div className="min-h-screen bg-[#0E0C08]">
      <header className="bg-[#1A1612] border-b border-[rgba(201,168,76,0.2)] px-6 h-14 flex items-center justify-between">
        <span className="text-[#C9A84C] font-bold">Panel Admin — Rifas CR</span>
        <a
          href="/"
          className="text-[#9E8A60] hover:text-[#FAF6EE] text-sm transition-colors"
        >
          Ver sitio
        </a>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
