'use client'

import { useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  IconButton,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import BagIcon from '@/_assets/icons/BagIcon'
import { useDispatch, useSelector } from 'react-redux'
import { CartItem, IRedux } from '@/_types'
import Link from 'next/link'
import NumberToPrice from '@/_components/NumberToPrice'
import ShoppingCartIcon from '@/_assets/icons/ShoppingCart'
import { usePathname } from 'next/navigation'
import DeleteIcon from '@/_assets/illustration/DeleteIcon'
import ConfirmModal from '@/_components/ConfirmModal'
import { useI18n } from '@/_locales/client'
import { CLEAR } from '@/_store/cart/cart.slice'
import { fonts } from '@/fonts'

function CartButton() {
  const [count, setCount] = useState(0)

  const t = useI18n()
  const dispatch = useDispatch()
  const pathname = usePathname()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cartState = useSelector((state: IRedux) => state.cart)
  const [isLargerThanLg] = useMediaQuery('(min-width: 992px)')

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
    setCount(totalCount)
    return total
  }, [cartState?.cart])

  const onClearCart = () => {
    // sendGTM()
    dispatch(CLEAR())
  }

  if (pathname.includes('/cart') && !isLargerThanLg) {
    return (
      <>
        <IconButton
          rounded='full'
          aria-label='Open menu'
          icon={<DeleteIcon />}
          onClick={onOpen}
        />
        <ConfirmModal
          isOpen={isOpen}
          title={t('attention')}
          description={t('are_you_sure-cart')}
          onClose={onClose}
          onConfirm={onClearCart}
        />
      </>
    )
  }

  return (
    <Link href='/cart'>
      <Button
        variant='primary'
        leftIcon={<BagIcon color={'#000'} />}
        display={{ base: 'none', md: 'flex' }}
        className={fonts.GTWalsheimPro.className}
        fontWeight={400}
        borderRadius={'12px'}
      >
        <NumberToPrice value={total} unstyled={true} />
      </Button>
      {/* <Box position='relative' display={{ md: 'none' }}>
        <IconButton
          rounded='full'
          aria-label='Open menu'
          icon={<ShoppingCartIcon color={txtColor} />}
        />
        <Badge
          variant='solid'
          bgColor='white'
          color='black'
          position='absolute'
          top={0}
          right={0}
          rounded='full'
          lineHeight={1.2}
        >
          {count}
        </Badge>
      </Box> */}
    </Link>
  )
}

export default CartButton
