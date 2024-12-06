import React from 'react'
import { cookies } from 'next/headers'
import orderService from '@/_services/orderService'
import Kaspi from '@/_components/Pages/Kaspi'

async function getData(id: string | string[] | undefined) {
  const cookieStore = cookies()

  const access_token = cookieStore.get('access_token')

  if (id && typeof id === 'string') {
    const data = await orderService
      .getById(id, { headers: { Authorization: access_token?.value } })
      .then((res) => res?.data)
      .catch((err) => console.log(err))

    return data
  }

  return null
}

export default async function KaspiPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const data = await getData(searchParams?.id)
  return <Kaspi data={data}></Kaspi>
}
