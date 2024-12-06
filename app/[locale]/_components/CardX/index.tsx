'use client'

import React from 'react'

import { useState, useEffect, useCallback } from 'react'
// Style
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import styles from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { DECREMENT, INCREMENT, REMOVE } from '@/_store/cart/cart.slice'
import {
  CartItem,
  IComBoGroup,
  IGroupModifier,
  IGroupModifierVariant,
  ISavedModifier,
  IProduct,
  ISingleModifier,
  IRedux,
} from '@/_types'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import NumberToPrice from '@/_components/NumberToPrice'
import Counter from '@/_components/Counter'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  getComboById,
  getProductById,
  getProductModifier,
} from '@/_services/products'
import { parseCookies } from 'nookies'
import ConfirmModal from '../ConfirmModal'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import Image from 'next/image'
import DeleteIcon from '@/_assets/illustration/DeleteIcon'
import { dataLayerComponent } from '@/_utils/gtm'

interface IProps {
  product: CartItem
  h1?: string
  size?: string
  readOnly?: boolean
  customEvents?: boolean
  price?: number
  index?: number

  customRemove?: (e: CartItem) => void
  customIncrement?: (e: CartItem) => void
  customDecrement?: (e: CartItem) => void
}

function CardX({
  h1,
  index,
  price,
  product,
  readOnly,
  size = 'md',
  customEvents,
  customRemove = () => {},
  customIncrement = () => {},
  customDecrement = () => {},
}: IProps) {
  const [isDialog, setDialog] = useState(false)
  const [variantsInfo, setVariantsInfo] = useState<any[]>([])
  const [modifiersData, setModifiersData] = useState<any[]>([])
  const [orderModifiers, setOrderModifiers] = useState<any[]>([])
  const [isOrderPopup, setOrderPopup] = useState<boolean>(false)
  const [modifiersPrice, setModifiersPrice] = useState<number>(0)
  const [isModifiersMounted, setModifiersMounted] = useState(false)
  const [modifiersQuantity, setModifiersQuantity] = useState<any[]>([])

  const t = useI18n()
  const dispatch = useDispatch()
  const cartState = useSelector((state: IRedux) => state.cart)
  const currentLocale = useCurrentLocale()

  const cookies = parseCookies()

  const {
    data: modifiers,
  }: UseQueryResult<
    { product_modifiers: { group_modifiers: any[]; single_modifiers: any[] } },
    Error
  > = useQuery({
    queryKey: ['modifier', product?.product_id],
    queryFn: () =>
      getProductModifier({ product_id: product?.product_id }).then(
        (res) => res.data
      ),
    enabled: Boolean(product?.order_modifiers?.length > 0),
  })

  const { data: comboData, error: comboError } = useQuery({
    queryKey: ['combo', product.product_id],
    queryFn: () => getComboById(product.product_id).then((res) => res.data),
    enabled: Boolean(
      product?.type === 'combo' && product?.variants?.length > 0
    ),
  })

  const {
    data: productData,
    error: productError,
  }: UseQueryResult<IProduct, Error> = useQuery({
    queryKey: ['product', product?.product_id],
    queryFn: () =>
      getProductById(product?.product_id, {
        order_source: 'website',
        only_delivery: cookies.delivery_type
          ? cookies.delivery_type === 'delivery'
          : true,
        only_self_pickup: cookies.delivery_type
          ? cookies.delivery_type === 'self-pickup'
          : true,
        branch_id: cookies?.branch_id || undefined,
        client_id: cookies?.user_id || undefined,
        with_discounts: true,
      }).then((res) => res?.data),
    enabled: Boolean(product?.product_id),
  })

  const onIncrease = () => {
    if (customEvents) {
      customIncrement(product)
    } else {
      const maxQty = product?.max_qty || Infinity

      if (product?.quantity < maxQty) {
        dispatch(INCREMENT(product?.key))
      }
    }

    // incrementGTM()
  }

  // const incrementGTM = () => {
  //   const data = {
  //     item_name:
  //       productData?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
  //     item_id: product?.product_id,
  //     price: product?.price,
  //     item_category:
  //       productData?.categories?.[0]?.title[
  //         currentLocale === 'kz' ? 'uz' : currentLocale
  //       ],
  //     // item_list_name: 'Search Results',
  //     // item_list_id: 'SR123',
  //     index: productData?.order,
  //     quantity: product?.quantity + 1,
  //   }

  //   // dataLayerComponent({
  //   //   event: 'add_to_cart',
  //   //   ecommerce: {
  //   //     items: [data],
  //   //   },
  //   // })
  //   // dataLayerComponent({
  //   //   event: 'add_to_cart_ads',
  //   //   value: productData?.out_price,
  //   //   items: [
  //   //     {
  //   //       id: productData?.id,
  //   //       google_business_vertical: 'retail',
  //   //     },
  //   //   ],
  //   // })
  //   // dataLayerComponent({
  //   //   event: 'add_to_cart_fb',
  //   //   value: productData?.out_price,
  //   //   content_ids: [productData?.id],
  //   //   content_type: 'product',
  //   //   currency: 'UZS',
  //   // })
  // }

  const onDecrease = () => {
    if (customEvents) {
      customDecrement(product)
    } else {
      const minQty = product?.min_qty || 1
      if (product?.quantity > minQty) {
        dispatch(DECREMENT(product.key))
      } else {
        const isOptional = product?.is_optional
        const quantityLessOrEqualMinQty = product?.quantity <= minQty

        if (quantityLessOrEqualMinQty) {
          setDialog(isOptional !== undefined ? isOptional : true)
        } else {
          setDialog(true)
        }
      }
    }
  }

  const onRemove = () => {
    if (customEvents) {
      customRemove(product)
    } else {
      // removeGTM()
      dispatch(REMOVE(product?.key))
    }
  }

  // const removeGTM = () => {
  //   const data = {
  //     item_name:
  //       productData?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
  //     item_id: product?.product_id,
  //     price: product?.price,
  //     item_category:
  //       productData?.categories[0]?.title?.[
  //         currentLocale === 'kz' ? 'uz' : currentLocale
  //       ],
  //     item_list_name: 'Cart',
  //     item_list_id: 'cart1',
  //     index: productData?.order,
  //     quantity: product?.quantity - 1 > 0 ? product?.quantity : 1,
  //   }
  //   dataLayerComponent({
  //     event: 'remove_from_cart',
  //     ecommerce: {
  //       items: [data],
  //     },
  //   })
  // }

  const getModifierInCart = useCallback(
    (modifierId: string) => {
      let result: ISavedModifier = {
        modifier_id: '',
        modifier_price: 0,
        modifier_quantity: 0,
      }

      cartState?.cart?.map(
        (item: CartItem) =>
          product?.key == item.key &&
          item.order_modifiers.map((mod: ISavedModifier) =>
            mod.modifier_id === modifierId ? (result = mod) : mod
          )
      )
      return result
    },
    [cartState?.cart, product?.key]
  )

  // Combo variants
  useEffect(() => {
    if (comboData && product?.variants) {
      // If products is combo, get info about variants
      let variantMap: any[] = []
      comboData.groups.map((group: IComBoGroup, idx: number) => {
        if (group.id === product?.variants?.[idx]?.group_id) {
          group.variants.map((variant) => {
            if (variant.id === product?.variants[idx].variant_id) {
              variantMap.push(variant)
            }
          })
        }
      })
      setVariantsInfo(variantMap)
    }
  }, [comboData, product])

  useEffect(() => {
    if (modifiers?.product_modifiers) {
      let modifiersTitle: any[] = []
      for (const key in modifiers.product_modifiers) {
        if (Object.hasOwnProperty.call(modifiers.product_modifiers, key)) {
          if (
            typeof key === 'string' &&
            (key === 'group_modifiers' || key === 'single_modifiers')
          ) {
            const value = modifiers.product_modifiers?.[key]
            if (key == 'single_modifiers' && value)
              value.map((mod: ISingleModifier) => {
                const modifierInCart: ISavedModifier | undefined =
                  getModifierInCart(mod.id)
                if (modifierInCart?.modifier_id) {
                  modifiersTitle.push({
                    id: mod.id,
                    title: mod.name,
                    price: mod.price,
                    quantity: modifierInCart?.modifier_quantity,
                  })
                }
              })
            if (key == 'group_modifiers' && value)
              value.map((mod: IGroupModifier) =>
                mod?.variants?.map((variant: IGroupModifierVariant) => {
                  const modifierInCart: ISavedModifier = getModifierInCart(
                    variant.id
                  )
                  if (modifierInCart?.modifier_id) {
                    modifiersTitle.push({
                      id: variant.id,
                      title: variant.title,
                      price: variant.out_price,
                      quantity: modifierInCart.modifier_quantity,
                    })
                  }
                })
              )
          }
        }
      }
      setModifiersData(modifiersTitle)
    }
  }, [modifiers?.product_modifiers, getModifierInCart])

  // const modifierQuantityHandler = (modifierId: string) => {
  //   const element = orderModifiers.find(
  //     (item) => item.modifier_id === modifierId
  //   )
  //   return element?.modifier_quantity ?? 0
  // }

  // const checkModifierHandler = (modifierId: string) => {
  //   const element = orderModifiers.find(
  //     (item) => item.modifier_id === modifierId
  //   )
  //   return element || false
  // }

  useEffect(() => {
    if (orderModifiers?.length > 0) {
      let sum = 0
      for (const modifier of orderModifiers) {
        sum += modifier.modifier_price * modifier.modifier_quantity
      }
      setModifiersPrice(sum)
    }
  }, [orderModifiers])

  // Filter order modifiers (modifier price == 0 && remove from state)
  useEffect(() => {
    if (orderModifiers.length > 0) {
      const filteredState = orderModifiers.filter(
        (item) => item.modifier_quantity !== 0
      )
      setOrderModifiers(filteredState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifiersQuantity])

  useEffect(() => {
    if (product.order_modifiers?.length > 0 && !isModifiersMounted) {
      setOrderModifiers(product.order_modifiers)
      setModifiersMounted(true)
    }
  }, [product.order_modifiers, isModifiersMounted])

  // useEffect(() => {
  //   if (orderModifiers?.length > 0 && isModifiersMounted) {
  //     dispatch(UPDATE_MODIFIERS({ key: product?.key, data: orderModifiers }))
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [orderModifiers, product?.key, isModifiersMounted])

  // Select first group modifiers, save group modifiers id & min_amount to state
  // useEffect(() => {
  //   if (
  //     isOrderPopup &&
  //     product?.order_modifiers?.length > 0 &&
  //     modifiers?.product_modifiers?.group_modifiers
  //   ) {
  //     let modifiersQuantityMock: any[] = []
  //     modifiers?.product_modifiers?.group_modifiers?.map((group) => {
  //       modifiersQuantityMock.push({
  //         id: group.id,
  //         quantity: group.min_amount,
  //       })
  //     })
  //     setModifiersQuantity(modifiersQuantityMock)
  //   }
  // }, [modifiers, product?.order_modifiers?.length, isOrderPopup])

  useEffect(() => {
    if (productError || comboError) {
      dispatch(REMOVE(product?.key))
    }
  }, [comboError, dispatch, product?.key, productError])

  return (
    <>
      <Card
        direction='row'
        alignItems={{ base: 'end', md: 'center' }}
        overflow='hidden'
        borderRadius='none'
        borderBottom='1px solid #FFFFFF12'
        boxShadow='none'
      >
        {product?.order_modifiers?.length > 0 && size === 'small' && (
          <Button
            colorScheme='primary'
            variant='ghost'
            size='sm'
            className={styles.edit}
            onClick={() => setOrderPopup(true)}
          >
            {t('change')}
          </Button>
        )}
        <CardBody p={3}>
          <HStack gap={4} alignItems={'start'}>
            <AspectRatio
              minW={{ base: '48px', md: '80px' }}
              ratio={1 / 1}
              overflow='hidden'
              borderRadius='lg'
            >
              <Image
                src={
                  productData?.image
                    ? process.env.BASE_URL + productData?.image
                    : defaultImage
                }
                alt={`${
                  h1
                    ? h1
                    : productData?.title?.[
                        currentLocale === 'kz' ? 'uz' : currentLocale
                      ]
                } - photo ${index}`}
                // alt={
                //   'Photo - ' +
                //   productData?.title?.[
                //     currentLocale
                //   ]
                // }
                style={{ objectFit: 'cover' }}
                sizes='(max-width: 768px) 48px, (min-width: 768px) and (max-width: 1200px) 80px, 100px'
                fill
              />
            </AspectRatio>
            <Stack
              flex={1}
              flexDir={'row'}
              alignItems={'start'}
              justify='space-between'
              // color={product?.in_stop ? 'gray.200' : ''}
            >
              <Stack>
                <Flex gap={2} flexDir={'column'}>
                  <Text
                    fontWeight={500}
                    lineHeight={'20px'}
                    fontSize={{ base: 'md', lg: 'xl' }}
                  >
                    {
                      productData?.title?.[
                        currentLocale === 'kz' ? 'uz' : currentLocale
                      ]
                    }
                  </Text>
                  <Text
                    fontSize={{ base: 12, md: 'sm' }}
                    color='#626D84'
                    // display={{ base: 'none', lg: 'block' }}
                    maxW={'450px'}
                  >
                    {variantsInfo.length > 0 &&
                      variantsInfo.map((variant, idx) => (
                        <span
                          key={
                            product?.variants?.[idx]?.group_id +
                            product?.variants?.[idx]?.variant_id
                          }
                        >
                          {
                            variant.title?.[
                              currentLocale === 'kz' ? 'uz' : currentLocale
                            ]
                          }{' '}
                          (
                          {product?.variants?.[idx]?.variant_id ===
                            variant.id &&
                            product?.variants?.[idx]?.quantity}{' '}
                          {t('pcs')}){variantsInfo?.length - 1 !== idx && ', '}
                          {}
                        </span>
                      ))}
                    {modifiersData?.map((modifier, idx) => (
                      <span key={modifier.id}>
                        {
                          modifier.title?.[
                            currentLocale === 'kz' ? 'uz' : currentLocale
                          ]
                        }{' '}
                        ({modifier.quantity} {t('pcs')})
                        {modifiersData?.length - 1 !== idx && ', '}
                      </span>
                    ))}
                    {!modifiers &&
                      !variantsInfo.length &&
                      productData?.description &&
                      productData?.description[
                        currentLocale === 'kz' ? 'uz' : currentLocale
                      ].substring(0, 80) +
                        (productData?.description[
                          currentLocale === 'kz' ? 'uz' : currentLocale
                        ].length > 80
                          ? '...'
                          : '')}
                  </Text>
                </Flex>

                <Box display={{ base: 'block', md: 'none' }}>
                  <NumberToPrice
                    value={
                      price
                        ? price
                        : product?.price_with_discount + modifiersPrice
                    }
                    textProps={{
                      fontWeight: 500,
                      color: '#000',
                    }}
                    spanProps={{
                      fontWeight: 500,
                      color: '#000',
                      fontSize: { base: 'sm', md: 'lg' },
                    }}
                  />
                </Box>
                {product?.in_stop && (
                  <Text
                    color='red.400'
                    fontSize={14}
                    fontWeight={400}
                    lineHeight={'20px'}
                  >
                    {t('out_of_stock_text')}
                  </Text>
                )}
              </Stack>

              {product?.in_stop ? (
                <HStack>
                  <HStack alignItems='end' flexDir={'column'} gap={0}>
                    <Box display={{ base: 'none', md: 'block' }}>
                      <NumberToPrice
                        value={
                          price
                            ? price
                            : product?.price_with_discount + modifiersPrice
                        }
                        textProps={{
                          fontWeight: 500,
                          color: '#000',
                          fontSize: { base: 'sm', md: 'lg' },
                        }}
                        spanProps={{
                          fontWeight: 500,
                          color: '#000',
                          fontSize: { base: 'sm', md: 'lg' },
                        }}
                      />
                    </Box>

                    <Button
                      display={{ base: 'none', md: 'flex' }}
                      colorScheme='red'
                      variant={'outline'}
                      fontSize={14}
                      fontWeight={700}
                      borderRadius={'8px'}
                      onClick={onRemove}
                    >
                      {t('delete')}
                    </Button>
                    <IconButton
                      display={{ base: 'flex', md: 'none' }}
                      borderRadius={'8px'}
                      aria-label='delete'
                      icon={<DeleteIcon color={'red'} />}
                      variant='ghost'
                      onClick={onRemove}
                      bg={'#fff'}
                    />
                  </HStack>
                </HStack>
              ) : (
                <HStack alignItems='end' flexDir={'column'} gap={'12px'}>
                  <Box display={{ base: 'none', md: 'block' }}>
                    <NumberToPrice
                      value={
                        price
                          ? price
                          : product?.price_with_discount + modifiersPrice
                      }
                      textProps={{
                        fontWeight: 500,
                        color: '#000',
                        fontSize: { base: 'sm', md: 'lg' },
                      }}
                      spanProps={{
                        fontWeight: 500,
                        color: '#000',
                        fontSize: { base: 'sm', md: 'lg' },
                      }}
                    />
                  </Box>
                  <Box alignSelf={'end'}>
                    <Counter
                      padding={'0px'}
                      size='sm'
                      variable={product?.quantity}
                      onDecrease={onDecrease}
                      onIncrease={onIncrease}
                      isDisabled={readOnly}
                    />
                  </Box>
                </HStack>
              )}
            </Stack>
          </HStack>
        </CardBody>
      </Card>
      <ConfirmModal
        isOpen={isDialog}
        onConfirm={onRemove}
        title={t('attention')}
        onClose={() => setDialog(false)}
        description={t('are_you_sure-product')}
      />
    </>
  )
}

export default CardX
