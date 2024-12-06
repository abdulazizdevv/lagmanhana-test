import { useSelector } from 'react-redux'
import { CartItem, IDiscount, IDiscounts, IRedux } from '@/_types'
import CardX from '@/_components/CardX'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/_locales/client'

interface IProps {
  discounts: IDiscounts | null
  reProducts: CartItem[] | null
  setReProducts: any
}

function Products({ discounts, reProducts, setReProducts }: IProps) {
  const cartState = useSelector((state: IRedux) => state.cart)
  const searchParams = useSearchParams()
  const t = useI18n()
  const repeat = searchParams?.get('repeat')

  const onIncrease = (product: CartItem) => {
    const maxQty = product?.max_qty || Infinity

    setReProducts((prevState: CartItem[]) =>
      prevState.map((el) =>
        el.key === product?.key
          ? { ...el, quantity: Math.min(el.quantity + 1, maxQty) }
          : el
      )
    )
  }
  const onDecrease = (product: CartItem) => {
    const minQty = product?.min_qty || 1

    setReProducts((prevState: CartItem[]) =>
      prevState.map((el) =>
        el.key === product?.key
          ? { ...el, quantity: Math.max(el.quantity - 1, minQty) }
          : el
      )
    )
  }
  const onRemove = (product: CartItem) => {
    setReProducts((prevState: CartItem[]) =>
      prevState.filter((el) => el.key != product?.key)
    )
  }

  return (
    <>
      {repeat
        ? reProducts?.map((item: CartItem, idx: number) => (
            <CardX
              h1={t('checkout')}
              index={idx + 1}
              key={item.key}
              product={item}
              customEvents={true}
              customDecrement={onDecrease}
              customIncrement={onIncrease}
              customRemove={onRemove}
            />
          ))
        : cartState?.cart?.map((item: CartItem, idx: number) => (
            <CardX
              h1={t('checkout')}
              index={idx + 1}
              key={item.key}
              product={item}
            />
          ))}
      {discounts?.discounts?.map(
        (el: IDiscount, idx: number) =>
          el?.discount_mode === 'bonus_product' && (
            <CardX
              h1={t('checkout')}
              index={idx + 1}
              product={{
                key: '',
                price: el?.bonus_product?.out_price,
                variants: [],
                type: 'simple',
                product_name: '',
                category_name: '',
                order_modifiers: '',
                price_with_discount: 0,
                in_stop: false,
                default_product: false,
                product_id: el?.bonus_product?.id,
                quantity: el?.bonus_product?.count,
              }}
              price={el?.bonus_product?.out_price}
              key={el?.bonus_product?.id}
              readOnly={true}
            />
          )
      )}
    </>
  )
}

export default Products
