import HeaderCatalog from '@/_components/HeaderCatalog'
import Contact from '@/_components/Pages/Contact'
import { getShipperById } from '@/_services/customerService'
import { getGategoryList } from '@/_services/products'
import { cookies } from 'next/headers'
import React from 'react'

import type { Metadata } from 'next'
import { getI18n } from '@/_locales/server'

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const t = await getI18n()

//     const title = t('seo.title_seo', {
//       title: t('contact'),
//     })
//     const description = t('seo.seo_description_contacts')

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/contacts`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/contacts`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/contacts`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/contacts`,
//         },
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'Chicago',
//       description: 'Description',
//     }
//   }
// }

async function getData() {
  const cookieStore = cookies()

  const menu_id = cookieStore.get('menu_id')
  const delivery_type = cookieStore.get('delivery_type')

  const categories = await getGategoryList({
    page: 1,
    limit: 40,
    is_active: true,
    menu_id: menu_id?.value,
    delivery_type: delivery_type?.value,
  })
    .then((res) => res?.data)
    .catch((err) => err)

  const shipper = await getShipperById(process.env.NEXT_PUBLIC_SHIPPER_ID!)
    .then((res) => res?.data)
    .catch((err) => err.data)

  return { categories, shipper }
}

export default async function ContactPage() {
  const { categories, shipper } = await getData()

  return (
    <>
      <HeaderCatalog data={categories} />
      <Contact shipper={shipper} />
    </>
  )
}
