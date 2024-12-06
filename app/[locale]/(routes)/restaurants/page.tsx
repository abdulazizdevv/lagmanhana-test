import Branches from '@/_components/Pages/Branches'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import React from 'react'
import { cookies } from 'next/headers'
import { getGategoryList } from '@/_services/products'
import HeaderCatalog from '@/_components/HeaderCatalog'
import type { Metadata } from 'next'
import { getI18n } from '@/_locales/server'

// type Props = {
//   params: { locale: string; slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   try {
//     const t = await getI18n()
//     const { locale } = params

//     const title = t('seo.title_seo', {
//       title: t('branch'),
//     })
//     const description = t('seo.seo_description_branches')

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/restaurants`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/restaurants`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/restaurants`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/restaurants`,
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

async function getData(searchParams: any) {
  const cookieStore = cookies()

  const menu_id = cookieStore.get('menu_id')
  const delivery_type = cookieStore.get('delivery_type')
  const page = 1
  const limit = 12
  const search = searchParams?.search ? `&search=${searchParams.search}` : ''

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

    const urls = [`/v1/branches?page=${page}&limit=${limit}${search}`]

    const data = await fetchMultipleUrls(urls)

    return { categories, branches: data[0] }
  } catch (err: any) {
    return { categories: null, branches: null }
  }
}

export default async function BranchesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { categories, branches } = await getData(searchParams)

  return (
    <>
      {/* <HeaderCatalog data={categories} /> */}
      <Branches data={branches?.branches} count={branches?.count} />
    </>
  )
}
