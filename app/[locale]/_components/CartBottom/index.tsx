'use client'
import { useI18n } from '@/_locales/client'
import { Box, Button, Flex, Text, useMediaQuery } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import NumberToPrice from '../NumberToPrice'
import { useSelector } from 'react-redux'
import { CartItem, IRedux } from '@/_types'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'

const CartBottom = () => {
  const t = useI18n()
  const cartState = useSelector((state: IRedux) => state.cart)
  const [lg] = useMediaQuery('(max-width: 991px)')
  const router = useRouter()
  const total = useMemo(() => {
    let total: number = 0
    let totalCount: number = 0
    cartState?.cart?.forEach((product: CartItem) => {
      totalCount += product.quantity
      total += (product.price_with_discount || 0) * product.quantity
      if (product?.order_modifiers?.length > 0) {
        for (const modifier of product.order_modifiers) {
          total +=
            +modifier.modifier_price *
            +(modifier?.modifier_quantity * product.quantity)
        }
      }
    })
    return total
  }, [cartState?.cart])

  return (
    <>
      {cartState?.cart?.length > 0 && lg && (
        <Box
          position='fixed'
          bottom={0}
          w='100%'
          bg='#fff'
          zIndex={999}
          py={6}
          px={4}
        >
          <Button
            w='100%'
            bg={'primary.500'}
            variant='primary.500'
            py={'14px'}
            px={4}
            h={'48px'}
            rounded={12}
            onClick={() => router.push('/cart')}
          >
            <Flex
              justifyContent='space-between'
              w='100%'
              fontSize={14}
              fontWeight={400}
            >
              <Flex alignItems={'center'} gap={2}>
                <Icon
                  icon='basil:shopping-basket-outline'
                  width='20px'
                  height='20px'
                  style={{ color: '#000' }}
                />
                <Text>{t('cart')}</Text>
              </Flex>
              <Text>
                <NumberToPrice unstyled={true} value={total} />
              </Text>
            </Flex>
          </Button>
        </Box>
      )}
    </>
  )
}

export default CartBottom
