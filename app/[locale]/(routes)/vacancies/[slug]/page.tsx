import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import SingleVacancy from '@/_components/Pages/Vacancies/single'
import HeaderCatalog from '@/_components/HeaderCatalog'
import { getGategoryList } from '@/_services/products'
import { cookies } from 'next/headers'
import type { Metadata, ResolvingMetadata } from 'next'
import { getI18n } from '@/_locales/server'
import { notFound } from 'next/navigation'

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

//     const urls = [`/v2/vacancy/${slug}`]
//     const data = await fetchMultipleUrls(urls)

//     const title = t('seo.title_seo', {
//       title: data[0].title[locale],
//     })
//     const description = data[0].description[locale]

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/vacancies/${data[0]?.slug}`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/vacancies/${data[0]?.slug}`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/vacancies/${data[0]?.slug}`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/vacancies/${data[0]?.slug}`,
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
  try {
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

    const urls = [`/v2/vacancy/${slug}`]
    const data = await fetchMultipleUrls(urls)

    return {
      data: data[0] ?? null,
      categories: categories ?? null,
      statusCode: 200,
    }
  } catch (err: any) {
    if (err) {
      notFound()
    }
    return {
      data: null,
      categories: null,
      statusCode: err?.status ?? null,
    }
  }
}

export default async function SingleVacancyPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const { data, categories } = await getData(slug)

  return (
    <>
      <HeaderCatalog data={categories} />
      <SingleVacancy data={data} />
    </>
  )
}
