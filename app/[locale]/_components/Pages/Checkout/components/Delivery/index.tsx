import { useDispatch, useSelector } from 'react-redux'
import styles from '../../style.module.scss'
import { useI18n } from '@/_locales/client'
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { checkoutActions } from '@/_store/checkout/checkout.slice'
import AddressButton from './AddressButton'
import { useSearchParams } from 'next/navigation'
import { onOpenMap } from '@/_store/common/common.slice'
import { IRedux } from '@/_types'

function DeliveryDetails({ orderData, stepsData, isError }: any) {
  const { delivery_type, to_address } = orderData

  const searchParams = useSearchParams()
  const oid = searchParams?.get('oid')

  const t = useI18n()
  const dispatch = useDispatch()
  const commonState = useSelector((state: IRedux) => state.common)
  const checkoutState = useSelector((state: IRedux) => state.checkout)

  return (
    <section>
      <Text fontSize='xl' fontWeight={700} mb={{ base: 2, md: 4 }}>
        {commonState?.deliveryType === 'self-pickup'
          ? // t('takeaway_order')
            'С какого филиала'
          : // t('delivery_address')
            t('order_type')}
      </Text>
      <HStack align='center' justify='space-between'>
        <AddressButton
          address={
            oid
              ? delivery_type
                ? to_address
                : stepsData?.branch_name
              : commonState?.deliveryType === 'delivery'
              ? to_address
                ? to_address
                : t('enter_your_address')
              : isError
              ? `${t('branch_not_found')} :(`
              : commonState?.deliveryType === 'self-pickup'
              ? stepsData?.branch_name
              : t('address_not_specified')
          }
        />
        <Button
          variant={'ghost'}
          bg={'#F2F4F7'}
          fontSize={14}
          fontWeight={500}
          onClick={() => dispatch(onOpenMap())}
          display={{ base: 'none', md: 'block' }}
        >
          {t(commonState?.deliveryType ? 'change' : 'enter_your_address')}
        </Button>
      </HStack>
      {commonState?.deliveryType === 'delivery' && (
        <SimpleGrid columns={4} spacing={{ base: '8px', md: 4 }} mt={3}>
          <FormControl>
            <FormLabel m={0}>{t('accommodation')}</FormLabel>
            <Input
              variant='outline'
              id='accommodation'
              type='text'
              border='1px solid #D0D5DD'
              borderRadius='8px'
              boxShadow='0px 1px 2px 0px #1018280D'
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
              value={checkoutState?.accommodation}
              placeholder={'№'}
              onChange={(e) => {
                if (e.target.value?.length < 10) {
                  dispatch(checkoutActions.changeAccommodation(e.target.value))
                }
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel m={0}>{t('floor')}</FormLabel>
            <Input
              variant='outline'
              id='floor'
              border='1px solid #D0D5DD'
              borderRadius='8px'
              boxShadow='0px 1px 2px 0px #1018280D'
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
              type='text'
              value={checkoutState?.floor}
              placeholder={'№'}
              onChange={(e) => {
                if (e.target.value?.length < 10) {
                  dispatch(checkoutActions.changeFloor(e.target.value))
                }
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel m={0}>{t('apartment')}</FormLabel>
            <Input
              variant='outline'
              id='apartment'
              type='text'
              border='1px solid #D0D5DD'
              borderRadius='8px'
              boxShadow='0px 1px 2px 0px #1018280D'
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
              value={checkoutState?.apartment}
              placeholder={'№'}
              onChange={(e) =>
                dispatch(checkoutActions.changeApartment(e.target.value))
              }
              required={!checkoutState?.is_courier_call}
            />
          </FormControl>
          <FormControl>
            <FormLabel m={0}>{t('building')}</FormLabel>
            <Input
              variant='outline'
              id='building'
              type='text'
              border='1px solid #D0D5DD'
              borderRadius='8px'
              boxShadow='0px 1px 2px 0px #1018280D'
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
              value={checkoutState?.building}
              placeholder={'№'}
              onChange={(e) =>
                dispatch(checkoutActions.changeBuilding(e.target.value))
              }
              required={!checkoutState?.is_courier_call}
            />
          </FormControl>
        </SimpleGrid>
      )}
      <FormControl mt={4}>
        <FormLabel>{t('description_to_the_order')}</FormLabel>
        <Textarea
          variant='outline'
          id='description'
          border='1px solid #D0D5DD'
          borderRadius='8px'
          boxShadow='0px 1px 2px 0px #1018280D'
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
          placeholder={t('description_to_the_order')}
          value={checkoutState?.description}
          onChange={(e) =>
            dispatch(checkoutActions.changeDescription(e.target.value))
          }
          className={styles.textarea}
        />
      </FormControl>
    </section>
  )
}

export default DeliveryDetails
