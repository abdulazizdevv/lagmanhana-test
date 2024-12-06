'use client'

import {
  activatePoint,
  onCloseMap,
  saveDeliveryType,
  saveLocation,
  savePoint,
  saveBranchData,
  updatePoint,
  setDeliveryZoneId,
  setMapModalLg,
  clearBranchData,
} from '@/_store/common/common.slice'
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  TabPanel,
  TabPanels,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CTabs from '../Tabs'
import { useI18n } from '@/_locales/client'
import Branches from './components/Branches'
import AddressSearch from '../AddressSearch'
import YandexMap from './components/YandexMap'
import { IBranch, IDeliveryZone, IPoint, IRedux } from '@/_types'
import { v4 as uuidv4 } from 'uuid'
import { getBranchDeliveryHours, getNearestBranch } from '@/_services/branches'
import { getCheckPointDeliveryZones } from '@/_services/zoneService'
import { countryGeometries } from '@/_constants'
import Form from './components/Form'
import ZoneAlert from './components/ZoneAlert'
import NearestBranch from './components/NearestBranch'
import { ModalContentLg } from '@/_components/Map/components/OrderTypes/Delivery/ModalContent'
import { ModalContentLg as ModalContentLgTakeaway } from '@/_components/Map/components/OrderTypes/Takeaway/components/Content/ModalContent'
import { getSettings } from '@/_services/settings'
import { useQuery } from '@tanstack/react-query'
import ConfirmModal from '../ConfirmModal'
import OrderTimePicker from '../OrderTimePicker'
import { checkoutActions } from '@/_store/checkout/checkout.slice'

function Map() {
  const {
    points,
    isMapModal,
    deliveryType,
    location,
    editingPoint,
    isMapModalLg,
  } = useSelector((state: IRedux) => state.common)
  const country = useSelector((state: IRedux) => state.settings.country)
  const checkoutState = useSelector((state: IRedux) => state.checkout)
  const user = useSelector((state: IRedux) => state.auth.user)

  const [markerCoords, setMarkerCoords] = useState<number[]>(
    countryGeometries['KZ']
  )

  const [isPreorder, setPreorder] = useState(false)
  const [isTimePicker, setTimePicker] = useState(false)
  const [errorZone, setErrorZone] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [addressName, setAddressName] = useState('')
  const [deliveryZone, setDeliveryZone] = useState<IDeliveryZone | null>(null)
  const [type, setType] = useState(deliveryType ?? 'delivery')
  const [geometry, setGeometry] = useState<number[]>(countryGeometries['KZ'])
  const [nearestBranch, setNearestBranch] = useState<IBranch | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null)

  // We need current time to know if the branches are open or close now
  const t = useI18n()
  const mapRef: any = useRef()
  const dispatch = useDispatch()
  const [isLargerThanMd] = useMediaQuery('(max-width: 960px)')
  const timer = useRef(setTimeout(() => {}, 3000))

  const { data: settingsData } = useQuery({
    queryKey: ['get-settings-list'],
    queryFn: () =>
      getSettings({ fields: 'time_distance_priority' }).then(
        (res) => res?.data
      ),
  })

  useEffect(() => {
    if (type !== deliveryType) {
      setType(deliveryType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryType, isMapModal])

  // Get details of point when editing it
  useEffect(() => {
    if (editingPoint && isMapModal) {
      setAddressName(editingPoint?.address)
      if (editingPoint?.location) {
        setGeometry(editingPoint?.location)
        setMarkerCoords(editingPoint?.location)
      }
    }
  }, [isMapModal, editingPoint])

  useEffect(() => {
    if (location) {
      setGeometry(location)
    } else {
      setGeometry(countryGeometries[country?.iso_code || 'KZ'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const handleTariffGeozone = (lat: number, lon: number) => {
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

  const onConfirm = () => {
    if (type === 'delivery') {
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
            future_delivery_order_time:
              nearestBranch?.future_delivery_order_time,
            future_self_pickup_order_time:
              nearestBranch?.future_self_pickup_order_time,
            work_hour_end: nearestBranch?.work_hour_end,
            work_hour_start: nearestBranch?.work_hour_start,
          })
        )
      } else {
        dispatch(clearBranchData())
      }
      // setPoint &&
      //   setPoint((prevState) => ({
      //     ...prevState,
      //     address: addressName,
      //   }))
    } else if (selectedBranch) {
      dispatch(
        saveBranchData({
          id: selectedBranch.id,
          menu_id: selectedBranch.menu_id ? selectedBranch.menu_id : '',
          address: selectedBranch.address,
          name: selectedBranch.name,
          location: selectedBranch.location,
          slug: selectedBranch?.slug,
          future_delivery_order_time:
            selectedBranch?.future_delivery_order_time,
          future_self_pickup_order_time:
            selectedBranch?.future_self_pickup_order_time,
          work_hour_end: selectedBranch?.work_hour_end,
          work_hour_start: selectedBranch?.work_hour_start,
        })
      )
    }
    dispatch(saveDeliveryType(type))
    dispatch(onCloseMap())
    setTimeout(() => {
      window.location.reload()
    }, 200)
  }

  const findBranchToPreorder = (
    lat: number,
    long: number,
    date_time?: string
  ) => {
    getBranchDeliveryHours({ lat, long, date_time })
      .then((res) => {
        if (res?.data?.branches?.length > 0) {
          setNearestBranch(res?.data?.branches[0])
          return
        }
        setNearestBranch(null)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  const findNearestBranch = async (lat: number, long: number) => {
    getNearestBranch(lat, long)
      .then((res) => {
        if (res?.data?.branches?.length > 0) {
          for (let branch of res?.data?.branches) {
            if (branch.is_active) {
              setNearestBranch(branch)
              return
            }
          }
        }

        if (settingsData?.settings?.[0]?.value?.value) {
          setNearestBranch(null)
          setPreorder(true)
        } else {
          findBranchToPreorder(lat, long)
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  const onFutureTimeChange = (val: string) => {
    dispatch(checkoutActions.changeFutureTime(val))
    findBranchToPreorder(markerCoords[0], markerCoords[1], val)
    setTimePicker(false)
  }

  const onBranchClick = (branch: any) => {
    setSelectedBranch(branch)
    setAddressName(branch.address)

    if (mapRef.current) {
      mapRef.current?.setCenter(
        [branch.location.lat, branch.location.long],
        18,
        {
          duration: 300,
        }
      )
    }
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

  const onClose = () => {
    dispatch(onCloseMap())
  }

  const onAddressSelect = (e: any) => {
    setAddressName(e?.address)
    setGeometry(e?.location)
  }

  const deliveryOptions = [
    { label: t('delivery'), value: 'delivery' },
    { label: t('takeaway'), value: 'self-pickup' },
  ]

  const onChangeBranch = (value: IBranch | null) => {
    onBranchClick(value)
    if (value?.location) {
      setGeometry([value?.location?.lat, value?.location?.long])
    }
  }

  return (
    <>
      {/* MAP */}
      <Modal
        isCentered
        onClose={onClose}
        size={{ base: 'full', md: '4xl' }}
        // isOpen={isMapModal && !isLargerThanMd}
        isOpen={!isLargerThanMd && isMapModal}
      >
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px)' />
        <ModalContent>
          {/* Desktop Version */}
          <ModalBody
            p={4}
            gap={2.5}
            display={{ base: 'none', md: 'flex' }}
            minH='520px'
          >
            <ModalCloseButton
              width={10}
              height={10}
              zIndex={1}
              top={8}
              right={6}
              bgColor='white'
              rounded='full'
              boxShadow='4px 4px 12px 0px #00000029'
            />
            <Stack flex={1} gap={0}>
              <Heading fontSize='24px' mb={2}>
                {deliveryType === 'delivery'
                  ? t('select_delivery_address')
                  : t('select_branch')}
              </Heading>
              <Text color='gray.600' mb={4}>
                {t('to_see_your_current_menu')}
              </Text>
              <CTabs
                style={{ height: '100%' }}
                tabs={deliveryOptions}
                onChange={(e) => setType(e)}
                defaultValue={deliveryType}
                // isSwitchVisible={!Boolean(editingPoint || creatingPoint)}
                isSwitchVisible={false}
                panels={
                  <TabPanels h='full'>
                    <TabPanel p={0}>
                      <AddressSearch
                        value={addressName}
                        placeholder={t('search_by_address_or_organization')}
                        onSelect={(e) => onAddressSelect(e)}
                        name=''
                        userLocation={undefined}
                        region={undefined}
                      />
                      <Form
                        errorZone={errorZone}
                        nearestBranch={nearestBranch}
                      />
                    </TabPanel>
                    <TabPanel
                      p={0}
                      pb={10}
                      overflow='hidden'
                      h='full'
                      display='flex'
                      flexDir='column'
                    >
                      <Branches
                        selectedBranch={selectedBranch}
                        onBranchSelect={(e) => onBranchClick(e)}
                      />
                    </TabPanel>
                  </TabPanels>
                }
              />
              <Box mt='auto'>
                {deliveryType === 'delivery' && (
                  <>
                    {errorZone ? (
                      <ZoneAlert />
                    ) : (
                      <NearestBranch data={nearestBranch} />
                    )}
                  </>
                )}
                <Button
                  mt={2}
                  size='lg'
                  width='full'
                  variant='primary'
                  isDisabled={
                    !isLoading &&
                    ((type === 'delivery' &&
                      !errorZone &&
                      markerCoords?.length > 0 &&
                      addressName.length > 0) ||
                      (type == 'self-pickup' && selectedBranch))
                      ? false
                      : true
                  }
                  onClick={() =>
                    (type === 'delivery' && markerCoords?.length > 0) ||
                    (type == 'self-pickup' && selectedBranch)
                      ? onConfirm()
                      : undefined
                  }
                >
                  {t('save')}
                </Button>
              </Box>
            </Stack>
            <YandexMap
              deliveryZone={deliveryZone}
              mapRef={mapRef}
              geometry={geometry}
              deliveryType={type}
              isLoading={isLoading}
              onLocationChange={onChange}
              onBranchClick={onBranchClick}
              onSelectBranch={onChangeBranch}
              onMapBounded={(ll) => setMarkerCoords(ll)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Mobile  */}
      <Modal
        isOpen={isLargerThanMd && isMapModalLg}
        onClose={() => dispatch(setMapModalLg(false))}
        size={'full'}
      >
        <ModalContent>
          <ModalBody p={0} display='flex' flexDir='column'>
            {deliveryType === 'delivery' ? (
              <ModalContentLg />
            ) : (
              <ModalContentLgTakeaway />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <ConfirmModal
        isOpen={isPreorder}
        onConfirm={() => setTimePicker(true)}
        title={t('attention')}
        onClose={() => setPreorder(false)}
        description={t('would_u_like_to_preorder')}
      />
      <OrderTimePicker
        isOpen={isTimePicker}
        onClose={() => setTimePicker(false)}
        onChange={onFutureTimeChange}
        value={checkoutState?.future_time ? checkoutState?.future_time : null}
        title={t('delivery_time')}
        interval={0}
        branchWorkHours={{
          work_hour_start: '00:00',
          work_hour_end: '23:59',
        }}
      />
    </>
  )
}

export default Map
