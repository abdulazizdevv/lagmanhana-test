import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { useI18n } from '@/_locales/client'
import { saveBranchData, setMapModalLg } from '@/_store/common/common.slice'
import { countryGeometries } from '@/_constants'
import YandexMap from '../../../Map'
import BranchCard from '../BranchCard'
import { IBranch, IRedux } from '@/_types'
import { Icon } from '@iconify/react/dist/iconify.js'
import BranchList from './components/BranchList'
import { dataLayerComponent } from '@/_utils/gtm'
import { useBranchList } from '@/_services/branches'
import useDebounce from '@/_hooks/useDebounce'
import Branches from './components/Lists'
import { usePathname } from 'next/navigation'

export const ModalContentLg = () => {
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null)
  const [geometry, setGeometry] = useState<number[]>(countryGeometries['KZ'])
  const [tabIndex, setTabIndex] = useState(0)

  const [isFocus, setFocus] = useState(false)
  const [searchValue, onChangeValue] = useState('')

  const debouncedSearch = useDebounce(searchValue, 600)

  const t = useI18n()
  const dispatch = useDispatch()
  const mapRef = useRef<any>(null)
  const pathname = usePathname()
  const { location } = useSelector((state: IRedux) => state.common)
  const country = useSelector((state: IRedux) => state.settings.country)

  useEffect(() => {
    if (location) {
      setGeometry(location)
    } else {
      setGeometry(countryGeometries[country?.iso_code || 'KZ'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const onConfirm = () => {
    if (selectedBranch) {
      dispatch(
        saveBranchData({
          id: selectedBranch.id,
          menu_id: selectedBranch.menu_id || '',
          address: selectedBranch.address,
          name: selectedBranch.name,
          location: selectedBranch.location,
          slug: selectedBranch.slug,
          future_delivery_order_time: selectedBranch.future_delivery_order_time,
          future_self_pickup_order_time:
            selectedBranch.future_self_pickup_order_time,
          work_hour_end: selectedBranch?.work_hour_end,
          work_hour_start: selectedBranch?.work_hour_start,
        })
      )
      // dataLayerComponent({
      //   event: 'Select_receiving_method',
      //   Type_method: 'Самовывоз',
      // })
      if (pathname?.length < 4) {
        window.location.reload()
      }
      dispatch(setMapModalLg(false))
    }
  }

  const onChange = (value: IBranch) => {
    setSelectedBranch(value)
    setGeometry([value.location.lat, value.location.long])
  }

  const onBranchClick = (branch: any) => {
    setSelectedBranch(branch)
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

  const onChangeTabs = (i: number) => {
    setTabIndex(i)
  }

  const { data: results } = useBranchList({
    params: { page: 1, limit: 100, search: debouncedSearch },
    props: {
      retry: 1,
      enabled: true,
    },
  })

  const onBranchSelect = (val: any) => {
    setSelectedBranch(val)
  }
  const onChangeBranch = (value: IBranch | null) => {
    onBranchClick(value)
    if (value?.location) {
      setGeometry([value?.location?.lat, value?.location?.long])
    }
  }

  return (
    <Box
      flex={1}
      zIndex={20}
      display='flex'
      position='relative'
      bgColor='transparent'
      flexDirection='column'
      border='1px solid #FFFFFF12'
      borderRadius='0 0 12px 12px'
      _dark={{ bgColor: 'paper.dark.500', borderColor: '#FFFFFF12' }}
      maxH={'100vh'}
      overflow={'hidden'}
    >
      <Flex
        p={4}
        gap={2}
        bg='#fff'
        flexDir='column'
        position='relative'
        zIndex={1}
      >
        <Text
          // pt='6px'
          pb='8px'
          lineHeight={1}
          fontWeight={700}
          border='0'
          fontSize={16}
        >
          {t('which_branch_take')}
        </Text>
        <Flex w='100%' flex={1} alignItems='center' h={'48px'} gap={2}>
          <IconButton
            variant='ghost'
            onClick={() => {
              dispatch(setMapModalLg(false))
            }}
            height={'48px'}
            width={'48px'}
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
            <BranchList
              isFocus={isFocus}
              setFocus={setFocus}
              searchValue={searchValue}
              onChange={onChangeValue}
            />
          </Box>
        </Flex>
        <Tabs
          onChange={onChangeTabs}
          variant='unstyled'
          colorScheme='#fff'
          defaultIndex={tabIndex}
          position='absolute'
          top='120%'
          left='50%'
          zIndex={1}
          transform='translateX(-50%)'
          w='90%'
        >
          <TabList
            w='full'
            bg='#F5F6FA'
            display='flex'
            alignItems='center'
            borderRadius='12px'
            justifyContent='center'
            boxShadow='0px 0px 12px 0px #0000000D'
            p={1}
          >
            <Tab _selected={{ bg: 'white' }} w='100%' borderRadius='8px'>
              {t('map')}
            </Tab>
            <Tab _selected={{ bg: 'white' }} w='100%' borderRadius='8px'>
              {t('list')}
            </Tab>
          </TabList>
        </Tabs>
      </Flex>
      {tabIndex === 0 ? (
        <Flex flex={1} overflow={'hidden'}>
          <YandexMap
            mapRef={mapRef}
            isLoading={false}
            geometry={geometry}
            deliveryType='self-pickup'
            onLocationChange={onChange}
            onBranchClick={onBranchClick}
            onSelectBranch={onChangeBranch}
            selectedBranch={selectedBranch}
          />
        </Flex>
      ) : (
        <Box flex={1} mt={71} overflow='hidden'>
          <Branches
            results={results?.branches}
            onSelect={onBranchSelect}
            onChange={onChange}
            isActiveBranch={selectedBranch?.id}
          />
        </Box>
      )}

      <Stack p={4} bgColor='#fff'>
        {tabIndex === 0 && <BranchCard data={selectedBranch} />}
        <Button width='full' h={'48px'} variant='primary' onClick={onConfirm}>
          {t('select')}
        </Button>
      </Stack>
    </Box>
  )
}
