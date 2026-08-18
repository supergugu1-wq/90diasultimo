import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projeto 90 Dias',
  description: 'Transformação completa em 90 dias'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>
}
