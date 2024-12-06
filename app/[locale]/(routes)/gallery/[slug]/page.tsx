import HeaderCatalog from '@/_components/HeaderCatalog'
import SingleGallery from '@/_components/Pages/Gallery/single'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'
import { getGategoryList } from '@/_services/products'
import { cookies } from 'next/headers'

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

    return {
      data: data[0] ?? null,
      categories: categories ?? null,
      statusCode: 200,
    }
  } catch (err: any) {
    return {
      data: null,
      categories: null,
      statusCode: err?.response?.status ?? null,
    }
  }
}

export default async function SingleNewsPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const { data, categories } = await getData(slug)

  return (
    <>
      <HeaderCatalog data={categories} />
      <SingleGallery data={data} />
    </>
  )
}
