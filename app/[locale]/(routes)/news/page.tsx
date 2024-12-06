import HeaderCatalog from '@/_components/HeaderCatalog'
import NewsPage from '@/_components/Pages/News'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import { getGategoryList } from '@/_services/products'
import { cookies } from 'next/headers'
import React from 'react'

import type { Metadata, ResolvingMetadata } from 'next'
import { getI18n } from '@/_locales/server'

type Props = {
  params: { locale: string; slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const t = await getI18n()

//     const title = t('seo.title_blog')
//     const description = t('seo.seo_description_blog')

//     return {
//       title,
//       description,
//       robots: {
//         index: false,
//         follow: true,
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'News',
//       description: 'News description',
//     }
//   }
// }

async function getData(searchParams: any) {
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

  let news = null
  try {
    const urls = [
      `/v2/news-events?page=${+searchParams?.page || 1}&limit=10&type=news`,
    ]
    const data = await fetchMultipleUrls(urls)

    news = data[0]
  } catch (err: any) {
    news = null
  }

  return { categories, news }
}

export default async function News({
  searchParams,
}: {
  searchParams?: {
    page?: string
  }
}) {
  const { categories, news } = await getData(searchParams)

  return (
    <>
      <HeaderCatalog data={categories} />
      <NewsPage data={news} />
    </>
  )
}
