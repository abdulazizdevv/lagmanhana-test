import DeleteIcon from '@/_assets/illustration/DeleteIcon'
import ConfirmModal from '@/_components/ConfirmModal'
import { useI18n } from '@/_locales/client'
import { CLEAR } from '@/_store/cart/cart.slice'
import { CartItem, IRedux } from '@/_types'
import { dataLayerComponent } from '@/_utils/gtm'
import { Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function ClearButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { cart } = useSelector((state: IRedux) => state.cart)
  const t = useI18n()
  const dispatch = useDispatch()

  const onClearCart = () => {
    // sendGTM()
    dispatch(CLEAR())
  }

  // const sendGTM = () => {
  //   let items = cart.map((el: CartItem, idx: number) => ({
  //     item_brand: 'Chicago',
  //     item_name: el.product_name,
  //     item_id: el.product_id,
  //     price: el.price,
  //     item_category: el.category_name,
  //     item_list_name: 'Cart',
  //     item_list_id: 'cart',
  //     index: idx,
  //     quantity: el.quantity,
  //   }))
  //   dataLayerComponent({
  //     event: 'remove_from_cart',
  //     ecommerce: {
  //       items,
  //     },
  //   })
  // }

  return (
    <>
      <Button
        size='sm'
        variant='ghost'
        fontWeight={400}
        leftIcon={<DeleteIcon color='inherit' />}
        onClick={onOpen}
      >
        {t('clear_cart')}
      </Button>
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

export default ClearButton
