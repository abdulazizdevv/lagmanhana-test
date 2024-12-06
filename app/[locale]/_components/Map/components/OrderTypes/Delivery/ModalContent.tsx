import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import { useI18n } from '@/_locales/client'
import {
  activatePoint,
  saveBranchData,
  saveLocation,
  savePoint,
  setDeliveryZoneId,
  setMapModalLg,
  updatePoint,
} from '@/_store/common/common.slice'
import { countryGeometries } from '@/_constants'
import { getNearestBranch } from '@/_services/branches'
import { IBranch, IDeliveryZone, IPoint, IRedux } from '@/_types'
import { Icon } from '@iconify/react/dist/iconify.js'
import AddressSearch from '@/_components/AddressSearch'
import ZoneAlert from '@/_components/Map/components/ZoneAlert'
import NearestBranch from '@/_components/Map/components/NearestBranch'
import { getCheckPointDeliveryZones } from '@/_services/zoneService'
import { v4 as uuidv4 } from 'uuid'
import { dataLayerComponent } from '@/_utils/gtm'
import YandexMap from '../Map'
import { usePathname } from 'next/navigation'

export const ModalContentLg = () => {
  const [nearestBranch, setNearestBranch] = useState<IBranch | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [addressName, setAddressName] = useState('')
  const [geometry, setGeometry] = useState<number[]>(countryGeometries['KZ'])
  const [markerCoords, setMarkerCoords] = useState<number[]>(
    countryGeometries['KZ']
  )
  const [errorZone, setErrorZone] = useState(false)
  const [deliveryZone, setDeliveryZone] = useState<IDeliveryZone | null>(null)
  const [lg] = useMediaQuery('(max-width: 960px)')
  const t = useI18n()
  const mapRef: any = useRef()
  const dispatch = useDispatch()
  const timer = useRef(setTimeout(() => {}, 3000))
  const { points, editingPoint, location } = useSelector(
    (state: IRedux) => state.common
  )
  const country = useSelector((state: IRedux) => state.settings.country)

  const pathname = usePathname()

  useEffect(() => {
    if (location) {
      setGeometry(location)
    } else {
      setGeometry(countryGeometries[country?.iso_code || 'KZ'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const onAddressSelect = (e: any) => {
    setAddressName(e?.address)
    setGeometry(e?.location)
  }

  const onConfirm = () => {
    const coords = markerCoords
    dispatch(saveLocation(coords))
    dispatch(setDeliveryZoneId(deliveryZone?.id || ''))

    if (editingPoint) {
      dispatch(
        updatePoint({
          ...editingPoint,
          location: coords,
          address: addressName,
          isActive: true,
        })
      )
    } else {
      const isAddressSaved = points.find(
        (item: IPoint) => item.address === addressName
      )
      if (isAddressSaved) {
        dispatch(activatePoint(isAddressSaved.id))
      } else {
        dispatch(
          savePoint({
            id: uuidv4(),
            location: coords,
            address: addressName,
            isActive: true,
          })
        )
      }
    }
    if (nearestBranch) {
      dispatch(
        saveBranchData({
          id: nearestBranch.id,
          menu_id: nearestBranch.menu_id ? nearestBranch.menu_id : '',
          address: nearestBranch.address,
          name: nearestBranch.name,
          slug: nearestBranch?.slug,
          location: nearestBranch.location,
          future_delivery_order_time: nearestBranch?.future_delivery_order_time,
          future_self_pickup_order_time:
            nearestBranch?.future_self_pickup_order_time,
          work_hour_end: nearestBranch?.work_hour_end,
          work_hour_start: nearestBranch?.work_hour_start,
        })
      )
    }
    // dataLayerComponent({
    //   event: 'Select_receiving_method',
    //   Type_method: 'Адресная доставка',
    // })
    if (pathname?.length < 4) {
      window.location.reload()
    }
    dispatch(setMapModalLg(false))
  }

  const onChange = (value: any, isSelect: boolean) => {
    if (isSelect) {
      setMarkerCoords(value?.location)
    }
    setLoading(true)
    setAddressName(value?.address)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      handleTariffGeozone(value?.location[0], value?.location[1])
      findNearestBranch(value?.location[0], value?.location[1])
    }, 2000)
  }

  const handleTariffGeozone = (lat: any, lon: any) => {
    getCheckPointDeliveryZones({ lat, lon }).then(({ data }) => {
      if (data?.all_count > 0 && !data?.result?.length) {
        setMarkerCoords([])
        setErrorZone(true)
      } else {
        setErrorZone(false)
      }
      if (data?.result?.length > 0) {
        setDeliveryZone(data?.result?.[0])
      } else {
        setDeliveryZone(null)
      }
    })
  }

  const findNearestBranch = async (lat: any, long: any) => {
    getNearestBranch(lat, long)
      .then((res) => {
        if (res?.data?.branches) {
          for (let branch of res?.data?.branches) {
            if (branch.is_active) {
              setNearestBranch(branch)
              return
            }
          }
        }

        setNearestBranch(null)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  return (
    <Box
      flex={1}
      zIndex={20}
      height='100%'
      display='flex'
      position='relative'
      flexDirection='column'
      border='1px solid #FFFFFF12'
      borderRadius='0 0 12px 12px'
      _dark={{ bgColor: 'paper.dark.500', borderColor: '#FFFFFF12' }}
      maxH={'100vh'}
      overflow={'auto'}
    >
      {/* Top section */}
      <Flex flexDir='column' bg='#fff' gap={2} p={4}>
        <Text fontWeight={700}>{t('add_your_delivery_address')}</Text>
        <Flex w='100%' flex={1} alignItems='center' gap={2}>
          <IconButton
            variant='ghost'
            onClick={() => {
              dispatch(setMapModalLg(false))
            }}
            h={'48px'}
            w={'48px'}
            aria-label='Close the map'
            icon={
              <Icon
                cursor='pointer'
                icon='eva:arrow-back-outline'
                width='24px'
                height='24px'
              />
            }
          />
          <Box flex={1}>
            <AddressSearch
              value={addressName}
              placeholder={
                lg ? t('address') : t('search_by_address_or_organization')
              }
              name='search'
              onSelect={(e) => onAddressSelect(e)}
              userLocation={undefined}
              region={undefined}
              noDirectFocus={true}
            />
          </Box>
        </Flex>
      </Flex>

      {/* Middle section with scrolling map */}
      <Flex flex={1}>
        <YandexMap
          mapRef={mapRef}
          geometry={geometry}
          isLoading={isLoading}
          deliveryType='delivery'
          deliveryZone={deliveryZone}
          onLocationChange={onChange}
          selectedBranch={nearestBranch}
          onMapBounded={(ll) => setMarkerCoords(ll)}
        />
      </Flex>

      {/* Bottom section */}
      <Stack bg='#fff' p={4}>
        {errorZone ? <ZoneAlert /> : <NearestBranch data={nearestBranch} />}
        <Button
          size='lg'
          width='full'
          variant='primary'
          onClick={onConfirm}
          isDisabled={!addressName}
        >
          {t('select')}
        </Button>
      </Stack>
    </Box>
  )
}
