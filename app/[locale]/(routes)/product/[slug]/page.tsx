import HeaderCatalog from '@/_components/HeaderCatalog'
import Product from '@/_components/Pages/Product'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import { getGategoryList, getProductById } from '@/_services/products'
import { cookies } from 'next/headers'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'

// type Props = {
//   params: { locale: string; slug: string }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   try {
//     const { locale, slug } = params
//     const cookieStore = cookies()

//     const user_id = cookieStore.get('user_id')
//     const branch_id = cookieStore.get('branch_id')
//     const menu_id = cookieStore.get('menu_id')
//     const delivery_type = cookieStore.get('delivery_type')

//     const data = await getProductById(slug, {
//       order_source: 'website',
//       only_delivery: delivery_type?.value
//         ? delivery_type.value === 'delivery'
//         : true,
//       only_self_pickup: delivery_type?.value
//         ? delivery_type.value === 'self-pickup'
//         : true,
//       branch_id: branch_id?.value || undefined,
//       menu_id: menu_id?.value || undefined,
//       client_id: user_id?.value || undefined,
//       with_discounts: true,
//     }).then((res) => res?.data)

//     const title = data?.metatag_title[locale]
//       ? data?.metatag_title[locale]
//       : `${data.title[locale]} в Алматы, заказать еду с доставкой на дом`

//     const description = `Закажите ${data.title[locale]} за ${data.out_price} от Abokado и насладитесь вкусной и свежей японской кухней с доставкой в Алматы на дом. Подарки и скидки при первом заказе!`

//     return {
//       title,
//       description,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/product/${slug}`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/product/${slug}`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/product/${slug}`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/kz/product/${slug}`,
//         },
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'Product | Abokado',
//       description: 'Enjoy our foods',
//     }
//   }
// }

async function getData(slug: string) {
  try {
    const cookieStore = cookies()

    const user_id = cookieStore.get('user_id')
    const branch_id = cookieStore.get('branch_id')
    const menu_id = cookieStore.get('menu_id')
    const delivery_type = cookieStore.get('delivery_type')

    const data = await getProductById(slug, {
      order_source: 'website',
      only_delivery: delivery_type?.value
        ? delivery_type.value === 'delivery'
        : true,
      only_self_pickup: delivery_type?.value
        ? delivery_type.value === 'self-pickup'
        : true,
      branch_id: branch_id?.value || undefined,
      menu_id: menu_id?.value || undefined,
      client_id: user_id?.value || undefined,
      with_discounts: true,
    }).then((res) => res?.data)

    const categories = await getGategoryList({
      page: 1,
      limit: 40,
      is_active: true,
      menu_id: menu_id?.value,
      delivery_type: delivery_type?.value,
    })
      .then((res) => res?.data)
      .catch((err) => err)

    const urls = [
      `/v1/user_reviews?related_subject=product&product_id=${data?.id}`,
      `/v1/shippers/${process.env.NEXT_PUBLIC_SHIPPER_ID}`,
    ]
    const multiData = await fetchMultipleUrls(urls)

    return {
      data: data,
      reviews: multiData[0],
      shipper: multiData[1],
      categories: categories,
      statusCode: 200,
    }
  } catch (error) {
    if (error) {
      notFound()
    }
    return {
      data: null,
      reviews: null,
      shipper: null,
      categories: null,
      statusCode: null,
    }
  }
}

export default async function ProductPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const { data, categories, reviews, shipper } = await getData(slug)

  return (
    <Suspense fallback={<Loading />}>
      <HeaderCatalog data={categories} />
      <Product
        data={data}
        reviews={reviews}
        deliveryTime={shipper?.max_delivery_time}
      />
    </Suspense>
  )
}
