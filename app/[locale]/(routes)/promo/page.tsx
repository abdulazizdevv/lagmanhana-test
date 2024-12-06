import HeaderCatalog from '@/_components/HeaderCatalog'
import StocksPage from '@/_components/Pages/Stocks'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import { getGategoryList } from '@/_services/products'
import { cookies } from 'next/headers'
import React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { getI18n } from '@/_locales/server'

// type Props = {
//   params: { locale: string; slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   try {
//     const t = await getI18n()

//     const title = t('seo.title_seo', {
//       title: t('seo.h1_stock'),
//     })

//     const description = t('seo.seo_description_product', {
//       title: ' description',
//     })

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${params.locale}/promo`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/promo`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/promo`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/promo`,
//         },
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'Stocks',
//       description: 'Description',
//     }
//   }
// }

async function getData(searchParams: any) {
  const cookieStore = cookies()

  const menu_id = cookieStore.get('menu_id')
  const delivery_type = cookieStore.get('delivery_type')

  try {
    const categories = await getGategoryList({
      page: 1,
      limit: 40,
      is_active: true,
      menu_id: menu_id?.value,
      delivery_type: delivery_type?.value,
    })
      .then((res) => res?.data)
      .catch((err) => err)

    const urls = [`/v1/promo?page=${+searchParams?.page || 1}&limit=12`]
    const data = await fetchMultipleUrls(urls)

    return { categories, promos: data[0] }
  } catch (err: any) {
    return { categories: null, promos: null }
  }
}

export default async function Stocks({
  searchParams,
}: {
  searchParams?: {
    page?: string
  }
}) {
  const { categories, promos } = await getData(searchParams)

  return (
    <>
      <HeaderCatalog data={categories} />
      <StocksPage data={promos?.promos} />
    </>
  )
}
