import { MetadataRoute } from 'next'
import { cookies } from 'next/headers'
import {
  IBranch,
  ICategory,
  IGallery,
  INews,
  IProduct,
  IStocks,
  IVacancy,
} from '../app/[locale]/_types/'
import { getGategoryList, getProducts } from '@/_services/products'
import { fetchMultipleUrls } from '@/_services/fetchMultipleUrls'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN

  // Get All Posts from CMS
  const cookieStore = cookies()
  const menu_id = cookieStore.get('menu_id')
  const delivery_type = cookieStore.get('delivery_type')

  const categories = await getGategoryList({
    page: 1,
    limit: 40,
    is_active: true,
    menu_id: menu_id?.value,
    delivery_type: delivery_type?.value,
  }).then((res) => res?.data)

  const products = await getProducts({
    page: 1,
    limit: 500,
    fields:
      'image,discounts,description,barcode,product_type,ikpu,package_code,tags,type,slug,has_modifier',
    product_types: 'origin,simple,combo',
  }).then((res) => res.data)

  const urls = [
    `/v2/news-events?page=1&limit=50&type=news`,
    `/v1/promo?page=1&limit=50`,
    `/v1/branches?page=1&limit=50`,
    `/v2/news-events?page=1&limit=50&type=events`,
    `/v2/vacancy?page=1&limit=50`,
  ]

  const data = await fetchMultipleUrls(urls)

  const categoriesUrls =
    categories?.categories?.map((category: ICategory) => {
      return {
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: new Date(),
      }
    }) || []

  const productsUrls =
    products?.products?.map((products: IProduct) => {
      return {
        url: `${baseUrl}/products/${products.slug}`,
        lastModified: new Date(),
      }
    }) || []

  const newsUrls =
    data[0]?.news_events?.map((news: INews) => {
      return {
        url: `${baseUrl}/news/${news.slug}`,
        lastModified: new Date(),
      }
    }) || []

  const stocksUrls =
    data[1]?.promos?.map((promo: IStocks) => {
      return {
        url: `${baseUrl}/promo/${promo.slug}`,
        lastModified: new Date(),
      }
    }) || []

  const branchesUrls =
    data[2]?.branches?.map((branches: IBranch) => {
      return {
        url: `${baseUrl}/branches/${branches.slug}`,
        lastModified: new Date(),
      }
    }) || []

  const galleryUrls =
    data[3]?.news_events?.map((gallery: IGallery) => {
      return {
        url: `${baseUrl}/gallery/${gallery.slug}`,
        lastModified: new Date(),
      }
    }) || []

  const vacancyUrls =
    data[4]?.vacancies?.map((vacancy: IVacancy) => {
      return {
        url: `${baseUrl}/vacancies/${vacancy.slug}`,
        lastModified: new Date(),
      }
    }) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...categoriesUrls,
    ...productsUrls,
    ...newsUrls,
    ...stocksUrls,
    ...branchesUrls,
    ...galleryUrls,
    ...vacancyUrls,
  ]
}
