import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'
import {
  ADD_TO_CART,
  DECREMENT,
  INCREMENT,
  REMOVE,
} from '@/_store/cart/cart.slice'
import styles from '../../../style.module.scss'
import { IProductVariant, IRedux, ISavedModifier } from '@/_types'
import Link from 'next/link'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { useDispatch, useSelector } from 'react-redux'
import numToPrice from '@/_utils/numToPrice'
import NumberToPrice from '@/_components/NumberToPrice'
import Counter from '@/_components/Counter'
import useCartProduct from '@/_hooks/useCartProduct'
import { Icon } from '@iconify/react'
import OriginOptions from '../../../components/OriginOptions'
import ComboOptions from '../../../components/ComboOptions'
import Modifiers from '../../../components/Modifiers'
import BagIcon from '@/_assets/icons/BagIcon'

interface IProductOption {}

interface IVariantsMap {
  [key: string]: any
}

interface IProps {
  data: any
}

function Details({ data }: IProps) {
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

  return (
    <Stack
      className={styles.details}
      // borderLeft={{ base: 'transparent', md: '1px solid' }}
      borderLeft={{ base: '1px solid #fff', md: '1px solid #EAECF0' }}
      borderColor='gray.200'
      spacing={0}
    >
      <Box px={{ base: 2, md: 4 }} pt={6} flex={1}>
        <Stack
          // maxH={
          //   data?.ingredients?.length > 0 &&
          //   data?.allergens?.[currentLocale === 'kz' ? 'uz' : currentLocale]
          //     ? '500px'
          //     : '370px'
          // }
          maxH={{
            base: 'auto',
            md:
              data?.allergens?.[
                currentLocale === 'kz' ? 'uz' : currentLocale
              ] && data?.ingredients?.length > 0
                ? '690px'
                : data?.ingredients?.length > 0
                ? '430px'
                : '520px',
          }}
          overflowY='auto'
          position='relative'
          spacing={4}
          // pr={2}
          pb={2}
          pe={{ base: 0, md: 2 }}
        >
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
        </Stack>
      </Box>
      <HStack
        py={3}
        px={4}
        w='full'
        bottom={0}
        justify='space-between'
        borderTop='1px solid'
        borderColor='gray.200'
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
          fontSize='xl'
          mb={{ base: '10px', md: 0 }}
        >
          <Text fontSize='sm' display={{ base: 'inline', md: 'none' }}>
            {/* {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
             */}
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
          </Text>
          <NumberToPrice
            textProps={{
              fontWeight: 600,
            }}
            value={
              productInCart?.quantity
                ? (price + modifiersPrice + totalDiscountPrice) *
                  productInCart.quantity
                : (price + modifiersPrice + totalDiscountPrice) * quantity
            }
          />
        </Flex>
        <Flex gap={4} pb={{ base: 2, md: 0 }}>
          {isOrdered && (
            <Counter
              variable={
                productInCart?.quantity ? productInCart.quantity : quantity
              }
              height={'48px'}
              onIncrease={() =>
                productInCart?.quantity
                  ? dispatch(INCREMENT(productInCart?.key))
                  : setQuantity((prevState) => ++prevState)
              }
              onDecrease={() =>
                productInCart?.quantity && isOrdered
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
                // <BagIcon color='#fff' />
                <Icon
                  icon='bx:basket'
                  width='1.2em'
                  height='1.2em'
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
                !data || (commonState?.branch?.menu_id && !data?.active_in_menu)
              )}
              flex={1}
              fontSize={14}
              fontWeight={500}
              h={'48px'}
              // color={
              //   branch?.menuId && !data?.active_in_menu
              //     ? 'disabled'
              //     : 'primary'
              // }
            >
              {t('add_to_cart')}
            </Button>
          )}
        </Flex>
      </HStack>
    </Stack>
  )
}

export default Details
