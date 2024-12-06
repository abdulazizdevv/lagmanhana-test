'use client'

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Style
import { useI18n } from '@/_locales/client'
import { EXCLUDE, EXCLUDE_STOP, STOP } from '@/_store/cart/cart.slice'
import numToPrice from '@/_utils/numToPrice'
import { CartItem, IDiscounts, IMenuProduct, IRedux } from '@/_types'
import { useQuery } from '@tanstack/react-query'
import { getMenuProducts } from '@/_services/products'
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import ConfirmModal from '@/_components/ConfirmModal'
import NumberToPrice from '@/_components/NumberToPrice'
import { parseCookies } from 'nookies'

interface IProps {
  paymentData: { [key: string]: number }
  totalPrice: number
  validate: () => boolean
  deliveryPrice: number
  discounts: IDiscounts | null
  minPrice: number
  onSubmit: () => void
  isCreateLoading: boolean
  sourceV3: any
}

function Bill({
  paymentData,
  totalPrice,
  validate,
  deliveryPrice,
  discounts,
  minPrice,
  onSubmit,
  isCreateLoading,
  sourceV3,
}: IProps) {
  const [isOrderConfirm, setIsOrderConfirm] = useState(false)
  const [cashbackAmount, setCashbackAmount] = useState(0)

  const cartState = useSelector((state: IRedux) => state.cart)
  const commonState = useSelector((state: IRedux) => state.common)

  const dispatch = useDispatch()
  const t = useI18n()
  const { menu_id } = parseCookies()

  const onButtonClick = () => {
    const validation = validate()
    if (validation) setIsOrderConfirm(true)
  }

  const { data: menuProducts } = useQuery({
    queryKey: ['menu-products', menu_id],
    queryFn: () =>
      getMenuProducts({
        menu_id: menu_id,
        product_ids: String(
          cartState?.cart?.map((product) => product.product_id)
        ),
      }).then((res) => res.data),
    enabled: Boolean(cartState?.cart?.length > 0 && !!menu_id),
  })

  useEffect(() => {
    if (menuProducts) {
      let productsForStop: any[] = []
      if (cartState?.cart) {
        for (const product of cartState?.cart) {
          const menuProduct = menuProducts?.products?.find(
            (item: IMenuProduct) => item?.productId === product?.product_id
          )
          if (
            !menuProduct?.isActive &&
            !productsForStop.includes(menuProduct?.id)
          ) {
            dispatch(STOP(product?.product_id))
            productsForStop.push(product?.product_id)
            continue
          } else if (!menuProduct) {
            dispatch(STOP(product?.product_id))
            continue
          } else if (product?.in_stop) {
            dispatch(EXCLUDE(product?.product_id))
          }
        }
      }
    }
  }, [menuProducts])

  // Remove product when menu is not found
  useEffect(() => {
    if (!commonState?.branch?.menu_id) {
      dispatch(EXCLUDE_STOP())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonState?.branch?.menu_id])

  const paymentLabel = (e: string) => {
    switch (e) {
      case 'iiko_card':
        return t('iiko_card')
      case 'payme':
        return t('payme')
      case 'click':
        return t('click')
      default:
        return t('cash')
    }
  }
  const calculatedPrice: number = useMemo(
    () =>
      (discounts?.all_discount_price
        ? totalPrice +
          (discounts?.is_delivery_free ? 0 : deliveryPrice) +
          (discounts?.all_discount_price || 0)
        : discounts?.is_delivery_free && deliveryPrice > 0
        ? totalPrice
        : totalPrice + deliveryPrice) - cashbackAmount,
    [
      discounts?.all_discount_price,
      discounts?.is_delivery_free,
      cashbackAmount,
      deliveryPrice,
      totalPrice,
    ]
  )

  useEffect(() => {
    if (paymentData && Object.keys(paymentData)?.length > 1)
      for (const [key, value] of Object.entries(paymentData)) {
        if (key === 'iiko_card' && value > 0) {
          setCashbackAmount(value)
        }
      }
  }, [paymentData])
  // cartState?.cart?.
  const in_stop = cartState?.cart?.some((item) => item.in_stop) || false

  return (
    <>
      <Text fontWeight={700} fontSize='lg' my={4} mb={3}>
        {t('price_includes')}
      </Text>
      <Stack>
        <HStack justify='space-between'>
          <Text>{t('products')}</Text>
          <NumberToPrice value={totalPrice} />
        </HStack>
        {commonState?.deliveryType === 'delivery' && (
          <HStack justify='space-between'>
            <Text>{t('delivery')}</Text>
            <NumberToPrice
              value={discounts?.is_delivery_free ? 0 : deliveryPrice}
              isFreeTextVisible={Boolean(discounts?.is_delivery_free)}
            />
          </HStack>
        )}
        {discounts?.discounts?.map(
          (discount) =>
            discount?.discount_type !== 'promo_code' && (
              <HStack justify='space-between' key={discount.discount_id}>
                <Text color='#4ED896'>{t(discount?.discount_type)}</Text>
                <NumberToPrice value={discount?.discount_price_for_order} />
              </HStack>
            )
        )}
        {paymentData &&
          Object.keys(paymentData)?.length > 1 &&
          Object.entries(paymentData)?.map(
            (payment: [string, number]) =>
              payment[1] > 0 && (
                <HStack justify='space-between' key={payment[0]}>
                  <Text>{paymentLabel(payment[0])}</Text>
                  <NumberToPrice value={payment[1]} />
                </HStack>
              )
          )}
        <Flex
          fontSize='xl'
          justifyContent={'space-between'}
          display={{ base: 'flex', lg: 'none' }}
        >
          <Text fontWeight={700} fontSize={18}>
            К оплате
          </Text>
          <NumberToPrice
            textProps={{
              fontWeight: 700,
              fontSize: 18,
            }}
            spanProps={{
              fontWeight: 700,
              fontSize: 18,
            }}
            value={calculatedPrice}
            unstyled={true}
          />
        </Flex>
        <HStack
          bg='white'
          bottom={0}
          left={0}
          w='full'
          mt={2}
          zIndex={9}
          // justify='space-between'
          py={{ base: 3, lg: 0 }}
          px={{ base: 4, lg: 0 }}
          _dark={{ bg: 'paper.dark.500' }}
          position={{ base: 'fixed', lg: 'static' }}
          boxShadow={{ base: '0px 4px 16px 0px #0000001F', md: 'none' }}
        >
          <Flex
            display={{ base: 'none', lg: 'flex' }}
            justify='space-between'
            align='center'
            w='full'
          >
            <Text fontSize='xl' fontWeight={700}>
              <NumberToPrice value={calculatedPrice} unstyled={true} />
            </Text>
            <Button
              variant='primary'
              onClick={onButtonClick}
              minW={'192px'}
              fontWeight={500}
              fontSize={14}
              isDisabled={
                !sourceV3 ? !sourceV3 : in_stop || minPrice > totalPrice
              }
            >
              {t('to_pay')}
            </Button>
          </Flex>
          <Button
            display={{ base: 'flex', lg: 'none' }}
            justifyContent='space-between'
            w='full'
            variant='primary'
            fontWeight={500}
            mt={2}
            borderRadius={12}
            height={'48px'}
            onClick={onButtonClick}
            isDisabled={
              !sourceV3 ? !sourceV3 : in_stop || minPrice > totalPrice
            }
          >
            <Text fontSize={14} fontWeight={500}>
              {t('to_pay')}
            </Text>
            <NumberToPrice
              textProps={{
                fontWeight: 700,
                fontSize: 16,
              }}
              spanProps={{
                fontWeight: 700,
                fontSize: 16,
              }}
              value={calculatedPrice}
              unstyled={true}
            />
          </Button>
        </HStack>
        {minPrice > totalPrice && (
          <Text color='red'>
            {t('order.minimum_order_amount', {
              price: numToPrice(minPrice),
            })}
          </Text>
        )}
      </Stack>

      <ConfirmModal
        isOpen={isOrderConfirm}
        title={t('attention')}
        description={t('are_you_sure-order')}
        onClose={() => setIsOrderConfirm(false)}
        onConfirm={onSubmit}
      />
    </>
  )
}

export default Bill
