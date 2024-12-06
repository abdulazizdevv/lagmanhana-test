import { AxiosResponse } from 'axios'
import { request } from './http-client'

interface ISetting {
  id: string
  objectId: string
  objectType: 'shipper'
  field: 'time_distance_priority'
  value: {
    value: boolean
  }
  shipperId: string
}

export const getSettings = (
  params: {
    page?: number
    limit?: number
    fields: string
  } = {
    page: 1,
    limit: 10,
    fields: '',
  }
): Promise<AxiosResponse<{ settings: ISetting[]; count: number }>> =>
  request.get('/v2/settings', { params })
