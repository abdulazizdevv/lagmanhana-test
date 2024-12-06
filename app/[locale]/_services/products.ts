import { CategoryListResponse, IProduct } from '@/_types'
import { request } from './http-client'
import { useQuery } from '@tanstack/react-query'

export const getProducts = (params: any) =>
  request.get('/v2/product', { params })

export function getGategoryList(params?: any) {
  return request.get('/v2/category', { params })
}

export const getCategoryById = (id: string) => request.get('/v2/category/' + id)

export const getProductFavourites = (params: any) =>
  request.get('/v2/product-favourites', { params })

export const getAutoAddProduct = (params: any) =>
  request.get('/v2/auto-add-product', { params }).then((res) => res?.data)

export const getCategoriesWithProducts = () =>
  request.get('/v2/category-with-products', { params: { page: 1, limit: 20 } })

export const getProductModifier = (params: any) =>
  request.get('/v2/modifier', { params })

export const getProductById = (id: string, params: any) =>
  request.get('/v2/product/' + id, { params })

export const getComboById = (id: string) => request.get('/v2/combo/' + id)

export const getCategoryWithChildren = (id: string, params: any) =>
  request.get('/v2/category-with-children/' + id, { params })

export const getMenuProducts = (params: any) =>
  request.get('/v2/menu-products', { params })

export const useProductList = ({
  params,
  props = { enabled: false },
}: {
  params: any
  props: any
}) => {
  return useQuery<{ products: IProduct[]; count: string }, Error>({
    queryKey: ['product_list', props, params],
    queryFn: () => getProducts(params).then((res) => res?.data),
    ...props,
  })
}
