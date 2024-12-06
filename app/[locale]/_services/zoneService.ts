import { request } from './http-client'

export const getCheckPointDeliveryZones = (params: any) =>
  request.get('/v1/check_point_delivery_zones', { params })

export const getActiveDeliveryZones = (params: any) =>
  request.get('/v2/active-delivery-zones', { params })
