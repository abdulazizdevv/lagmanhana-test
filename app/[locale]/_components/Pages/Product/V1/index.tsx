'use client'

import { useEffect, useState } from 'react'
import styles from '../style.module.scss'
import Ingredient from '../components/Ingredient'
import { SplideSlide } from '@splidejs/react-splide'
import { useCurrentLocale } from '@/_locales/client'
import { Alert, AlertDescription, Box, Text } from '@chakra-ui/react'
import { ISavedModifier } from '@/_types'
import Gallery from '../components/Gallery'
import AlertIcon from '@/_assets/icons/AlertIcon'
import MultipleSlide from '@/_components/MultipleSlide'
import Details from './components/Details'
import { dataLayerComponent } from '@/_utils/gtm'

interface IProductOption {}

interface IProductVariant {
  id: string
  out_price: number
  discounts: any[]
  title: {
    uz: string
    ru: string
    en: string
  }
}

interface IVariantsMap {
  [key: string]: any
}

function V1({ data, deliveryTime, reviews }: any) {
  const [quantity, setQuantity] = useState(1)
  const [originProps, setOriginProps] = useState([])
  const [modifiersPrice, setModifiersPrice] = useState(0)
  const [orderModifiers, setOrderModifiers] = useState<ISavedModifier[]>([])
  const [productVariants, setProductVariants] = useState<IVariantsMap>({})
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0)
  const [activeVariant, setActiveVariant] = useState<IProductVariant | null>(
    null
  )
  const [activeOptions, setActiveOptions] = useState<IProductOption[] | null>(
    null
  )

  const currentLocale = useCurrentLocale()

  // ! dont delete
  // useEffect(() => {
  //   dataLayerComponent({ ecommerce: null })
  //   dataLayerComponent({
  //     event: 'view_item',
  //     ecommerce: {
  //       items: [
  //         {
  //           item_name: data?.title?.ru,
  //           item_id: data?.id,
  //           price: data?.out_price,
  //           item_category: data?.categories?.[0]?.title?.ru,
  //           index: data?.order,
  //           quantity: quantity,
  //         },
  //       ],
  //     },
  //   })

  //   dataLayerComponent({
  //     event: 'view_item_ads',
  //     value: data?.out_price,
  //     items: [
  //       {
  //         id: data?.id,
  //         google_business_vertical: 'retail',
  //       },
  //     ],
  //   })

  //   dataLayerComponent({
  //     event: 'view_item_list_fb',
  //     value: data?.out_price,
  //     content_ids: [data?.id],
  //     content_type: 'product',
  //     currency: 'UZS',
  //   })
  // }, [data])

  useEffect(() => {
    for (const [key, value] of Object.entries(productVariants)) {
      if (key == activeOptions?.join('_')) {
        setActiveVariant(value)
        break
      } else {
        setActiveVariant(null)
      }
    }
  }, [activeOptions, productVariants])
  // Calculate discounts total price
  useEffect(() => {
    if (activeVariant?.discounts) {
      let sum = 0
      for (const discount of activeVariant.discounts) {
        sum += discount.discount_price
      }
      setTotalDiscountPrice(sum)
    }
  }, [activeVariant?.discounts])

  useEffect(() => {
    if (orderModifiers) {
      let sum = 0
      for (const modifier of orderModifiers) {
        sum += modifier.modifier_price * modifier.modifier_quantity
      }
      setModifiersPrice(sum)
    }
  }, [orderModifiers])

  useEffect(() => {
    if (data && data?.type === 'origin') {
      const variantsMap: { [key: string]: any } = {}
      const optionsMap: { [key: string]: string } = {}
      const firstOptions: any[] = []
      for (const variantProduct of data?.variant_products) {
        let optionIds = ''
        for (let j = 0; j < variantProduct.product_property.length; j++) {
          const element = variantProduct.product_property[j]
          optionsMap[element.option_id] = element.option_id
          if (optionIds.length > 0) {
            optionIds += '_' + element.option_id
          } else {
            optionIds += element.option_id
          }
        }
        variantsMap[optionIds] = variantProduct
      }
      setProductVariants(variantsMap)
      setOriginProps(data?.properties)
      // Set first options of property to state
      Object.keys(variantsMap)[0]
        ?.split('_')
        .forEach((option) => {
          firstOptions.push(option)
        })
      setActiveOptions(firstOptions)
    }
  }, [data])

  return (
    <>
      <Box
        bg='white'
        rounded={{ base: 16, md: '3xl' }}
        className={styles.product}
      >
        <Box p={{ base: 2, md: 6 }}>
          <Gallery data={data} />
          {(data?.ingredients?.length > 0 ||
            data?.allergens?.[
              currentLocale === 'kz' ? 'uz' : currentLocale
            ]) && (
            <Box mt={4} className={styles.additional}>
              <Text fontWeight={500}>Ingredients</Text>

              <Box maxW='80vw' margin={'0 auto'} overflow='hidden'>
                {data?.ingredients?.length > 0 && (
                  <MultipleSlide
                    options={{
                      perPage: 5,
                      // data?.ingredients?.length < 7
                      //   ? data?.ingredients?.length
                      //   : 5,
                      arrows: false,
                      breakpoints: {
                        640: {
                          perPage:
                            data?.ingredients?.length < 4
                              ? data?.ingredients?.length
                              : 4,
                          // focus: 'center',
                        },
                      },
                    }}
                  >
                    {data?.ingredients?.map((item: any) => (
                      <SplideSlide key={item?.id}>
                        <Ingredient data={item} />
                      </SplideSlide>
                    ))}
                  </MultipleSlide>
                )}
              </Box>
              {data?.allergens?.[
                currentLocale === 'kz' ? 'uz' : currentLocale
              ] && (
                <Alert
                  bg={'#F4924326'}
                  status='warning'
                  borderRadius={'12px'}
                  mt={5}
                  py={2}
                  px={4}
                >
                  <AlertIcon />
                  <AlertDescription ms={2} color={'#F49243'}>
                    {
                      data?.allergens?.[
                        currentLocale === 'kz' ? 'uz' : currentLocale
                      ]
                    }
                  </AlertDescription>
                </Alert>
              )}
            </Box>
          )}
        </Box>
        <Details data={data} deliveryTime={deliveryTime} reviews={reviews} />
      </Box>
    </>
  )
}

export default V1
