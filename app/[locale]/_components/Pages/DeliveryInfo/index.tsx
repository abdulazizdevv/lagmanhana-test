'use client'
import BreadCrumb from '@/_components/Breadcrumb'
import { useI18n } from '@/_locales/client'
import styles from './style.module.scss'
import {
  getActiveDeliveryZones,
  getCheckPointDeliveryZones,
} from '@/_services/zoneService'

import { IDeliveryZone, IRedux, ISourceSettings } from '@/_types'
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react'
import { Map, Polygon, YMaps, ZoomControl } from '@pbe/react-yandex-maps'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import Marker from '@/_components/Map/components/YandexMap/components/Marker'
import { countryGeometries } from '@/_constants'
import { useSelector } from 'react-redux'
import Payment from './components/Payment'
import Details from './components/Details'
import ZoneCard from './components/ZoneCard'

interface IProps {
  settings: ISourceSettings
}

const apikey = '44197996-2c76-4b1a-847c-12b35a17cff5'

function DeliveryInfo({ settings }: IProps) {
  const t = useI18n()
  const mapRef: any = useRef()
  const country = useSelector((state: IRedux) => state.settings.country)

  const [isDragging, setDragging] = useState(false)
  const [activeZone, setActiveZone] = useState('')
  const [ymaps, setYmaps] = useState<any>()
  const [deliveryZones, setDeliveryZones] = useState<IDeliveryZone[]>([])
  const [geozoneData, setGeozoneData] = useState<IDeliveryZone | null>(null)
  const [geometry, setGeometry] = useState<number[]>(countryGeometries['KZ'])

  const onBoundsChange = (e: any) => {
    const coords = e.originalEvent.newCenter
    setDragging(false)
    handleTariffGeozone(coords[0], coords[1])
  }

  const handleTariffGeozone = (lat: any, lon: any) => {
    getCheckPointDeliveryZones({ lat, lon }).then(({ data }) => {
      if (data.result?.length > 0) {
        setGeozoneData(data.result?.[0])
      } else {
        setGeozoneData(null)
      }
    })
  }

  const getActiveZones = () => {
    getActiveDeliveryZones({}).then((res) => {
      const result = res?.data?.delivery_zones?.map((item: any) => ({
        ...item,
        points: item?.points?.map((el: { lat: number; lon: number }) => [
          el.lat,
          el.lon,
        ]),
      }))
      setDeliveryZones(result)
    })
  }

  useEffect(() => {
    getActiveZones()
    if (country?.iso_code) {
      setGeometry(countryGeometries[country?.iso_code || 'KZ'])
    }
  }, [])

  const BreadCrumbBranches = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('zone_delivery'),
      link: '',
    },
  ]

  const source = useMemo(
    () => settings?.sources?.find((item) => item.source === 'website'),
    [settings?.sources]
  )

  return (
    <Container>
      <Box my={'24px'}>
        <BreadCrumb items={BreadCrumbBranches} />
        <Heading as={'h1'} mt={'12px'} fontSize={{ base: 24, md: 32 }}>
          {t('seo.h1_delivery_zone')}
        </Heading>
      </Box>
      <Grid
        templateColumns={{
          base: '1fr',
          md: deliveryZones?.length > 0 ? '1fr 2fr' : '1fr',
        }}
        gap={'34px'}
        bg='#fff'
        p={4}
        rounded='2xl'
        w={'full'}
        h={{ base: '550px', md: '530px' }}
      >
        {deliveryZones?.length > 0 && (
          <Box
            maxW={{ base: '100%', md: '400px', lg: '520px' }} // Responsive max width
            w={{ base: '100%', md: '400px', lg: '520px' }}
            maxH={{ base: '100%', md: '500px' }} // Responsive max width
            h={{ base: '270px', md: '520px' }}
            overflowY='auto'
          >
            {deliveryZones?.map((el) => (
              <ZoneCard
                geozoneData={geozoneData}
                setActiveZone={setActiveZone}
                key={el.id}
                data={el}
              />
            ))}
          </Box>
        )}
        <Box
          className={styles.wrapper}
          position='relative'
          overflow='hidden'
          borderRadius={{ base: 'none', md: '2xl' }}
          h={'100%'}
        >
          <Marker zoneData={geozoneData} hover={isDragging} isLoading={false} />
          <YMaps
            query={{
              apikey: apikey,
            }}
          >
            <Map
              className={styles.mmap}
              state={{
                center: geometry,
                zoom: 12,
              }}
              onLoad={(e) => setYmaps(e)}
              instanceRef={mapRef}
              modules={['Layer']}
              onMouseDown={() => setDragging(true)}
              onBoundsChange={onBoundsChange}
              options={{
                copyrightLogoVisible: false,
                copyrightProvidersVisible: false,
                copyrightUaVisible: false,
                avoidFractionalZoom: true,
                suppressMapOpenBlock: true,
              }}
            >
              <ZoomControl />
              {deliveryZones?.map((zone: any) => (
                <Polygon
                  key={zone?.id}
                  geometry={[zone?.points ? zone?.points : []]}
                  options={{
                    fillColor: (zone?.rgb_code || '#ffff00') + '50',
                    fillOpacity: 1,
                    strokeColor: zone?.rgb_code || '#ffff00',
                    // strokeWidth: zone?.id === geozoneData?.id ? 2 : 1,
                  }}
                />
              ))}
            </Map>
          </YMaps>
        </Box>
      </Grid>
      {(source?.payment_types ?? []).length > 0 && (
        <Box my={8}>
          <Text fontSize={32} fontWeight={700}>
            {t('payment_method_2')}
          </Text>
          <Flex
            p={4}
            bg={'#fff'}
            mt={6}
            justifyContent='center'
            gap={4}
            flexWrap={'wrap'}
            borderRadius={'2xl'}
          >
            {source?.payment_types?.map(
              (item) =>
                item?.is_used && <Payment key={item?.value} data={item} />
            )}
          </Flex>
        </Box>
      )}

      {/* <Details /> */}
    </Container>
  )
}

export default DeliveryInfo
