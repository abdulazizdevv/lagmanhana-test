import PopupDisplayer from '@/_components/PopupDisplayer'
import Home from '@/_components/Pages/Home'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import { getBanners } from '@/_services/marketing'
import { getGategoryList, getProducts } from '@/_services/products'
import { cookies } from 'next/headers'
import UpBtn from './_components/FixedMenu/UpBtn'
import CartBottom from './_components/CartBottom'
import { Suspense } from 'react'
import { Skeleton } from '@chakra-ui/react'

async function getData(params: any) {
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
    .catch((err) => err)

  let products: any[] = []
  const subCategories = []

  if (categories?.categories) {
    for (const item of categories?.categories) {
      // categoriesWithChildren.push(item)
      if (item?.child_categories?.length > 0) {
        for (const childItem of item?.child_categories) {
          subCategories.push(childItem)
        }
      }
    }
  }

  if (categories?.categories) {
    if (params?.tag_ids || params?.sort) {
      products = await getProducts({
        page: 1,
        limit: 50,
        fields:
          'image,discounts,description,barcode,product_type,ikpu,package_code,tags,type,slug,has_modifier',
        product_types: 'origin,simple,combo',
        sort: params?.sort || '',
        menu_id: menu_id?.value || '',
        delivery_type: delivery_type?.value,
        tag_ids: params?.tag_ids && String(params?.tag_ids),
      }).then((res) => res.data)
    } else {
      let urls: string[] = []
      for (const item of categories?.categories) {
        urls.push(
          '/v2/product?page=1&limit=50&category_id=' +
            item.id +
            '&fields=image,discounts,description,barcode,categories,product_type,ikpu,package_code,tags,type,slug,has_modifier&product_types=origin,simple,combo&menu_id=' +
            (menu_id?.value || '') +
            `&delivery_type=${
              delivery_type?.value ? delivery_type?.value : ''
            }` +
            (params?.tag_ids ? `&tag_ids=${params?.tag_ids}` : '')
        )
      }
      await fetchMultipleUrls(urls).then((res) => {
        products = res
      })
    }
  }

  const data = await fetchMultipleUrls(['/v2/popup?page=1&limit=10'])

  return [subCategories, categories, products, banners, data[0]]
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const [subCategories, categories, products, banners, popups] = await getData(
    searchParams
  )

  return (
    <Suspense fallback={<Skeleton />}>
      <Home
        categories={categories?.categories}
        products={products}
        banners={banners}
        searchParams={searchParams}
        subCategories={subCategories}
      />
      <PopupDisplayer popups={popups?.popups} />
      {/* <MobileAd /> */}
      <UpBtn />
      <CartBottom />
    </Suspense>
  )
}
