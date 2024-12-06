import ChevronDown from '@/_assets/icons/ChevronDown'
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react'
import React from 'react'
import RadioCardDeliveryType from '../Radio'
import CRadioGroupDeliveryType from '../Radio'
import {
  onOpenMap,
  saveDeliveryType,
  setMapModalLg,
} from '@/_store/common/common.slice'
import { useDispatch, useSelector } from 'react-redux'
import { IRedux } from '@/_types'
import { useI18n } from '@/_locales/client'

const SelectDeliveryType = () => {
  const dispatch = useDispatch()
  const common = useSelector((state: IRedux) => state.common)
  const t = useI18n()
  const DeliveryOptions = [
    {
      label: 'Delivery',
      value: 'delivery',
    },
    {
      label: 'Self-pickup',
      value: 'self-pickup',
    },
  ]

  return (
    <Popover placement='bottom'>
      <PopoverTrigger>
        <Button
          variant='outline'
          color={'#AA2400'}
          colorScheme='#AA2400'
          borderRadius={'full'}
          fontSize={'12px'}
          fontWeight={700}
          height={'36px'}
          py={'14px'}
          px={'12px'}
          bg={'#AA240026'}
          rightIcon={<ChevronDown color={'#AA2400'} />}
        >
          {common.deliveryType === 'self-pickup'
            ? t('takeaway')
            : t('delivery')}
        </Button>
      </PopoverTrigger>
      <PopoverContent p={0} w={'140px'}>
        {/* <PopoverArrow /> */}
        <PopoverBody p={'6px'}>
          <CRadioGroupDeliveryType
            name='delivery_type'
            options={DeliveryOptions}
            value={common.deliveryType} // Pass the current value
            // selectedValues={selectedTagsValues}
            // setSelectedValues={setSelectedTagsValues}
            // currentLocale={currentLocale}
            onChange={(e) => {
              dispatch(saveDeliveryType(e))
              dispatch(onOpenMap())
              if (e === 'delivery' && !common.branch?.address) {
                dispatch(setMapModalLg(true))
              } else if (e === 'self-pickup') {
                dispatch(setMapModalLg(true))
              }
            }}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default SelectDeliveryType
