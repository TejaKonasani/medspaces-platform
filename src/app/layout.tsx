import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedSpaces - Find Your Perfect Consultation Space',
  description: 'India\'s largest marketplace for consultation spaces. Discover available OPD rooms, connect with clinics, and start your practice today.',
  keywords: 'consultation rooms, doctor practice space, clinic rooms, medical spaces, OPD rooms India',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <AuthProvider>
          <ToastProvider>
            <a href="#main-content" className="sr-only-focusable">
              Skip to content
            </a>
            <Header />
            <main id="main-content" className="min-h-screen page-transition">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
