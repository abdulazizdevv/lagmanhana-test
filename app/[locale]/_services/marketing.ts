import { request } from './http-client'

export const getBanners = (params: any) => request.get('/v1/banner', { params })
