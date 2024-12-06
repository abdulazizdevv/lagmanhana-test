import HeaderCatalog from '@/_components/HeaderCatalog'
import DeliveryInfo from '@/_components/Pages/DeliveryInfo'
import { getSourceSettings } from '@/_services/customerService'
import React from 'react'

import type { Metadata, ResolvingMetadata } from 'next'
import { getI18n } from '@/_locales/server'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'

type Props = {
  params: { locale: string; slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const t = await getI18n()

//     const urls = [`/v1/shippers/${process.env.NEXT_PUBLIC_SHIPPER_ID}`]
//     const shipper = await fetchMultipleUrls(urls)

//     const title = t('seo.title_seo', {
//       title: t('seo.h1_delivery_zone'),
//     })

//     const description = t('seo.seo_description_delivery_zone', {
//       time: shipper[0]?.max_delivery_time,
//     })

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/delivery`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/delivery`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/deliver`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/deliver`,
//         },
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'Delivery zone',
//       description: 'Description',
//     }
//   }
// }

async function getData() {
  const settings = await getSourceSettings(process.env.NEXT_PUBLIC_SHIPPER_ID!)
    .then((res) => res?.data)
    .catch((err) => err?.data)

  return { settings }
}

const DeliveryInfoPage = async () => {
  const { settings } = await getData()

  return (
    <>
      <HeaderCatalog />
      <DeliveryInfo settings={settings} />
    </>
  )
}

export default DeliveryInfoPage
