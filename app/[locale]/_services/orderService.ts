import { request } from './http-client'

const orderService = {
  getList: (id: string, config: any, params: any) =>
    request.get(`/v1/customers/${id}/orders`, {
      ...config,
      params,
    }),
  getById: (id: string, config?: any) => request.get('/v2/order/' + id, config),
  create: (data: any) => request.post('/v2/ondemand-order', data),
  update: (id: string, data: any) => request.put('/v1/customers/' + id, data),
}

export default orderService
