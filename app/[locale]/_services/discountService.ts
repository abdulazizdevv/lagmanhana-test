import { request } from './http-client'

export const getDiscountWithOrderPrice = (params: any) =>
  request
    .get('/v2/discount-with-order-price', { params })
    .then((res) => res.data)

export const discountWithProductsRequest = (params: any) =>
  request.get('/v2/discount-with-products', { params })
