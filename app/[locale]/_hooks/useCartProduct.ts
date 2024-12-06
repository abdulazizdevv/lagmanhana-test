import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IModifier, IRedux, ISavedModifier } from '@/_types'

interface ProductInCart {
  quantity: number
  key: string
  order_modifiers: any[]
}

export default function useCartProduct(
  productId: string,
  selectedModifiers?: ISavedModifier[],
  selVariants?: { variant_id: string }[]
) {
  const [productInCart, setProductInCart] = useState<ProductInCart | null>(null)
  const [isOrdered, setOrdered] = useState(false)
  const cart = useSelector((state: IRedux) => state.cart?.cart)

  const getConcatenatedIds = (
    items: { variant_id?: string; modifier_id?: string }[],
    key: 'variant_id' | 'modifier_id'
  ) => {
    return items
      .map((item) => item[key])
      .sort()
      .join('_')
  }

  const onCheckProduct = useCallback(() => {
    if (cart.length > 0) {
      for (const item of cart) {
        if (item.product_id === productId) {
          const productVariants = selVariants
            ? getConcatenatedIds(item.variants, 'variant_id')
            : ''
          const myVariants = selVariants
            ? getConcatenatedIds(selVariants, 'variant_id')
            : ''
          const modifiersMatch =
            selectedModifiers &&
            item.order_modifiers.length === selectedModifiers.length &&
            item.order_modifiers.every(
              (mod: IModifier, index: number) =>
                mod.modifier_id === selectedModifiers[index].modifier_id
            )

          if (
            (!selVariants || productVariants === myVariants) &&
            (item.order_modifiers.length === 0 || modifiersMatch)
          ) {
            setProductInCart(item)
            setOrdered(true)
            return
          }
        }
      }
    }
    setProductInCart(null)
    setOrdered(false)
  }, [cart, selectedModifiers, productId, selVariants])

  useEffect(() => {
    onCheckProduct()
  }, [onCheckProduct, cart])

  return {
    isOrdered,
    productInCart,
  }
}
