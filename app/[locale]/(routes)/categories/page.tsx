import { cookies } from 'next/headers'

import {
  getCategoryById,
  getGategoryList,
  getProducts,
} from '@/_services/products'
import { getBanners } from '@/_services/marketing'
import Categories from '@/_components/Categories'
import CartBottom from '@/_components/CartBottom'

async function getData(slug: string) {
  const cookieStore = cookies()

  const menu_id = cookieStore.get('menu_id')
  const delivery_type = cookieStore.get('delivery_type')

  const banners = await getBanners({ page: 1, limit: 10 }).then(
    (res) => res?.data
  )
  const categories = await getGategoryList({
    page: 1,
    limit: 40,
    is_active: true,
    menu_id: menu_id?.value,
    delivery_type: delivery_type?.value,
  }).then((res) => res?.data)

  const category = await getCategoryById(slug)
    .then((res) => res?.data)
    .catch((err) => console.log(err))

  let products: any[] = []

  if (category) {
    products = await getProducts({
      page: 1,
      limit: 50,
      category_id: category.id,
      fields:
        'image,discounts,description,barcode,product_type,ikpu,package_code,type,slug,has_modifier',
      product_types: 'origin,simple,combo',
      menu_id: menu_id?.value || '',
      delivery_type: delivery_type?.value,
    }).then((res) => res.data)
  }

  return [categories, category, products, banners]
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
        categories={categories}
        category={category}
        products={products}
        banners={banners}
      />
      <CartBottom />
    </>
  )
}
