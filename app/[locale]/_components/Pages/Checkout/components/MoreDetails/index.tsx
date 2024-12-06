import { useI18n } from '@/_locales/client'
import { useDispatch, useSelector } from 'react-redux'
import { checkoutActions } from '@/_store/checkout/checkout.slice'
import {
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { IRedux, ISource } from '@/_types'

function MoreDetails({ source }: { source: ISource | undefined }) {
  const checkoutState = useSelector((state: IRedux) => state.checkout)
  const commonState = useSelector((state: IRedux) => state.common)

  const t = useI18n()
  const dispatch = useDispatch()

  const onChangeOperator = (e: any) => {
    dispatch(checkoutActions.changeOperatorCall(e.target.checked))
  }

  const onChangeCourier = (e: any) => {
    dispatch(checkoutActions.changeCourierCall(e.target.checked))
  }

  return (
    // <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
    //   <Flex
    //     flexDir={{ base: 'row', md: 'row-reverse' }}
    //     alignItems='center'
    //     justifyContent={{ base: 'space-between', md: 'start' }}
    //     gap='10px'
    //   >
    //     <Box>
    //       <Text fontWeight={700}>{t('call_from_operator')}?</Text>
    //       <Text color='#A5A5A5' fontSize='sm'>
    //         {t('mark_if_additional_specifications_needed')}
    //       </Text>
    //     </Box>
    //     <Checkbox
    //       size='lg'
    //       colorScheme='primary'
    //       onChange={onChangeOperator}
    //       isChecked={checkoutState?.is_operator_call}
    //     />
    //   </Flex>
    //   {commonState?.deliveryType == 'delivery' && (
    //     <Flex
    //       flexDir={{ base: 'row', md: 'row-reverse' }}
    //       alignItems={'center'}
    //       justifyContent={{ base: 'space-between', md: 'start' }}
    //       gap={'10px'}
    //     >
    //       <Box>
    //         <Text fontWeight={700}>{t('call_from_courier')}?</Text>
    //         <Text color='#A5A5A5' fontSize='sm'>
    //           {t('to_specify_an_address')}
    //         </Text>
    //       </Box>
    //       <Checkbox
    //         size='lg'
    //         colorScheme='primary'
    //         onChange={onChangeCourier}
    //         isChecked={checkoutState?.is_courier_call}
    //       ></Checkbox>
    //     </Flex>
    //   )}
    // </Grid>
    <Wrap spacing={6} pl={2.5}>
      {source?.ask_operator_call && (
        <WrapItem>
          <Checkbox
            size='lg'
            colorScheme='primary'
            onChange={onChangeOperator}
            isChecked={checkoutState?.is_operator_call}
          >
            <Box ml={2}>
              <Text
                fontSize={{ base: 14, md: 16 }}
                color={'#101828'}
                fontWeight={700}
                lineHeight={'20px'}
              >
                {t('call_from_operator')}?
              </Text>
              <Text color='gray.500' fontWeight={400} fontSize='sm'>
                {t('mark_if_additional_specifications_needed')}
              </Text>
            </Box>
          </Checkbox>
        </WrapItem>
      )}
      {commonState?.deliveryType == 'delivery' && (
        <WrapItem>
          <Checkbox
            size='lg'
            colorScheme='primary'
            onChange={onChangeCourier}
            isChecked={checkoutState?.is_courier_call}
          >
            <Box ml={2}>
              <Text color={'#101828'} fontWeight={700} lineHeight={'20px'}>
                {t('call_from_courier')}?
              </Text>
              <Text color='gray.500' fontWeight={400} fontSize='sm'>
                {t('to_specify_an_address')}
              </Text>
            </Box>
          </Checkbox>
        </WrapItem>
      )}
    </Wrap>
  )
}

export default MoreDetails
