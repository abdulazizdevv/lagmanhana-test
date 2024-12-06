import HeaderCatalog from '@/_components/HeaderCatalog'
import GalleryPage from '@/_components/Pages/Gallery'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import { getGategoryList } from '@/_services/products'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import React from 'react'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery`,
    languages: {
      en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/gallery`,
      ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/gallery`,
      uz: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery`,
    },
  },
}

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
      `/v2/news-events?page=${+searchParams?.page || 1}&limit=12&type=events`,
    ]
    const data = await fetchMultipleUrls(urls)

    news = data[0]
  } catch (err: any) {
    news = null
  }

  return { categories, news }
}

export default async function Gallery({
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
      <GalleryPage data={news?.news_events} />
    </>
  )
}
