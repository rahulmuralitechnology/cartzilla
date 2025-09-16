// src/app/layout.tsx - Updated with providers and metadata
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../providers/CartProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Cartzilla - Electronics Store',
    template: '%s | Cartzilla'
  },
  description: 'Your one-stop shop for electronics',
  metadataBase: new URL('https://cartzilla.example.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Cartzilla',
  },
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}