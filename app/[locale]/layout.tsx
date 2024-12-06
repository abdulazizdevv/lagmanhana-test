import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { Stack } from '@chakra-ui/react'
import Map from '@/_components/Map'
import '@splidejs/react-splide/css'
import '@smastrom/react-rating/style.css'
import NextTopLoader from 'nextjs-toploader'
import Header from './_components/Header'
import Footer from './_components/Footer'
import CookiePermission from './_components/Cookie'
import Analytics from './analytics'
import { Suspense } from 'react'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const title = 'Lagmanhana'
    const description = 'Lagmanhana'

    return {
      title,
      description,
      generator: 'Next.js',
      applicationName: 'Lagmanhana',
      referrer: 'origin-when-cross-origin',
      keywords: [
        'Lagmanhana',
        'lagmanhana',
        'ovqat',
        'taom',
        'restoran',
        'kafe',
        'fast food',
        'food',
        'еды',
        'доставка еды',
        'kazakhstan',
      ],
      authors: [{ name: 'Delever', url: 'https://delever.uz' }],
      creator: 'Kenjaokhunov',
      publisher: 'Delever',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      robots: {
        index: true,
        follow: true,
      },
      metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN as string),
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN}`,
        languages: {
          en: `${process.env.NEXT_PUBLIC_DOMAIN}/en`,
          ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru`,
          uz: `${process.env.NEXT_PUBLIC_DOMAIN}`,
        },
      },
      openGraph: {
        images: '/images/lagmanhana.jpg',
        type: 'website',
        siteName: 'Lagmanhana',
        title: title,
        description: description,
      },
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/favicon-96x96.png',
        },
      ],
    }
  } catch (error) {
    return {
      title: 'Lagmanhana',
      description: 'Description',
    }
  }
}

import { Inter } from 'next/font/google'

const inter = Inter({
  weight: ['200', '400', '500', '800'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  params: { locale },
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Suspense>
          <NextTopLoader color='#FFFFFF' showSpinner={false} crawl={true} />
          <Providers locale={locale}>
            <Header />
            <Stack as={'main'} flex={1} gap={0}>
              {children}
            </Stack>
            <Footer />
            <Map />
            <CookiePermission />
          </Providers>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
