import Loading from './loading'
import Product from '@/_components/Pages/Product'
import { Suspense } from 'react'

export default function ProductPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Product />
    </Suspense>
  )
}
