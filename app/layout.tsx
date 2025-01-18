import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AppointmentsProvider } from '@/contexts/appointments'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Client Caller',
  description: 'Appointment confirmation system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppointmentsProvider>
          {children}
          <Toaster />
        </AppointmentsProvider>
      </body>
    </html>
  )
}

