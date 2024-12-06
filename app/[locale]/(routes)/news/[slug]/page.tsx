import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import SingleNews from '@/_components/Pages/News/single'
import { cookies } from 'next/headers'
import { getGategoryList } from '@/_services/products'
import HeaderCatalog from '@/_components/HeaderCatalog'

import type { Metadata, ResolvingMetadata } from 'next'
import { getCurrentLocale, getI18n } from '@/_locales/server'
import dayjs from 'dayjs'
import { getUserReviews } from '@/_services/customerService'
import Script from 'next/script'

type Props = {
  params: { locale: string; slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   try {
//     const { locale, slug } = params
//     const t = await getI18n()

//     const urls = [`/v2/news-events/${slug}`]
//     const data = await fetchMultipleUrls(urls)

//     const title = t('seo.title_seo', {
//       title: data[0].title[locale],
//     })

//     const description = t('seo.seo_description_single_blog', {
//       title: data[0].title[locale],
//     })

//     return {
//       title,
//       description,
//       robots: {
//         index: false,
//         follow: true,
//       },
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/news/${data[0]?.slug}`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/news/${data[0]?.slug}`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/news/${data[0]?.slug}`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/news/${data[0]?.slug}`,
//         },
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'Blog',
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

    const urls = [`/v2/news-events/${slug}`]
    const data = await fetchMultipleUrls(urls)

    const reviews = await getUserReviews({
      related_subject: 'news_events',
      subject_id: data[0]?.id,
    })

    return {
      data: data[0] ?? null,
      categories: categories ?? null,
      reviews: reviews ?? null,
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

export default async function SingleNewsPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string }
}) {
  const { data, categories, reviews } = await getData(slug)
  const currentLocale = getCurrentLocale()

  // const microdata = {
  //   '@context': 'http://schema.org',
  //   '@type': 'Article',
  //   mainEntityOfPage: {
  //     '@type': 'WebPage',
  //     '@id': `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/news/${slug}`,
  //   },
  //   headline: String(
  //     data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]
  //   ).substring(0, 109),
  //   image: {
  //     '@type': 'ImageObject',
  //     url: process.env.BASE_URL + data?.images?.[0],
  //     width: '896px',
  //     height: '448px',
  //   },
  //   publisher: {
  //     '@type': 'Organization',
  //     name: 'Chicago',
  //     logo: {
  //       '@type': 'ImageObject',
  //       url:
  //         process.env.NEXT_PUBLIC_DOMAIN +
  //         '/_next/static/media/logo.9d06c4ea.svg',
  //       width: '138px',
  //       height: '24px',
  //     },
  //   },
  //   datePublished: dayjs(data?.created_at).toISOString(),
  //   dateModified: dayjs(data?.updated_at).toISOString(),
  //   description: String(
  //     data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale]
  //   ).substring(0, 109),
  // }

  // const microdataJson = JSON.stringify(microdata)

  return (
    <>
      <HeaderCatalog data={categories} />
      <SingleNews data={data} reviews={reviews?.reviews} />
      {/* <Script
        id='news-microdata'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: microdataJson }}
      /> */}
    </>
  )
}
