import { useEffect } from "react"
import {
  onModifierChange,
  onDecreaseModifierQuantity,
  onDecreaseModifierVariantQuantity,
  onGroupModifierChange,
  onIncreaseModifierQuantity,
  onIncreaseModifierVariantQuantity,
} from "@/_utils/modifier/actions"
import styles from "./style.module.scss"
import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { getProductModifier } from "@/_services/products"
import useCartProduct from "@/_hooks/useCartProduct"
import ModifierCheckbox from "@/_components/ModifierCheckbox"
import { Box, Stack, Text } from "@chakra-ui/react"
import { useCurrentLocale } from "@/_locales/client"

interface IProps {
  product: any
  quantity: any
  orderModifiers: any
  modifiersQuantity: any
  setOrderModifiers: any
  setModifiersQuantity: any
}

function Modifiers({
  product,
  quantity,
  orderModifiers,
  modifiersQuantity,
  setOrderModifiers,
  setModifiersQuantity,
}: IProps) {
  const {
    data,
  }: UseQueryResult<
    { product_modifiers: { group_modifiers: any[]; single_modifiers: any[] } },
    Error
  > = useQuery({
    queryKey: ["modifier", product?.id],
    queryFn: () =>
      getProductModifier({ product_id: product?.id }).then((res) => res.data),
    enabled: Boolean(product?.has_modifier),
  })

  const { productInCart } = useCartProduct(product?.id, orderModifiers)
  const currentLocale = useCurrentLocale()

  // Get modifiers by variant
  useEffect(() => {
    if (data) {
      let firstGroupItems: any[] = []
      let modifiersQuantityMock: any[] = []
      data.product_modifiers?.group_modifiers?.map((group) => {
        modifiersQuantityMock.push({
          id: group.id,
          quantity: group.min_amount || 1,
        })
        let firstGroupItem = {}
        group?.variants?.map((variant: any, idx: number) => {
          if (idx === 0)
            firstGroupItem = {
              modifier_id: variant?.id,
              modifier_price: +variant?.out_price,
              modifier_quantity: group?.min_amount || 1,
              parent_id: group?.id,
            }
        })
        firstGroupItems.push(firstGroupItem)
      })
      setOrderModifiers(firstGroupItems)
      setModifiersQuantity(modifiersQuantityMock)
    } else {
      setOrderModifiers([])
      setModifiersQuantity([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const modifierQuantityHandler = (modifierId: string) => {
    if (isOrderedModifierHandler(modifierId)) {
      let elementQuantity = 0
      productInCart?.order_modifiers?.map((item) => {
        item.modifier_id == modifierId &&
          (elementQuantity = item.modifier_quantity)
      })
      return elementQuantity
    }
    const element = orderModifiers.find(
      (item: any) => item.modifier_id === modifierId
    )
    return element?.modifier_quantity ?? 0
  }
  const checkModifierHandler = (modifierId: string) => {
    const element = orderModifiers.find(
      (item: any) => item.modifier_id === modifierId
    )
    return element ? element : isOrderedModifierHandler(modifierId)
  }
  const isOrderedModifierHandler = (modifierId: string) => {
    if (
      productInCart?.order_modifiers?.length &&
      productInCart?.order_modifiers?.length > 0
    ) {
      let isIncluded = false
      productInCart?.order_modifiers?.map((item) => {
        item.modifier_id == modifierId && (isIncluded = true)
      })
      return isIncluded
    }
  }

  return (
    <>
      {data?.product_modifiers?.single_modifiers?.map((modifier) => (
        <Box key={modifier.id + modifier.from_product_id} mt={2}>
          <Text fontSize="sm" fontWeight={600} mb={2}>
            {
              modifier.category_name?.[
                currentLocale === "kz" ? "uz" : currentLocale
              ]
            }
          </Text>
          <ModifierCheckbox
            data={modifier}
            checked={checkModifierHandler(modifier?.id)}
            quantity={modifierQuantityHandler(modifier?.id) * quantity}
            onChange={({ target }) =>
              onModifierChange(target.checked, modifier, setOrderModifiers)
            }
            label={
              modifier.name?.[currentLocale === "kz" ? "uz" : currentLocale]
            }
            outPrice={modifier.price}
            isCompulsory={modifier.is_compulsory}
            decrease={() =>
              onDecreaseModifierQuantity(
                modifier,
                orderModifiers,
                setOrderModifiers
              )
            }
            increase={() =>
              onIncreaseModifierQuantity(
                modifier,
                orderModifiers,
                setOrderModifiers
              )
            }
            single
          />
        </Box>
      ))}
      {data?.product_modifiers?.group_modifiers?.map(
        (modifier, idx) =>
          modifiersQuantity[idx]?.id === modifier.id && (
            <Box key={modifier.id + modifier.from_product_id} mt={2}>
              <Text fontSize="sm" fontWeight={600} mb={2}>
                {modifier.name?.[currentLocale === "kz" ? "uz" : currentLocale]}
              </Text>
              <Stack>
                {modifier?.variants.map((variant: any) => (
                  <ModifierCheckbox
                    data={variant}
                    key={variant.id}
                    checked={checkModifierHandler(variant?.id)}
                    quantity={modifierQuantityHandler(variant?.id) * quantity}
                    onChange={({ target }) =>
                      onGroupModifierChange(
                        target.checked,
                        variant,
                        modifier,
                        orderModifiers,
                        setOrderModifiers,
                        modifiersQuantity,
                        setModifiersQuantity
                      )
                    }
                    label={
                      variant.title?.[
                        currentLocale === "kz" ? "uz" : currentLocale
                      ]
                    }
                    outPrice={variant.out_price}
                    decrease={() =>
                      onDecreaseModifierVariantQuantity(
                        variant,
                        modifier,
                        orderModifiers,
                        setOrderModifiers,
                        modifiersQuantity,
                        setModifiersQuantity
                      )
                    }
                    increase={() =>
                      onIncreaseModifierVariantQuantity(
                        variant,
                        modifier,
                        orderModifiers,
                        setOrderModifiers,
                        modifiersQuantity,
                        setModifiersQuantity
                      )
                    }
                  />
                ))}
              </Stack>
            </Box>
          )
      )}
    </>
  )
}

export default Modifiers
