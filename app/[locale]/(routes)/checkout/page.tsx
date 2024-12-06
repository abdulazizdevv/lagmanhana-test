import BreadCrumb from '@/_components/Breadcrumb'
import Checkout from '@/_components/Pages/Checkout'
import { getI18n } from '@/_locales/server'
import {
  getShipperById,
  getSourceSettings,
  getSourceSettingsV3,
} from '@/_services/customerService'
import { Box, Container } from '@chakra-ui/react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout`,
    languages: {
      en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/checkout`,
      ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/checkout`,
      uz: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout`,
    },
  },
}

async function getData() {
  try {
    const shipper = await getShipperById(
      process.env.NEXT_PUBLIC_SHIPPER_ID!
    ).then((res) => res?.data)
    // const settings = await getSourceSettings(
    //   process.env.NEXT_PUBLIC_SHIPPER_ID!
    // ).then((res) => res?.data)

    const paymentsV3 = await getSourceSettingsV3(
      process.env.NEXT_PUBLIC_SHIPPER_ID!
    ).then((res) => res?.data)

    return { shipper, paymentsV3 }
  } catch (error) {
    return {}
  }
}

const CheckoutPage = async () => {
  const { shipper, paymentsV3 } = await getData()

  const t = await getI18n()

  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('cart'),
      link: '/cart',
    },
    {
      item: t('checkout'),
      link: '/checkout',
    },
  ]

  return (
    <Container my={{ base: '10px', md: 5 }}>
      <Box mb={{ base: '10px', md: 3 }}>
        <BreadCrumb items={BreadcrumbData} />
      </Box>
      <Checkout shipper={shipper} settingsV3={paymentsV3} />
    </Container>
  )
}

export default CheckoutPage
