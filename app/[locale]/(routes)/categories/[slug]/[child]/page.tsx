import { cookies } from 'next/headers'

import {
  getCategoryById,
  getGategoryList,
  getProducts,
} from '@/_services/products'
import { getBanners } from '@/_services/marketing'
import Categories from '@/_components/Categories'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'

import type { Metadata, ResolvingMetadata } from 'next'
import { getI18n } from '@/_locales/server'
import CartBottom from '@/_components/CartBottom'

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
//     const category = await getCategoryById(slug).then((res) => res?.data)

//     const title = t('seo.title_category', {
//       title: category?.metatag_title[locale]
//         ? category?.metatag_title[locale]
//         : category.title[locale],
//     })
//     const description = t('seo.seo_description_category', {
//       title: category?.metatag_title[locale]
//         ? category?.metatag_title[locale]
//         : category.title[locale],
//     })

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/categories/${slug}`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/categories/${slug}`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/categories/${slug}`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/categories/${slug}`,
//         },
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'Category',
//       description: 'Description',
//     }
//   }
// }

async function getData(
  slug: string,
  searchParams: { tags?: string | undefined } | undefined
) {
  const cookieStore = cookies()

  const menu_id = cookieStore.get('menu_id')
  const delivery_type = cookieStore.get('delivery_type')

  const banners = await getBanners({ page: 1, limit: 10 })
    .then((res) => res?.data)
    .catch((err) => err?.response?.data)
  const categories = await getGategoryList({
    page: 1,
    limit: 40,
    is_active: true,
    menu_id: menu_id?.value,
    delivery_type: delivery_type?.value,
  })
    .then((res) => res?.data)
    .catch((err) => err?.response?.data)

  const category = await getCategoryById(slug)
    .then((res) => res?.data)
    .catch((err) => err?.response?.data)

  let products: any[] = []

  if (category) {
    let result = await getProducts({
      page: 1,
      limit: 50,
      category_id: category.id,
      fields:
        'modifiers,properties,variants,properties_obj,product_property,image,discounts,description,product_type,tags,type,slug,has_modifier',
      product_types: 'origin,simple,combo',
      menu_id: menu_id?.value || '',
      delivery_type: delivery_type?.value,
      tag_ids: searchParams?.tags || '',
    })
      .then((res) => res.data)
      .catch((err) => err?.response?.data)
    products = [result]
  }

  return [categories, category, products, banners]
}

export default async function HomePage({
  params: { slug, child },
  searchParams,
}: {
  params: { slug: string; child: string }
  searchParams?: {
    tags?: string
  }
}) {
  const [
    categories,
    categoryWithChildren,
    childCategory,
    category,
    products,
    banners,
  ] = await getData(slug, searchParams)

  return (
    <>
      <Categories
        banners={banners}
        category={category}
        products={products}
        categories={categories}
      />
      <CartBottom />
    </>
  )
}
