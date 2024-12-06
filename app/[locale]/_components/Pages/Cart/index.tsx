'use client'

import EmptyCart from '@/_assets/illustration/EmptyCart'
import BreadCrumb from '@/_components/Breadcrumb'
import useDebounce from '@/_hooks/useDebounce'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { getNearestBranch } from '@/_services/branches'
import { discountWithProductsRequest } from '@/_services/discountService'
import { getComputedPrice } from '@/_services/fareService'
import { ADD_TO_CART, UPDATE_PRICES } from '@/_store/cart/cart.slice'
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.scss'
import { CartItem, IBranch, IRedux, IShipper } from '@/_types'
import CardX from '@/_components/CardX'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { getAutoAddProduct, getProductFavourites } from '@/_services/products'
import Bill from './components/Bill'
import ClearButton from './components/ClearButton'
import Recommended from '../Checkout/components/Recommended'
import BackIcon from '@/_assets/icons/BackIcon'
import { useRouter } from 'next/navigation'

interface IAutoAddingProduct {
  is_optional: boolean
  product: {
    out_price: number
    slug: string
    title: {
      uz: string
      ru: string
      en: string
    }
    type: 'simple' | 'combo' | 'origin'
  }
  product_id: string
  min_qty: number
  max_qty: number
}

interface IProps {
  shipper: IShipper
}

const Cart = ({ shipper }: IProps) => {
  const t = useI18n()
  const currentLocale = useCurrentLocale()

  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('cart'),
      link: '/cart',
    },
  ]

  const [totalPrice, setTotalPrice] = useState(0)
  const [deliveryPrice, setDeliveryPrice] = useState(0)
  const [nearestBranch, setNearestBranch] = useState<IBranch | null>(null)

  const dispatch = useDispatch()
  const { user } = useSelector((state: IRedux) => state.auth)
  const cartState = useSelector((state: IRedux) => state.cart)
  const { deliveryType, branch, location, deliveryZoneId } = useSelector(
    (state: IRedux) => state.common
  )

  const router = useRouter()
  const productsId = useRef('')

  const debouncedPrice = useDebounce(totalPrice, 300)

  const {
    data: defaultProducts,
  }: UseQueryResult<{ products: IAutoAddingProduct[] }, Error> = useQuery({
    queryKey: ['auto-add-product'],
    queryFn: () =>
      getAutoAddProduct({
        Shipper: process.env.NEXT_PUBLIC_SHIPPER_ID,
        page: 1,
        limit: 10,
        order_type: deliveryType,
        is_active: true,
      }),
  })

  const addToCartHandler = useCallback(
    (product: IAutoAddingProduct) => {
      dispatch(
        ADD_TO_CART({
          is_optional: product?.is_optional,
          price: product?.product?.out_price || 0,
          price_with_discount: product?.product?.out_price || 0,
          client_id: user ? user.id : '',
          product_id: product?.product_id,
          type: product?.product?.type,
          variants: [],
          order_modifiers: [],
          quantity: product?.min_qty,
          min_qty: product?.min_qty,
          max_qty: product?.max_qty,
          default_product: true,
          category_name: product?.product?.slug,
          product_name:
            product?.product?.title?.[
              currentLocale === 'kz' ? 'uz' : currentLocale
            ],
        })
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  )

  useEffect(() => {
    if (defaultProducts && defaultProducts?.products?.length > 0) {
      for (const element of defaultProducts?.products) {
        if (
          !cartState?.cart.some(
            (item: CartItem) => item.product_id === element.product_id
          )
        ) {
          addToCartHandler(element)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToCartHandler, defaultProducts, deliveryType])

  useEffect(() => {
    if (cartState?.cart.length > 0) {
      let total = 0
      cartState?.cart?.map((product: CartItem) => {
        total += (product.price_with_discount || 0) * product.quantity
        if (product?.order_modifiers?.length > 0) {
          for (const modifier of product.order_modifiers) {
            total +=
              +modifier.modifier_price *
              +(modifier?.modifier_quantity * product.quantity)
          }
        }
      })
      setTotalPrice(total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartState?.cart])

  const deliveryPriceHandler = useCallback(
    async (lat: number, long: number) => {
      if (user) {
        getNearestBranch(lat, long)
          .then((res) => {
            if (res.data?.branches) {
              for (let nearestBranch of res.data?.branches) {
                if (nearestBranch.is_active) {
                  setNearestBranch(nearestBranch)
                  break
                }
              }
            }
          })
          .catch((err) => console.log(err))
      }
    },
    [user]
  )

  // Set delivery details & Get delivery price
  useEffect(() => {
    if (deliveryType == 'delivery' && location?.[0]) {
      // if (points.length > 0)
      //   for (const point of points) {
      //     if (point.isActive) {
      //       deliveryPriceHandler(point.location[0], point.location[1])
      //       break
      //     }
      //   }
      deliveryPriceHandler(location[0], location[1])
    } else if (deliveryType == 'self-pickup') setDeliveryPrice(0)
  }, [deliveryType, branch, deliveryPriceHandler, location])

  useEffect(() => {
    if (nearestBranch?.id && location?.[0]) {
      getComputedPrice({
        branch_id: nearestBranch?.id,
        lat: location[0],
        long: location[1],
        order_price: debouncedPrice,
        delivery_zone_id: deliveryZoneId,
      })
        .then((res) => setDeliveryPrice(res.price ? res.price : 0))
        .catch((err) => console.log(err))
    }
  }, [debouncedPrice, nearestBranch?.id, location, deliveryZoneId])

  const discountParams = {
    order_source: 'website',
    branch_id: branch?.id,
    product_ids: String(
      cartState?.cart?.map((product: CartItem) => product.product_id)
    ),
    only_delivery: deliveryType === 'delivery',
    only_self_pickup: deliveryType === 'self-pickup',
    client_id: user?.id,
  }

  const { data: discountWithProducts } = useQuery({
    queryKey: ['DISCOUNT_WITH_PRODUCTS', discountParams],
    queryFn: () => discountWithProductsRequest(discountParams),
    enabled: Boolean(user?.id && totalPrice),
  })

  const { data: favourites }: UseQueryResult<{ favourites: any[] }, Error> =
    useQuery({
      queryKey: ['product-favourites', productsId],
      queryFn: () =>
        getProductFavourites({
          product_ids: productsId.current,
          menu_id: branch?.menu_id ? branch?.menu_id : '',
        }).then((res) => res.data),
    })

  useEffect(() => {
    // Get Product Favourites
    const productIdsArr = []
    if (cartState?.cart.length > 0) {
      for (const product of cartState?.cart) {
        productIdsArr.push(product.product_id)
      }
      productsId.current = productIdsArr.join(',')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartState?.cart])

  useEffect(() => {
    if (discountWithProducts) {
      dispatch(
        UPDATE_PRICES(discountWithProducts?.data?.products_with_discounts)
      )
    }
  }, [discountWithProducts])

  if (!cartState?.cart.length) {
    return (
      <Container>
        <Box mt={{ base: '3px', md: '20px' }}>
          <BreadCrumb items={BreadcrumbData} />
        </Box>
        <Center flexDir='column' minH='80vh'>
          <EmptyCart />
          <Text
            fontWeight={500}
            fontSize='24px'
            lineHeight={'29px'}
            mt={4}
            mb={2}
          >
            {t('your_basket_is_empty')}
          </Text>
          <Text fontWeight={400} mb={4} color='#667085' textAlign='center'>
            {t('order.the_items_you_order_will_appear_here')}
          </Text>
          <Link href='/'>
            <Button
              py={'14px'}
              px={6}
              variant='primary'
              fontWeight={500}
              fontSize={14}
            >
              {t('back_to_menu')}
            </Button>
          </Link>
        </Center>
      </Container>
    )
  }

  return (
    <Container mt={{ base: 0, md: 6 }}>
      <div className={styles.cart}>
        <Box>
          <BreadCrumb items={BreadcrumbData} />
        </Box>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 416px' }}
          className={styles.grid}
          gap={4}
        >
          <GridItem className={styles.box}>
            <HStack
              display={'flex'}
              justify='space-between'
              alignItems={'end'}
              mb={5}
            >
              <Flex alignItems={'center'} gap={2}>
                <IconButton
                  p={0}
                  display={{ base: 'flex', md: 'none' }}
                  aria-label='back'
                  justifyContent={'center'}
                  variant={'ghost'}
                  icon={<BackIcon color='black' />}
                  onClick={() => router.back()}
                />
                <Heading>{t('cart')}</Heading>
              </Flex>
              <ClearButton />
            </HStack>
            <Stack
              divider={<StackDivider h={'1px'} />}
              spacing={0}
              className={styles.card}
            >
              {cartState?.cart?.map((item: CartItem, idx: number) => (
                <CardX
                  h1={t('cart')}
                  index={idx}
                  key={item.key}
                  product={item}
                />
              ))}
            </Stack>
          </GridItem>
          <GridItem pt={{ md: 16 }} zIndex={9}>
            <Bill
              totalPrice={totalPrice}
              deliveryPrice={deliveryPrice}
              minPrice={+shipper?.minimal_order_price}
            />
          </GridItem>
        </Grid>

        {favourites?.favourites && favourites?.favourites?.length > 0 && (
          <Box>
            <Recommended favourites={favourites?.favourites} />
          </Box>
        )}
      </div>
    </Container>
  )
}

export default Cart
