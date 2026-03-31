import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rifas CR — ¡Participa y gana!',
  description: 'Rifas con premios increíbles. Paga por Nequi y obtén tus números al instante.',
  openGraph: {
    title: 'Rifas CR',
    description: 'Participa en nuestras rifas y gana premios increíbles.',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#0E0C08] text-[#FAF6EE] antialiased">
        {children}
      </body>
    </html>
  )
}
