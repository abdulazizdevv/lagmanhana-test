import React from 'react'
import { IRedux } from '@/_types'
import { Tab, TabIndicator, TabList, Tabs } from '@chakra-ui/react'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { useDispatch, useSelector } from 'react-redux'
import { onOpenMap, saveDeliveryType } from '@/_store/common/common.slice'

function OrderTypes() {
  const t = useI18n()
  const currentLocale = useCurrentLocale()
  const dispatch = useDispatch()
  const { deliveryType } = useSelector((state: IRedux) => state.common)

  const handleTabChange = (isSelfPickup: any) => {
    dispatch(saveDeliveryType(isSelfPickup ? 'self-pickup' : 'delivery'))
  }

  return (
    <>
      <Tabs
        p={0.5}
        zIndex={1}
        bg='gray.300'
        rounded='12px'
        variant='unstyled'
        position='relative'
        display={{ base: 'none', md: 'flex' }}
        onClick={() => dispatch(onOpenMap())}
        onChange={(index) => handleTabChange(index === 1)}
        defaultIndex={deliveryType === 'delivery' ? 0 : 1}
      >
        <TabList>
          <Tab
            _selected={{ color: '#000' }}
            fontWeight={500}
            color={'#475467'}
            width={currentLocale === 'kz' ? 138 : 108}
            height={'36px'}
            fontSize='14px'
            lineHeight='20px'
            gap={1}
            px={2}
          >
            {t('delivery')}
          </Tab>
          <Tab
            _selected={{ color: '#000' }}
            color={'#475467'}
            height={'36px'}
            fontWeight={500}
            width={currentLocale === 'kz' ? 138 : 108}
            fontSize='14px'
            lineHeight='20px'
            gap={1}
            px={2}
          >
            {t('takeaway')}
          </Tab>
        </TabList>
        <TabIndicator
          top={0.5}
          height={9}
          zIndex={-1}
          bg='#fff'
          rounded='10px'
        />
      </Tabs>
    </>
  )
}

export default OrderTypes
