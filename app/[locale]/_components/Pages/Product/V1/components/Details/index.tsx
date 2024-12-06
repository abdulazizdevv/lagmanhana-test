'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../../style.module.scss'
import Modifiers from '../../../components/Modifiers'
import OriginOptions from '../../../components/OriginOptions'
import {
  ADD_TO_CART,
  DECREMENT,
  INCREMENT,
  REMOVE,
} from '@/_store/cart/cart.slice'
import Ingredient from '../../../components/Ingredient'
import { SplideSlide } from '@splidejs/react-splide'
import ComboOptions from '../../../components/ComboOptions'
import { useMemo } from 'react'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import useCartProduct from '@/_hooks/useCartProduct'
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
  useToast,
  useMediaQuery,
} from '@chakra-ui/react'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { getProductFavourites } from '@/_services/products'
import { IRedux, ISavedModifier, ITags } from '@/_types'
import Counter from '@/_components/Counter'
import numToPrice from '@/_utils/numToPrice'
import Link from 'next/link'
import Nutrients from '../../../components/Nutrients'
import Description from '../../../components/Description'
import ProductRating from '../../../components/ProductRating'

import NumberToPrice from '@/_components/NumberToPrice'
import MultipleSlide from '@/_components/MultipleSlide'
import { Icon } from '@iconify/react/dist/iconify.js'
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

function Details({ data, deliveryTime, reviews }: any) {
  const [quantity, setQuantity] = useState(1)
  const [originProps, setOriginProps] = useState([])
  const [modifiersPrice, setModifiersPrice] = useState(0)
  const [currentVariant, setCurrentVariant] = useState([])
  const [orderModifiers, setOrderModifiers] = useState<ISavedModifier[]>([])
  const [productVariants, setProductVariants] = useState<IVariantsMap>({})
  const [modifiersQuantity, setModifiersQuantity] = useState([])
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0)
  const [activeVariant, setActiveVariant] = useState<any | null>(null)
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

  const price: number = useMemo(
    () => activeVariant?.out_price || data?.out_price || 0,
    [activeVariant?.out_price, data?.out_price]
  )

  // const addToCartGTM = useCallback(() => {
  //   // ! dont delete
  //   // dataLayer?.push({ ecommerce: null })
  //   dataLayerComponent({
  //     event: 'add_to_cart',
  //     ecommerce: {
  //       items: [
  //         {
  //           item_name: data.title?.ru,
  //           item_id: data.id,
  //           price: data.out_price,
  //           item_category: data?.categories?.[0]?.title?.ru,
  //           item_list_name: 'Single Product Page',
  //           // item_list_id: router.asPath,
  //           index: data.order,
  //           quantity: quantity,
  //         },
  //       ],
  //     },
  //   })
  //   dataLayerComponent({
  //     event: 'add_to_cart_ads',
  //     value: data?.out_price,
  //     items: [
  //       {
  //         id: data.id,
  //         google_business_vertical: 'retail',
  //       },
  //     ],
  //   })
  //   dataLayerComponent({
  //     event: 'add_to_cart_fb',
  //     value: data?.out_price,
  //     content_ids: [data?.id],
  //     content_type: 'product',
  //     currency: 'UZS',
  //   })
  // }, [])

  const onOrderClick = () => {
    if (data?.id) {
      if (data?.type === 'origin') {
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
          // setOrderModifiers([])
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
      // addToCartGTM()
    }
  }

  // const sendGTM = () => {
  //   dataLayerComponent({
  //     event: 'remove_from_cart',
  //     ecommerce: {
  //       items: [
  //         {
  //           item_brand: 'Chicago',
  //           item_name: data.product_name,
  //           item_id: data.product_id,
  //           price: data.price,
  //           item_category: data.category_name,
  //           item_list_name: 'Cart',
  //           item_list_id: 'cart',
  //           index: 1,
  //           quantity: data.quantity,
  //         },
  //       ],
  //     },
  //   })
  // }
  const onRemoveProduct = () => {
    // sendGTM()
    dispatch(REMOVE(productInCart?.key))
    setQuantity(1)
  }

  const onOptionChange = (val: any, idx: any) => {
    setActiveOptions((prevState: any) =>
      prevState?.map((e: any, i: number) => (i == idx ? val : e))
    )
  }

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
      <Stack
        className={styles.details}
        borderLeft='1px solid'
        borderColor={{ base: 'transparent', md: 'gray.300' }}
        spacing={0}
      >
        <Box px={{ base: 2, md: 4 }} pt={{ base: 2, md: 6 }} flex={1}>
          <Stack
            pe={{ base: 0, md: 2 }}
            pb={{ base: 2, md: 0 }}
            maxH={{
              base: 'auto',
              md:
                data?.allergens?.[
                  currentLocale === 'kz' ? 'uz' : currentLocale
                ] && data?.ingredients?.length > 0
                  ? '550px'
                  : data?.ingredients?.length > 0
                  ? '515px'
                  : '400px',
            }}
            // maxW={'368px'}
            overflowY='auto'
            position='relative'
            gap={0}
          >
            <Flex
              mb={0}
              justifyContent={'space-between'}
              align='center'
              gap={2}
            >
              <Text
                fontSize={{ base: '20px', md: 'lg' }}
                fontWeight={700}
                lineHeight={'24px'}
              >
                {data?.type === 'origin' && activeVariant
                  ? activeVariant?.title?.[
                      currentLocale === 'kz' ? 'uz' : currentLocale
                    ]
                  : data?.title?.[
                      currentLocale === 'kz' ? 'uz' : currentLocale
                    ]}{' '}
              </Text>
              <Box display={{ base: 'block', md: 'none' }}>
                <Nutrients data={data} />
              </Box>
            </Flex>
            <Flex flexDir={'column'} gap={2}>
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
              <ProductRating reviews={reviews} data={data} />
              <Flex
                p={2}
                gap={2}
                w='full'
                borderRadius={8}
                bgColor='paper.light.100'
                _dark={{ bgColor: 'paper.dark.400' }}
              >
                <Center>
                  <Text fontWeight={500}>
                    {t('we_deliver_time', {
                      deliveryTime: commonState?.branch
                        ?.future_delivery_order_time
                        ? commonState?.branch?.future_delivery_order_time
                        : deliveryTime,
                    })}
                  </Text>
                </Center>
              </Flex>
              <Description data={data} />
              <OriginOptions
                originProps={originProps}
                activeOptions={activeOptions}
                productVariants={productVariants}
                onOptionChange={onOptionChange}
              />
              <ComboOptions
                product={data}
                currentVariant={currentVariant}
                setCurrentVariant={setCurrentVariant}
              />
              <Modifiers
                product={activeVariant ? activeVariant : data}
                quantity={quantity}
                orderModifiers={orderModifiers}
                modifiersQuantity={modifiersQuantity}
                setOrderModifiers={setOrderModifiers}
                setModifiersQuantity={setModifiersQuantity}
              />
            </Flex>
          </Stack>
        </Box>
        <HStack
          py={3}
          px={4}
          w='full'
          bottom={0}
          justify='space-between'
          borderTop='1px solid'
          borderColor='gray.300'
          align={{ md: 'center' }}
          className={styles.actions}
          flexDir={{ base: 'column', md: 'row' }}
          position={{ base: 'fixed', md: 'static' }}
          bgColor={{ base: 'white', md: 'transparent' }}
          _dark={{ bgColor: { base: 'paper.dark.500', md: 'transparent' } }}
        >
          <Flex
            align='center'
            justify='space-between'
            flex={1}
            fontSize='xl'
            mb={{ base: '2px', md: 0 }}
          >
            <Text fontSize='sm' display={{ base: 'inline', md: 'none' }}>
              {t('price_product')}
            </Text>
            <Text fontWeight={700}>
              {data?.discounts?.length > 0 && (
                <Text as='span' textDecoration='line-through'>
                  {numToPrice(
                    productInCart?.quantity
                      ? (price + modifiersPrice) * productInCart.quantity
                      : (price + modifiersPrice) * quantity
                  )}
                </Text>
              )}{' '}
              <NumberToPrice
                textProps={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#101828',
                }}
                spanProps={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#101828',
                }}
                value={
                  productInCart?.quantity
                    ? (price + modifiersPrice + totalDiscountPrice) *
                      productInCart.quantity
                    : (price + modifiersPrice + totalDiscountPrice) * quantity
                }
              />
            </Text>
          </Flex>
          <Flex gap={4} pb={{ base: 2, md: 0 }}>
            {isOrdered && (
              <Counter
                rounded={'12px'}
                height={'48px'}
                variable={
                  productInCart?.quantity ? productInCart.quantity : quantity
                }
                onIncrease={() =>
                  productInCart?.quantity
                    ? dispatch(INCREMENT(productInCart?.key))
                    : setQuantity((prevState) => ++prevState)
                }
                onDecrease={() =>
                  productInCart?.quantity
                    ? productInCart.quantity > 1
                      ? dispatch(DECREMENT(productInCart?.key))
                      : onRemoveProduct()
                    : quantity > 1
                    ? setQuantity((prevState) => --prevState)
                    : setQuantity(1)
                }
              />
            )}
            {isOrdered ? (
              <Button
                href='/cart'
                variant='primary'
                as={Link}
                fontSize={14}
                fontWeight={400}
                flex={1}
                borderRadius={'12px'}
                leftIcon={
                  <Icon
                    icon='basil:shopping-basket-outline'
                    width='20px'
                    height='20px'
                    style={{ color: '#000' }}
                  />
                }
                h={'48px'}
              >
                {t('add_to_cart_product')}
              </Button>
            ) : (
              <Button
                onClick={() => onOrderClick()}
                variant='primary'
                isDisabled={Boolean(
                  !data ||
                    (commonState?.branch?.menu_id && !data?.active_in_menu)
                )}
                h={'48px'}
                flex={1}
                fontSize={14}
                fontWeight={500}
              >
                {t('add_to_cart')}
              </Button>
            )}
          </Flex>
        </HStack>
      </Stack>
    </>
  )
}

export default Details
