'use client'

import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import axios from 'axios'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'
import getAPIKey from '@/_utils/getAPIKey'
import { useDispatch, useSelector } from 'react-redux'
import {
  activatePoint,
  onOpenMap,
  savePoint,
  setMapModalLg,
} from '@/_store/common/common.slice'
import { v4 as uuidv4 } from 'uuid'
import { useI18n } from '@/_locales/client'
import CRadioGroup from '@/_components/RadioGroup'
import { IPoint, IRedux } from '@/_types'
import ChevronDown from '@/_assets/icons/ChevronDown'

function AddressButton() {
  const [geoloc, setGeoloc] = useState<number[]>([])
  const [activePoint, setActivePoint] = useState<IPoint | null>(null)
  const [isSmallerThanLg] = useMediaQuery('(max-width: 960px)')

  const { isOpen, onClose, onOpen } = useDisclosure()
  const { points, deliveryType, branch } = useSelector(
    (state: IRedux) => state.common
  )

  const t = useI18n()
  const apikey = getAPIKey()
  const dispatch = useDispatch()

  const getGeolocation = () => {
    if (navigator.geolocation) {
      // timeout at 60000 milliseconds (60 seconds)
      var options = { timeout: 60000 }
      navigator.geolocation.getCurrentPosition(
        (pos: { coords: { latitude: number; longitude: number } }) => {
          setGeoloc([pos.coords.latitude, pos.coords.longitude])
        },
        errorHandler,
        options
      )
    } else {
      console.log('Sorry, browser does not support geolocation!')
    }
  }

  useEffect(() => {
    if (deliveryType == 'delivery') {
      if (points.length > 0)
        for (const point of points) {
          if (point.isActive) setActivePoint(point)
        }
    } else if (deliveryType == 'self-pickup')
      setActivePoint({ id: '', address: branch?.name, isActive: false })
  }, [points, deliveryType, branch])

  useEffect(() => {
    if (!activePoint?.address) {
      getGeolocation()
      onOpen()
    }
  }, [activePoint?.address, onOpen])

  useEffect(() => {
    if (
      geoloc?.length === 2 &&
      !points?.length &&
      (!activePoint?.address ||
        (activePoint?.location?.[0] !== geoloc[0] &&
          activePoint?.location?.[1] !== geoloc[1]))
    ) {
      axios
        .get(
          `https://geocode-maps.yandex.ru/1.x/?apikey=${apikey}&geocode=${geoloc}&lang=ru_RU&sco=latlong&format=json`
        )
        .then((res) => {
          const newPoint = {
            id: uuidv4(),
            location: geoloc,
            address:
              res?.data?.response?.GeoObjectCollection?.featureMember?.[0]
                ?.GeoObject?.name,
            isActive: true,
          }
          setActivePoint(newPoint)
          dispatch(savePoint(newPoint))
        })
        .catch((err) => console.log(err))
    }
  }, [geoloc])

  const bgColor = useColorModeValue('white', 'paper.dark.500')

  if (activePoint?.address) {
    return <SavedPopover address={activePoint?.address} />
  }

  return (
    <Button
      px={0}
      variant='none'
      display={'flex'}
      gap={1}
      alignItems={'flex-end'}
      onClick={() => {
        dispatch(onOpenMap())
        onClose()
        isSmallerThanLg && dispatch(setMapModalLg(true))
      }}
    >
      <Stack align='flex-start' spacing={0.5} fontSize={{ base: 12, md: 14 }}>
        <Text color='#98A2B3' as='span' fontWeight={400}>
          {t('delivery')} ~ 50 {t('time')}
        </Text>
        <Text fontWeight={400} color={'gray.600'} lineHeight={'16px'}>
          Улица Шахрисабз, Мирзо...
        </Text>
      </Stack>
      <Box alignSelf={'end'}>
        <ChevronDown width={16} height={18} />
      </Box>
    </Button>
  )
}

function SavedPopover({ address }: { address: string }) {
  const [activePoint, setActivePoint] = useState<IPoint | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSmallerThanLg] = useMediaQuery('(max-width: 960px)')

  const t = useI18n()
  const dispatch = useDispatch()
  const { deliveryType, points, branch } = useSelector(
    (state: IRedux) => state.common
  )

  const pointOptions = useMemo(() => {
    let res: { label: string; value: string }[] = []
    for (let i = 0; i < points.length; i++) {
      if (i < 5) {
        const element = points[i]
        res.push({
          label: element.address,
          value: element.id,
        })
      }
    }
    return res
  }, [points])

  useEffect(() => {
    if (deliveryType == 'delivery') {
      if (points.length > 0)
        for (const point of points) {
          if (point.isActive) setActivePoint(point)
        }
    }
  }, [points, deliveryType])
  if (deliveryType === 'delivery') {
    return (
      <Popover
        placement='bottom-start'
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <PopoverTrigger>
          <Button
            px={0}
            variant='none'
            // alignSelf={'end'}
            // leftIcon={<MarkerPinIcon />}
            display={'flex'}
            gap={2}
            alignItems={'flex-end'}
            onClick={() => setIsOpen(true)}
          >
            <Stack
              align='flex-start'
              spacing={0.5}
              fontSize={{ base: 12, md: 14 }}
            >
              <Text
                lineHeight={'16px'}
                as={'span'}
                color='#98A2B3'
                fontWeight={400}
              >
                {t(deliveryType === 'delivery' ? 'delivery' : 'takeaway')}
              </Text>
              <Text
                lineHeight={'19px'}
                as='span'
                fontWeight={400}
                color={'gray.600'}
              >
                {!isSmallerThanLg
                  ? address?.length > 100
                    ? address.substring(0, 100) + '...'
                    : address
                  : address?.length > 27
                  ? address.substring(0, 28) + '...'
                  : address}
              </Text>
            </Stack>
            <Box alignSelf={'end'}>
              <ChevronDown />
            </Box>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          mt={0}
          bgColor='white'
          borderRadius={{ base: '0, 0, 12px, 12px', lg: '16px' }}
          border='1px solid #00000012'
          fontSize={{ base: 'xs', md: 'md' }}
          width={{ base: '100vw', lg: '540px' }}
          _dark={{ bgColor: 'paper.dark.500', borderColor: '#FFFFFF12' }}
        >
          {!isSmallerThanLg && (
            <>
              <PopoverArrow />
              <PopoverCloseButton onClick={() => setIsOpen(false)} size='md' />
            </>
          )}
          <PopoverHeader
            pt={4}
            lineHeight={1}
            fontWeight='bold'
            border='0'
            fontSize={{ base: 'md', md: 'xl' }}
          >
            {t('your_address')}
          </PopoverHeader>
          <PopoverBody width='full' mb={2}>
            {deliveryType === 'delivery' ? (
              <>
                {activePoint?.id && (
                  <CRadioGroup
                    name='address'
                    value={activePoint?.id}
                    options={pointOptions}
                    onChange={(e) => dispatch(activatePoint(e))}
                  />
                )}
                <Button
                  mt={3}
                  width='full'
                  borderColor={'#D0D5DD'}
                  borderRadius={12}
                  fontWeight={700}
                  fontSize={16}
                  variant='solid'
                  height={'48px'}
                  lineHeight={'24px'}
                  onClick={() => {
                    dispatch(onOpenMap())
                    dispatch(setMapModalLg(true))
                    setIsOpen(false)
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
                    value={branch?.id}
                    options={[{ label: branch.name, value: branch.id }]}
                    onChange={(e) => console.log(e)}
                  />
                )}
                <Button
                  mt={6}
                  width='full'
                  colorScheme='primary'
                  _active={{ color: '#fff', bgColor: 'primary.500' }}
                  variant='outline'
                  size={{ base: 'sm', md: 'lg' }}
                  onClick={() => {
                    dispatch(onOpenMap())
                    setIsOpen(false)
                    isSmallerThanLg && dispatch(setMapModalLg(true))
                  }}
                >
                  {t('select_another_branch')}
                </Button>
              </>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Button
      px={0}
      variant='none'
      // leftIcon={<MarkerPinIcon />}
      onClick={() => {
        dispatch(onOpenMap())
        setIsOpen(true)
        isSmallerThanLg && dispatch(setMapModalLg(true))
      }}
      display={'flex'}
      gap={2}
      alignItems={'flex-end'}
      borderRadius={'full'}
    >
      <Stack align='flex-start' spacing={0.5} fontSize={{ base: 12, md: 14 }}>
        <Text as={'span'} color='#98A2B3' fontWeight={500}>
          {deliveryType === 'delivery'
            ? `${t('delivery')} ~ ` +
              (branch?.future_self_pickup_order_time
                ? branch?.future_self_pickup_order_time
                : 50)
            : t('from_the_branch')}
        </Text>
        <Text as='span' fontWeight={400} color={'gray.600'}>
          {address?.length > 25 ? address.substring(0, 25) + '...' : address}
        </Text>
      </Stack>
      <Box alignSelf={'end'}>
        <ChevronDown />
      </Box>
    </Button>
  )
}

function errorHandler(err: any) {
  if (err.code === 1) {
    console.log('Error: Access is denied!')
  } else if (err.code === 2) {
    console.log('Error: Position is unavailable!')
  }
}

export default AddressButton
