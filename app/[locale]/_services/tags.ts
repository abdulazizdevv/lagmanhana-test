import { useQuery } from '@tanstack/react-query'
import { request } from './http-client'
import { ITag } from '@/_types'

export const getTags = (params: any) => request.get('/v1/tags', { params })

export const useTagsList = ({
  params,
  props = { enabled: true },
}: {
  params: any
  props?: any
}) => {
  return useQuery<{ tags: ITag[]; count: number }, Error>({
    queryKey: ['branch_list', props, params],
    queryFn: () => getTags(params).then((res) => res?.data),
    ...props,
  })
}
