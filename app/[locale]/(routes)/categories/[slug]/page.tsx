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
import { notFound } from 'next/navigation'
import CartBottom from '@/_components/CartBottom'

// type Props = {
//   params: { locale: string; slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   try {
//     const { locale, slug } = params
//     const t = await getI18n()
//     const category = await getCategoryById(slug).then((res) => res?.data)

//     const title = category?.metatag_title[locale]
//       ? category?.metatag_title[locale]
//       : `Заказать ${category.title[locale]} в Алматы с доставкой на дом | Abokado доставка еды`

//     const description = category?.metatag_title[locale]
//       ? category?.metatag_title[locale]
//       : `Закажите ${category.title[locale]} от Abokado в Алматы и насладитесь вкусной и свежей японской кухней. Мы привезем Ваш заказ прямо в дом или офис. Быстрая доставка по Алматы. Скидки и подарки.`

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/categories/${slug}`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/categories/${slug}`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/categories/${slug}`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/kz/categories/${slug}`,
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

async function getData(slug: string) {
  try {
    const cookieStore = cookies()

    const user_id = cookieStore.get('user_id')
    const menu_id = cookieStore.get('menu_id')
    const branch_id = cookieStore.get('branch_id')
    const delivery_type: any = cookieStore.get('delivery_type')
    // const urls = [
    //   '/v1/banner',
    //   '/v2/category/' + slug,
    //   `/v2/category-with-products?page=1&limit=20&menu_id=${
    //     menu_id?.value ? menu_id?.value : ''
    //   }&order_source=website&only_delivery=${
    //     delivery_type?.value === 'delivery'
    //   }&only_self_pickup=${
    //     delivery_type?.value === 'self-pickup'
    //   }&branch_id=${branch_id}&client_id=${
    //     user_id?.value ? user_id?.value : ''
    //   }&with_discounts=true`,
    // ]

    // const data = await fetchMultipleUrls(urls)
    // console.log(data)

    const banners = await getBanners({ page: 1, limit: 10 })
      .then((res) => res?.data)
      .catch((err) => console.log(err.response?.data))

    const categories = await getGategoryList({
      page: 1,
      limit: 40,
      is_active: true,
      menu_id: menu_id?.value,
      delivery_type: delivery_type?.value,
    })
      .then((res) => res?.data)
      .catch((err) => console.log(err.response?.data))

    const category = await getCategoryById(slug)
      .then((res) => res?.data)
      .catch((err) => console.log(err.response?.data))

    let products: any[] = []

    if (category) {
      products = await getProducts({
        page: 1,
        limit: 50,
        category_id: category.id,
        fields:
          'image,discounts,description,barcode,product_type,ikpu,package_code,tags,type,slug,has_modifier',
        product_types: 'origin,simple,combo',
        menu_id: menu_id?.value || '',
        delivery_type: delivery_type?.value,
      })
        .then((res) => res.data)
        .catch((err) => console.log(err.response?.data))
    }

    return [categories, category, products, banners]
  } catch (error) {
    if (error) {
      notFound()
    }
    return [null, null, null, null, null]
  }
}

export default async function HomePage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const [categories, category, products, banners] = await getData(slug)
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
