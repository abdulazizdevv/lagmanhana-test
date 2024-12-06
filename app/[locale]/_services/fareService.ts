import { request } from './http-client'

export const getComputedPrice = (data: any) =>
  request.patch('/v1/fares/compute-price', data).then((res) => res.data)
