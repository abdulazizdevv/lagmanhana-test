import { useQuery } from '@tanstack/react-query'
import { request } from './http-client'

const customerService = {
  verifyOTP: (data: any) => request.post('/v1/customers/confirm-login', data),
  registerConfirm: (data: any) =>
    request.post('/v1/customers/register-confirm', data),
  register: (data: any) => request.post('/v1/customers/register', data),
  login: (data: any) => request.post('/v1/customers/login', data),
  update: (id: string, data: any) => request.put('/v1/customers/' + id, data),
}

export const addressService = {
  getList: (params: any) => request.get('/v1/customer_address', { params }),
}

export const getShipperById = (id: string) => request.get(`/v1/shippers/${id}`)

export const getSourceSettings = (id: string) =>
  request.get(`/v2/source-settings/${id}`)
export const getSourceSettingsV3 = (id: string) =>
  request.get(`/v3/source-settings/${id}`)

export const getIikoCustomerInfo = (params: any) =>
  request.post('/v2/crm/iiko-customer-info', undefined, { params })

export const getUserReviews = (params: any) =>
  request.get('/v1/user_reviews', { params }).then((res) => res.data)

export default customerService

export const useShipperById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ['get_shipper'],
    queryFn: () => getShipperById(id).then((res) => res.data),
  })
}
