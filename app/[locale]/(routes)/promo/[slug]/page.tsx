import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import SingleStock from '@/_components/Pages/Stocks/single'
import { cookies } from 'next/headers'
import { getGategoryList } from '@/_services/products'
import HeaderCatalog from '@/_components/HeaderCatalog'

import type { Metadata, ResolvingMetadata } from 'next'
import { getI18n } from '@/_locales/server'

// type Props = {
//   params: { locale: string; slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   try {
//     const t = await getI18n()

//     const { locale, slug } = params

//     const urls = [`/v1/promo/${slug}`]
//     const data = await fetchMultipleUrls(urls)

//     const title = t('seo.title_seo', {
//       title: data[0].title[locale],
//     })
//     const description = data[0].description[locale]

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/promo/${data[0]?.slug}`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/promo/${data[0]?.slug}`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/promo/${data[0]?.slug}`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/promo/${data[0]?.slug}`,
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

async function getData(slug: string) {
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

    const urls = [`/v1/promo/${slug}`]
    const data = await fetchMultipleUrls(urls)

    return {
      data: data[0] ?? null,
      categories: categories ?? null,
      statusCode: 200,
    }
  } catch (err: any) {
    return {
      data: null,
      categories: null,
      statusCode: err?.status ?? null,
    }
  }
}

export default async function SingleStockPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const { data, categories } = await getData(slug)

  return (
    <>
      <HeaderCatalog data={categories} />
      <SingleStock data={data} />
    </>
  )
}
