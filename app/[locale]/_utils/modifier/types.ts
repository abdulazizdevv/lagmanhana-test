import { Modifier } from '@/_types'

export interface IMaxAmountParams {
  (
    modifier: {
      id: string
      max_amount: number
      modifier_id: string
    },
    variantId: string,
    orderModifiers: Modifier[],
    setOrderModifiers: (any0: any) => void
  ): void
}

export interface IModifierChangeParams {
  (
    checked: boolean,
    modifier: Modifier,
    setOrderModifiers: (any0: any) => void
  ): void
}

export interface IGroupModifierChangeParams {
  (
    checked: boolean,
    variant: { id: string; out_price: number; title: string; name: string },
    modifier: Modifier,
    orderModifiers: Modifier[],
    setOrderModifiers: (any0: any) => void,
    modifiersQuantity: {
      id: string
      quantity: number
    }[],
    setModifiersQuantity: (any0: any) => void
  ): void
}
