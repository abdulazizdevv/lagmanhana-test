import HeaderCatalog from '@/_components/HeaderCatalog'
import About from '@/_components/Pages/About'
import { getGategoryList } from '@/_services/products'
import { cookies } from 'next/headers'

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const t = await getI18n()

//     const title = t('seo.title_seo', {
//       title: t('about'),
//     })
//     const description = t('seo.seo_description_about')

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/about`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/about`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/about`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/about`,
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

  return categories
}

const AboutPage = async () => {
  const categories = await getData()

  return (
    <>
      <HeaderCatalog data={categories} />
      <About />
    </>
  )
}

export default AboutPage
