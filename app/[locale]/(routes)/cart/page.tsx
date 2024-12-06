import HeaderCatalog from '@/_components/HeaderCatalog'
import Cart from '@/_components/Pages/Cart'
import { getShipperById } from '@/_services/customerService'
import { getGategoryList } from '@/_services/products'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { getI18n } from '@/_locales/server'
import { Suspense } from 'react'
import Loading from './loading'

// export async function generateMetadata({ params }: any): Promise<Metadata> {
//   try {
//     const t = await getI18n()

//     const title = t('seo.title_seo', {
//       title: t('cart'),
//     })

//     return {
//       title,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${params?.locale}/cart`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/cart`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/cart`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/cart`,
//         },
//       },
//       robots: {
//         index: false,
//         follow: true,
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

  const shipper = await getShipperById(
    process.env.NEXT_PUBLIC_SHIPPER_ID!
  ).then((res) => res?.data)

  return { categories, shipper }
}

const CartPage = async () => {
  const { categories, shipper } = await getData()

  return (
    <Suspense fallback={<Loading />}>
      <HeaderCatalog data={categories} />
      <Cart shipper={shipper} />
    </Suspense>
  )
}

export default CartPage
