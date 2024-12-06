import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import SingleBranch from '@/_components/Pages/Branches/SingleBranch'

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

//     const urls = [`/v1/branches/${slug}`]
//     const data = await fetchMultipleUrls(urls)

//     const title = t('seo.title_seo', {
//       title: data[0].title[locale],
//     })
//     const description = data[0].description[locale]

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/restaurants/${data[0]?.slug}`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/restaurants/${data[0]?.slug}`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/restaurants/${data[0]?.slug}`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/restaurants/${data[0]?.slug}`,
//         },
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'Restaurants',
//       description: 'Description',
//     }
//   }
// }

async function getData(slug: string) {
  try {
    const urls = [`/v1/branches/${slug}`]
    const data = await fetchMultipleUrls(urls)

    return [data[0], 200]
  } catch (err: any) {
    return [null, err.response.status ?? null]
  }
}

export default async function BranchPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const [branch, statusCode] = await getData(slug)

  return (
    <>
      <SingleBranch data={branch} />
    </>
  )
}
