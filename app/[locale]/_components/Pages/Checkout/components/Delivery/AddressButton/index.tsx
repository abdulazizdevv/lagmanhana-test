import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  activatePoint,
  onOpenMap,
  setMapModalLg,
} from '@/_store/common/common.slice'

import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useMemo, useState } from 'react'
import CRadioGroup from '@/_components/RadioGroup'
import { IPoint, IRedux } from '@/_types'
import { useSearchParams } from 'next/navigation'
import ShopIcon from '@/_assets/icons/Shop'
import { useI18n } from '@/_locales/client'

function AddressButton({ address }: { address: string }) {
  const [activePoint, setActivePoint] = useState<IPoint | null>(null)

  const t = useI18n()
  const searchParams = useSearchParams()
  const oid = searchParams?.get('oid')
  const dispatch = useDispatch()

  const { points, deliveryType, branch } = useSelector(
    (state: IRedux) => state.common
  )

  const pointOptions = useMemo(
    () =>
      points.map((item: IPoint) => {
        if (item?.isActive && !oid) setActivePoint(item)
        return { label: item.address, value: item.id }
      }),
    [points, oid]
  )
  const popoverPlacement: any = useBreakpointValue({
    base: 'bottom',
    md: 'bottom-start',
  })

  if (deliveryType === 'self-pickup') {
    return (
      <Button
        overflow='hidden'
        leftIcon={
          <Icon
            icon='solar:shop-bold'
            color='#FFD301'
            width='20px'
            height='20px'
          />
        }
        py={2}
        px={'6px'}
        variant={'ghost'}
        fontSize={16}
        fontWeight={400}
        w={{ base: '100%', md: 'fit-content' }}
        bg={'#F2F4F7'}
        display={'flex'}
        justifyContent={{ base: 'start', md: 'center' }}
        borderRadius={'8px'}
        onClick={() => {
          dispatch(onOpenMap())
          dispatch(setMapModalLg(true))
        }}
      >
        <Text as='span' display={{ base: 'inline', md: 'none' }}>
          {address?.length > 24 ? address.substring(0, 24) + '...' : address}
        </Text>
        <Text as='span' display={{ base: 'none', md: 'inline' }}>
          {address}
        </Text>
      </Button>
    )
  }

  return (
    <Popover placement={popoverPlacement}>
      <PopoverTrigger>
        <Button
          overflow='hidden'
          p={2}
          borderRadius={'8px'}
          variant={'ghost'}
          bg={'#F2F4F7'}
          fontWeight={400}
          fontSize={16}
          py={2}
          w={{ base: '100%', md: 'fit-content' }}
          justifyContent={{ base: 'space-between', md: 'center' }}
          h={{ base: '48px', md: 'fit-content' }}
        >
          {/* <Flex justifyContent={'space-between'}> */}
          <Flex gap={1} alignItems={'center'}>
            <Icon
              icon='heroicons:map-pin-solid'
              color='#FFD301'
              fontSize={24}
            />
            <Text
              maxW='280px'
              as='span'
              lineHeight={'20px'}
              wordBreak='break-word'
              textAlign={'left'}
              whiteSpace='normal' // Ensure text can wrap
              overflowWrap='break-word' // Help with breaking long words
              display={{ base: 'block', md: 'none' }}
            >
              {address?.length > 24
                ? address.substring(0, 50) + '...'
                : address}
            </Text>

            <Text as='span' display={{ base: 'none', md: 'inline' }}>
              {address}
            </Text>
          </Flex>
          <Icon
            icon='material-symbols:keyboard-arrow-down-rounded'
            fontSize={24}
            color='gray'
          />
          {/* </Flex> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        mt={1}
        bgColor='white'
        borderRadius='8px'
        border='1px solid #00000012'
        fontSize={{ base: 'xs', md: 'md' }}
        width={{ base: '85vw', md: '400px' }}
        _dark={{ bgColor: 'paper.dark.500', borderColor: '#FFFFFF12' }}
      >
        <Text fontSize={20} pt={4} px={4} fontWeight={700}>
          {t('your_address')}
        </Text>
        <PopoverBody px={4} pb={4}>
          {deliveryType === 'delivery' ? (
            <>
              <CRadioGroup
                name='points'
                value={activePoint?.id}
                options={pointOptions}
                onChange={(e) => dispatch(activatePoint(e))}
              />
              <Button
                my={2}
                width='full'
                // variant='outline'
                variant='solid'
                borderColor={'#D0D5DD'}
                borderRadius={12}
                // color={'primary.500'}
                fontWeight={700}
                fontSize={16}
                height={'48px'}
                lineHeight={'24px'}
                // colorScheme='primary'
                // _active={{ color: '#fff', bgColor: 'primary.500' }}
                onClick={() => {
                  dispatch(onOpenMap())
                  dispatch(setMapModalLg(true))
                }}
              >
                {t('add_new_address')}
              </Button>
            </>
          ) : (
            <>
              {branch?.id && (
                <CRadioGroup
                  name='branch'
                  defaultValue={branch?.id}
                  options={[{ label: branch.name, value: branch.id }]}
                  onChange={(e) => console.log(e)}
                />
              )}
              <Button
                my={2}
                width='full'
                variant='ghost'
                justifyContent='space-between'
                size={{ base: 'sm', md: 'lg' }}
                borderRadius={{ base: 'lg', md: '2xl' }}
                // rightIcon={<Icon icon='lucide:plus' />}
                onClick={() => {
                  dispatch(onOpenMap())
                  dispatch(setMapModalLg(true))
                }}
              >
                {t('add_new_address')}
              </Button>
            </>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default AddressButton
