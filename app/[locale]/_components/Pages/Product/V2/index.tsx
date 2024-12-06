'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../style.module.scss'
import { ADD_TO_CART, REMOVE } from '@/_store/cart/cart.slice'
import Ingredient from '../components/Ingredient'
import { SplideSlide } from '@splidejs/react-splide'
import { useMemo } from 'react'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import useCartProduct from '@/_hooks/useCartProduct'
import {
  Alert,
  AlertDescription,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  useMediaQuery,
} from '@chakra-ui/react'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { getProductFavourites } from '@/_services/products'
import { IRedux, ISavedModifier, ITags } from '@/_types'
import MultipleSlide from '@/_components/MultipleSlide'
import Nutrients from '../components/Nutrients'
import Description from '../components/Description'
import ProductRating from '../components/ProductRating'
import Gallery from '../components/Gallery'
import AlertIcon from '@/_assets/icons/AlertIcon'
import Details from './components/Details'

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

function V2({ data, deliveryTime, reviews }: any) {
  const [quantity, setQuantity] = useState(1)
  const [originProps, setOriginProps] = useState([])
  const [modifiersPrice, setModifiersPrice] = useState(0)
  const [currentVariant, setCurrentVariant] = useState([])
  const [orderModifiers, setOrderModifiers] = useState<ISavedModifier[]>([])
  const [productVariants, setProductVariants] = useState<IVariantsMap>({})
  const [modifiersQuantity, setModifiersQuantity] = useState([])
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0)
  const [activeVariant, setActiveVariant] = useState<IProductVariant | null>(
    null
  )
  const [activeOptions, setActiveOptions] = useState<IProductOption[] | null>(
    null
  )
  const [md] = useMediaQuery('max-width: 768px')
  const t = useI18n()
  const toast = useToast()
  const dispatch = useDispatch()
  const currentLocale = useCurrentLocale()
  const { user } = useSelector((state: IRedux) => state.auth)
  const commonState = useSelector((state: IRedux) => state.common)
  const { isOrdered, productInCart } = useCartProduct(
    activeVariant ? activeVariant.id : data?.id,
    orderModifiers,
    currentVariant
  )

  const { data: favouritesData }: UseQueryResult<{ favourites: any[] }, Error> =
    useQuery({
      queryKey: [
        'product-favourites',
        activeVariant ? activeVariant.id : data?.id,
      ],
      queryFn: () =>
        getProductFavourites({
          product_ids: activeVariant ? activeVariant.id : data?.id,
          menu_id: commonState?.branch?.menu_id
            ? commonState?.branch?.menu_id
            : '',
        }).then((res) => res.data),
    })

  const price: number = useMemo(
    () => activeVariant?.out_price || data?.out_price || 0,
    [activeVariant?.out_price, data?.out_price]
  )

  const addToCartGTM = useCallback(() => {
    // ! dont delete
    // dataLayer?.push({ ecommerce: null })
    // dataLayer?.push({
    //   event: 'add_to_cart',
    //   ecommerce: {
    //     items: [
    //       {
    //         item_name: data.title?.ru,
    //         item_id: data.id,
    //         price: data.out_price,
    //         item_category: data?.categories?.[0]?.title?.ru,
    //         item_list_name: 'Single Product Page',
    //         item_list_id: router.asPath,
    //         index: data.order,
    //         quantity: quantity,
    //       },
    //     ],
    //   },
    // })
    // dataLayer?.push({ items: null })
    // dataLayer?.push({ content_ids: null })
    // dataLayer?.push({
    //   event: 'add_to_cart_ads',
    //   value: data?.out_price,
    //   items: [
    //     {
    //       id: data.id,
    //       google_business_vertical: 'retail',
    //     },
    //   ],
    // })
    // dataLayer?.push({
    //   event: 'add_to_cart_fb',
    //   value: data?.out_price,
    //   content_ids: [data?.id],
    //   content_type: 'product',
    //   currency: 'UZS',
    // })
  }, [])

  const onOrderClick = () => {
    if (data?.id) {
      if (data?.type == 'origin') {
        if (activeVariant) {
          dispatch(
            ADD_TO_CART({
              price_with_discount: activeVariant.out_price + totalDiscountPrice,
              price: activeVariant?.out_price,
              client_id: user ? user.id : '',
              product_id: activeVariant?.id,
              type: 'variant',
              variants: [],
              order_modifiers: orderModifiers,
              quantity: quantity,
              category_name:
                data.categories?.[0].title?.[
                  currentLocale === 'kz' ? 'uz' : currentLocale
                ],
              product_name:
                data.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
            })
          )
          setOrderModifiers([])
        } else {
          toast({
            title: 'Variantlardan birini tanlang',
            status: 'warning',
            isClosable: true,
          })
        }
      } else if (data?.type == 'combo') {
        dispatch(
          ADD_TO_CART({
            price_with_discount: data?.out_price + totalDiscountPrice,
            price: data?.out_price,
            client_id: user ? user.id : '',
            product_id: data?.id,
            type: 'combo',
            variants: currentVariant,
            order_modifiers: orderModifiers,
            quantity: quantity,
            category_name:
              data.categories[0].title?.[
                currentLocale === 'kz' ? 'uz' : currentLocale
              ],
            product_name:
              data.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
          })
        )
      } else {
        dispatch(
          ADD_TO_CART({
            price: price,
            price_with_discount: price + totalDiscountPrice,
            client_id: user ? user.id : '',
            product_id: data?.id,
            type: data?.type,
            variants: [],
            order_modifiers: orderModifiers,
            quantity: quantity,
            category_name:
              data?.categories?.[0]?.title?.[
                currentLocale === 'kz' ? 'uz' : currentLocale
              ],
            product_name:
              data.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
          })
        )
      }
      addToCartGTM()
    }
  }

  const onRemoveProduct = () => {
    dispatch(REMOVE(productInCart?.key))
    setQuantity(1)
  }

  const onOptionChange = (val: any, idx: any) => {
    setActiveOptions((prevState: any) =>
      prevState?.map((e: any, i: number) => (i == idx ? val : e))
    )
  }

  // ! dont delete
  // useEffect(() => {
  //   if (typeof dataLayer !== 'undefined') {
  //     dataLayer?.push({ ecommerce: null })
  //     dataLayer?.push({
  //       event: 'view_item',
  //       ecommerce: {
  //         items: [
  //           {
  //             item_name: data?.title?.ru,
  //             item_id: data?.id,
  //             price: data?.out_price,
  //             item_category: data?.categories?.[0]?.title?.ru,
  //             index: data?.order,
  //             quantity: quantity,
  //           },
  //         ],
  //       },
  //     })
  //     dataLayer?.push({ content_ids: null })
  //     dataLayer?.push({
  //       event: 'view_item_ads',
  //       value: data?.out_price,
  //       items: [
  //         {
  //           id: data?.id,
  //           google_business_vertical: 'retail',
  //         },
  //       ],
  //     })
  //     dataLayer?.push({
  //       event: 'view_item_fb',
  //       value: data?.out_price,
  //       content_ids: [data?.id],
  //       content_type: 'product',
  //       currency: 'UZS',
  //     })
  //   }
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

  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item:
        data?.type === 'origin' && activeVariant
          ? activeVariant?.title?.[
              currentLocale === 'kz' ? 'uz' : currentLocale
            ]
          : data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
      link: '/',
    },
  ]

  return (
    <>
      {/* <BreadCrumb items={BreadcrumbData} /> */}
      <Box bg="white" rounded="3xl" className={styles.product} mt={3}>
        <Box p={{ base: 2, md: 6 }}>
          <Gallery data={data} />
          <Stack spacing={1} mt={8}>
            {/* <Text fontSize='2xl' fontWeight={600} lineHeight={1}>
              {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}{' '}
            </Text> */}
            <Flex justifyContent={'space-between'} align="center" gap={2}>
              <Heading size="lg">
                {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}{' '}
              </Heading>
              <Box display={{ base: 'block', md: 'none' }}>
                <Nutrients data={data} />
              </Box>
            </Flex>
            <Flex alignItems={'center'} gap={3}>
              {data?.weight > 0 && (
                <Flex alignItems={'center'}>
                  {data.weight + t('gram_symbol')}
                  <Box display={{ base: 'none', md: 'block' }}>
                    <Nutrients data={data} />
                  </Box>
                </Flex>
              )}
              {commonState?.branch?.menu_id && !data?.active_in_menu ? (
                <Text color={'red'}>{t('out_stock')}</Text>
              ) : (
                <Text color={'green'}>{t('in_stock')}</Text>
              )}
            </Flex>
            {/* <Nutrients data={data} /> */}
            <ProductRating reviews={reviews} data={data} />
            <Flex
              mt={1}
              p={2}
              gap={2}
              align="center"
              borderRadius={8}
              bgColor="gray.100"
              _dark={{ bgColor: 'paper.dark.400' }}
            >
              <Text fontWeight={600} fontSize="sm">
                {t('we_deliver_time', {
                  deliveryTime: commonState?.branch?.future_delivery_order_time
                    ? commonState?.branch?.future_delivery_order_time
                    : deliveryTime,
                })}
              </Text>
            </Flex>
            <Description data={data} />
          </Stack>
          {data?.ingredients?.length > 0 ||
            (data?.allergens?.[
              currentLocale === 'kz' ? 'uz' : currentLocale
            ] && (
              <Box mt={4}>
                <Box maxW="80vw" margin={'0 auto'} overflow="hidden">
                  {data?.ingredients?.length > 0 && (
                    <MultipleSlide
                      options={{
                        perPage: 7,
                        arrows: false,
                        breakpoints: {
                          640: {
                            focus: 'center',
                            perPage: 5,
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
                    status="warning"
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
            ))}
        </Box>
        <Details data={data} />
      </Box>
    </>
  )
}

export default V2
