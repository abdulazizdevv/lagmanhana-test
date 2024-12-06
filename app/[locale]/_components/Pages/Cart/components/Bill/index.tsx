'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Style
import styles from './style.module.scss'
import { useI18n } from '@/_locales/client'
import { EXCLUDE, EXCLUDE_STOP, STOP } from '@/_store/cart/cart.slice'
import numToPrice from '@/_utils/numToPrice'
import { Button, Card, Center, HStack, Stack, Text } from '@chakra-ui/react'
import { CartItem, IMenuProduct, IRedux } from '@/_types'
import AuthDialog from '@/_components/AuthDialog'
import { useQuery } from '@tanstack/react-query'
import { getMenuProducts } from '@/_services/products'
import { useRouter } from 'next/navigation'
import NumberToPrice from '@/_components/NumberToPrice'
import { parseCookies } from 'nookies'

interface IProps {
  totalPrice: number
  deliveryPrice: number
  minPrice: number
}

function Bill({ totalPrice, deliveryPrice, minPrice }: IProps) {
  const [isAuthDialog, setIsAuthDialog] = useState(false)

  const { user } = useSelector((state: IRedux) => state.auth)
  const cartState = useSelector((state: IRedux) => state.cart)
  const commonState = useSelector((state: IRedux) => state.common)
  const { menu_id } = parseCookies()

  const dispatch = useDispatch()
  const router = useRouter()
  const t = useI18n()

  const onButtonClick = () => {
    if (!user) {
      setIsAuthDialog(true)
    } else {
      router.push('/checkout')
    }
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

  return (
    <>
      <Card
        overflow='auto'
        borderRadius='2xl'
        className={styles.bill}
        position='sticky'
        top='72px'
        boxShadow={'none'}
      >
        <Text fontWeight={700} fontSize='lg' mb={4}>
          {t('total')}
        </Text>
        <Stack>
          <HStack justify='space-between'>
            <Text>{t('products')}</Text>
            <NumberToPrice
              textProps={{
                fontWeight: 500,
                color: '#101828',
              }}
              spanProps={{
                fontWeight: 500,
                color: '#101828',
              }}
              value={totalPrice}
            />
          </HStack>
          <HStack justify='space-between'>
            <Text>{t('delivery')}</Text>
            <NumberToPrice
              textProps={{
                fontWeight: 500,
                color: '#101828',
              }}
              spanProps={{
                fontWeight: 500,
                color: '#101828',
              }}
              value={deliveryPrice}
            />
          </HStack>
          <HStack justify='space-between' mb={2}>
            <Text>{t('amount_to_pay')}</Text>{' '}
            <NumberToPrice
              textProps={{
                fontWeight: 500,
                color: '#101828',
              }}
              spanProps={{
                fontWeight: 500,
                color: '#101828',
              }}
              value={totalPrice + deliveryPrice}
            />
          </HStack>
          <HStack
            boxShadow='none'
            justify='space-between'
            position={{ base: 'fixed', lg: 'static' }}
            bg={'#fff'}
            bottom={0}
            left={0}
            w='full'
            mt={2}
            p={{ base: 4, lg: 0 }}
          >
            <>
              {minPrice > totalPrice ||
              cartState?.cart.some((product: CartItem) => product?.in_stop) ? (
                <Button
                  variant='primary'
                  fontSize={14}
                  fontWeight={500}
                  isDisabled
                  w={'100%'}
                  textAlign={'center'}
                >
                  {/* <Button variant='primary' isDisabled>
                    {t('checkout_order')}
                  </Button> */}
                  {minPrice > totalPrice ? (
                    <Text className={styles.error}>{t('checkout_order')}</Text>
                  ) : (
                    <Center>
                      <Text
                        fontSize='xl'
                        fontWeight={700}
                        flex={1}
                        // display={{ base: 'block', lg: 'none' }}
                      >
                        <NumberToPrice
                          value={totalPrice + deliveryPrice}
                          unstyled={true}
                        />
                      </Text>
                    </Center>
                  )}
                </Button>
              ) : (
                <Button
                  flex={1}
                  variant='primary'
                  justifyContent={{ base: 'space-between', md: 'center' }}
                  w={'100%'}
                  display={'flex'}
                  onClick={onButtonClick}
                  size={{ base: 'lg', lg: 'md' }}
                  fontSize={14}
                  fontWeight={500}
                  isDisabled={minPrice > totalPrice}
                >
                  <Text fontSize={14} fontWeight={500}>
                    {t('checkout_order')}
                  </Text>
                  <Text
                    textAlign={'right'}
                    fontWeight={700}
                    // flex={1}
                    display={{ base: 'block', md: 'none' }}
                  >
                    <NumberToPrice
                      textProps={{
                        fontSize: '16px',
                      }}
                      spanProps={{
                        fontSize: '16px',
                      }}
                      value={totalPrice + deliveryPrice}
                      unstyled={true}
                    />
                  </Text>
                </Button>
              )}
            </>
          </HStack>
          <Center>
            {minPrice > totalPrice && (
              <Text
                color={'error'}
                className={styles.error}
                fontSize={14}
                fontWeight={400}
              >
                {t('order.minimum_order_amount', {
                  price: numToPrice(minPrice),
                })}
              </Text>
            )}
          </Center>
        </Stack>
      </Card>
      <AuthDialog
        isOpen={isAuthDialog}
        onLastConfirm={() => router.push('/checkout')}
        onClose={() => setIsAuthDialog(false)}
      />
      {/* <FormDialog
        open={isOrderConfirm}
        title={t('attention')}
        description={t('are_you_sure-order')}
        handleClose={() => setIsOrderConfirm(false)}
      >
        <div className={styles.flexbox}>
          <Button color="grayscale" onClick={() => setIsOrderConfirm(false)}>
            {t('no')}
          </Button>
          <Button type="submit" onClick={onSubmit} disabled={isCreateLoading}>
            {t('yes')}
          </Button>
        </div>
      </FormDialog> */}
    </>
  )
}

export default Bill
