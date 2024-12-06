'use client'

import { IProduct } from '@/_types'
import Products from './components/Products'
import { Suspense, useEffect } from 'react'
import { dataLayerComponent } from '@/_utils/gtm'

function Category({
  h1,
  data,
  products,
}: {
  h1: any
  data: any
  products: IProduct[]
}) {
  // useEffect(() => {
  //   if (products?.length > 0) {
  //     dataLayerComponent({ ecommerce: null })
  //     dataLayerComponent({
  //       event: 'view_item_list',
  //       ecommerce: {
  //         items: products?.map((item) => ({
  //           item_name: item?.title?.ru,
  //           item_id: item?.id,
  //           price: item?.out_price,
  //           item_brand: 'Chicago',
  //           item_category: data?.title?.ru,
  //           index: item?.order,
  //           quantity: 1,
  //         })),
  //       },
  //     })

  //     const allPrice: number =
  //       products?.reduce(
  //         (total: number, el: any) => total + (el?.out_price || 0),
  //         0
  //       ) || 0

  //     dataLayerComponent({
  //       event: 'view_item_list_ads',
  //       value: allPrice,
  //       items: products?.map((el: any) => ({
  //         id: el.id,
  //         google_business_vertical: 'retail',
  //       })),
  //     })

  //     dataLayerComponent({
  //       event: 'view_item_list_fb',
  //       value: allPrice,
  //       content_ids: products?.map((el) => el.id),
  //       content_type: 'product',
  //       currency: 'UZS',
  //     })
  //   }
  // }, [products, data])

  return (
    <>
      <Suspense fallback={<p>Loading feed...</p>}>
        <Products h1={h1} data={products} />
      </Suspense>
    </>
  )
}

export default Category
