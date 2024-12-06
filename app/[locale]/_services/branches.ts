import { useQuery } from '@tanstack/react-query'
import { request } from './http-client'
import { IBranch, IWorkingHour } from '@/_types'
import { AxiosResponse } from 'axios'

export const getBranches = (params: any) =>
  request.get('/v1/branches', { params })

export const getBranchById = (id: string) => request.get('/v1/branches/' + id)

export const getNearestBranch = (lat: number, long: number) =>
  request.get('/v1/nearest-branch', {
    params: { long: long, lat: lat },
  })

export const getWorkingHours = (
  object_id: string,
  object_type: 'branch_delivery_time'
): Promise<AxiosResponse<{ working_hours: IWorkingHour[] }>> =>
  request.get('/v2/working-hours', {
    params: { object_id, object_type },
  })

export const getBranchDeliveryHours = (params: {
  long: number
  lat: number
  date_time?: string
}): Promise<AxiosResponse<{ branches: IBranch[] }>> =>
  request.get('/v1/branches/delivery-hours', {
    params,
  })

export const useBranchList = ({
  params,
  props = { enabled: false },
}: {
  params: any
  props: any
}) => {
  return useQuery<{ branches: IBranch[] }, Error>({
    queryKey: ['branch_list', props, params],
    queryFn: () => getBranches(params).then((res) => res?.data),
    ...props,
  })
}
