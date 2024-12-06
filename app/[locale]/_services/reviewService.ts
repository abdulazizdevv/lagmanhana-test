import { request } from './http-client'

const reviewService = {
  getList: (params: any) => request.get('/v1/user_reviews', { params }),
  create: (data: any) => request.post('/v1/user_reviews', data),
}

export default reviewService
