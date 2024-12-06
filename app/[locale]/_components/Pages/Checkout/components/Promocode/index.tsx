import { useI18n } from '@/_locales/client'
import { getDiscountWithOrderPrice } from '@/_services/discountService'
import { IDiscount, IDiscounts, IRedux } from '@/_types'
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

interface IProps {
  totalPrice: number
  discounts: IDiscounts | null
  coDeliveryPrice: number
  setDiscounts: any
}

export default function Promocode({
  totalPrice,
  discounts,
  coDeliveryPrice,
  setDiscounts,
}: IProps) {
  const [promocode, setPromocode] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [promocodeError, setPromocodeError] = useState('')

  const t = useI18n()
  const { user } = useSelector((state: IRedux) => state.auth)
  const cartState = useSelector((state: IRedux) => state.cart)
  const checkoutState = useSelector((state: IRedux) => state.checkout)
  const commonState = useSelector((state: IRedux) => state.common)

  const productIdsCounts = useMemo(() => {
    let myObj: { [key: string]: number } = {}
    for (const product of cartState?.cart) {
      myObj[product?.product_id] = product?.quantity
    }
    return myObj
  }, [cartState?.cart])

  const onChange = (e: any) => {
    setPromocode(e.target.value)
    Boolean(promocodeError) && setPromocodeError('')
  }

  const onApply = () => {
    if (promocode && !Boolean(promocodeError))
      getDiscountWithOrderPrice({
        order_sources: 'website',
        branch_ids: commonState?.branch?.id,
        // payment_types: checkoutState?.payment_type,
        payment_type_id: checkoutState?.payment_type_id,
        only_delivery: commonState?.deliveryType === 'delivery',
        only_self_pickup: commonState?.deliveryType === 'self-pickup',
        for_order_amount: totalPrice,
        delivery_price: coDeliveryPrice,
        client_id: user?.id,
        promo_code: promocode,
        product_ids_counts: productIdsCounts,
        lat: commonState?.branch?.location?.lat,
        long: commonState?.branch?.location?.long,
      })
        .then((res) => {
          setIsSaved(true)
          if (res?.discounts) {
            setDiscounts((prevState: IDiscounts) => ({
              ...prevState,
              all_discount_price:
                (prevState?.all_discount_price || 0) + res?.all_discount_price,
              discounts:
                prevState?.discounts?.length > 0
                  ? [...prevState?.discounts, ...res?.discounts]
                  : res?.discounts,
            }))
          }
        })
        .catch((err) =>
          setPromocodeError(
            err?.response?.data?.Error?.message || err?.data?.Error?.message
          )
        )
  }

  const onRemovePromocode = () => {
    setPromocode('')
    setDiscounts((prevState: IDiscounts) => {
      let currentPromo = prevState?.discounts?.find(
        (item) => item?.discount_type === 'promo_code'
      )
      return {
        ...prevState,
        all_discount_price:
          (prevState?.all_discount_price || 0) -
          (currentPromo?.discount_price_for_order || 0),
        discounts:
          prevState?.discounts?.length > 0
            ? prevState?.discounts?.filter(
                (item: IDiscount) => item?.discount_type !== 'promo_code'
              )
            : [],
      }
    })
  }

  useEffect(() => {
    discounts?.discounts?.some(
      (item: IDiscount) => item?.discount_type === 'promo_code'
    )
  }, [])

  return (
    <form onSubmit={onApply}>
      <FormControl isInvalid={Boolean(promocodeError)}>
        <FormLabel display={'flex'} alignItems={'center'} gap={1}>
          {t('promo_code')}
          {Boolean(!promocodeError) && isSaved && (
            <Icon
              color='#00AF64'
              icon='ep:circle-check-filled'
              width='16px'
              height='16px'
            />
          )}
        </FormLabel>
        {/* <InputGroup border={'1px solid gray'} borderRadius={8}>
          <Input
            // variant='outline'
            placeholder={t('add_promo_code')}
            value={promocode}
            onChange={onChange}
            borderRadius={'8px,0px,0px,8px'}
            border={'none'}
          />
          <Button
            onClick={onApply}
            borderRadius={'0,8px,8px,0'}
            fontSize={14}
            fontWeight={500}
            bg={'#fff'}
            variant={'#fff'}
            minW={{ md: '130px' }}
            isDisabled={!promocode}
          >
            {t('apply')}
          </Button>
        </InputGroup> */}
        <InputGroup size='md' borderRadius={'8px'}>
          <Input
            placeholder={t('add_promo_code')}
            value={promocode}
            onChange={onChange}
            // boxShadow='0px 1px 2px 0px #1018280D'
            // _focus={{
            //   outline: '#7E5FA6',
            //   borderColor: '#7E5FA6',
            //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
            // }}
            // _active={{
            //   outline: '#7E5FA6',
            //   borderColor: '#7E5FA6',
            //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
            // }}
            borderRadius='8px'
            isDisabled={isSaved}
          />
          {isSaved ? (
            <InputRightElement width='15%'>
              <Icon
                icon='ci:close-md'
                width='1.2em'
                height='1.2em'
                cursor='pointer'
                onClick={() => {
                  onRemovePromocode()
                  setIsSaved(false)
                }}
              />
            </InputRightElement>
          ) : (
            <InputRightElement
              width='auto'
              p={0}
              bg='transparent'
              border='none'
            >
              <Button
                borderRadius='0 8px 8px 0'
                fontSize={14}
                fontWeight={500}
                bg='#fff'
                cursor='pointer'
                minW='130px'
                variant='#fff'
                onClick={onApply}
                border='1px solid #D0D5DD'
                isDisabled={Boolean(!promocode)}
              >
                {t('apply')}
              </Button>
            </InputRightElement>
          )}
        </InputGroup>
        {Boolean(promocodeError) && (
          <FormErrorMessage>{promocodeError}</FormErrorMessage>
        )}
      </FormControl>
    </form>
  )
}
