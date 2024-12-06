import React, { Suspense } from 'react'
import { cookies } from 'next/headers'
import Orders from '@/_components/Pages/Orders'
import orderService from '@/_services/orderService'
import { Metadata } from 'next'
import Loading from './loading'

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/orders`,
    languages: {
      en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/orders`,
      ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/orders`,
      uz: `${process.env.NEXT_PUBLIC_DOMAIN}/orders`,
    },
  },
}
async function getData(searchParams: { id: string; page: string }) {
  const cookieStore = cookies()

  const user_id = cookieStore.get('user_id')
  const access_token = cookieStore.get('access_token')

  if (user_id) {
    const data = await orderService
      .getList(
        user_id.value,
        {
          headers: { Authorization: access_token?.value },
        },
        {
          page: searchParams?.page || 1,
          limit: 20,
        }
      )
      .then((res) => res?.data)

    return data
  }

  return { orders: [], count: 0, user_id: user_id }
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const data = await getData(searchParams)
  return (
    <Suspense fallback={<Loading />}>
      <Orders ordersData={data} />
    </Suspense>
  )
}
