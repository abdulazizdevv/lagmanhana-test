import {
  Clusterer,
  GeolocationControl,
  Map,
  Placemark,
  Polygon,
  YMaps,
} from '@pbe/react-yandex-maps'
import { useEffect } from 'react'
import { useState } from 'react'
import { Box, Center, Divider, Flex, useMediaQuery } from '@chakra-ui/react'
import Marker from './components/Marker'
import axios from 'axios'
import styles from './styles.module.scss'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useBranchList } from '@/_services/branches'
import { IBranch, IDeliveryZone } from '@/_types'
import { getActiveDeliveryZones } from '@/_services/zoneService'
import { useI18n } from '@/_locales/client'
import { fonts } from '@/fonts'
import mapPin from '@/_assets/map_pin.svg'
import NearestBranchControl from '../../YandexMap/components/NearestBranchControl'

const apikey = '44197996-2c76-4b1a-847c-12b35a17cff5'

interface IProps {
  mapRef: any
  selectedBranch?: any
  height?: string
  deliveryZone?: IDeliveryZone | null
  isLoading: boolean
  deliveryType: string
  geometry: number[]
  onLocationChange: (e: any, isSelect: boolean) => void
  onMapBounded?: (e: any) => void
  onBranchClick?: (e: any) => void
  onSelectBranch?: (e: IBranch | null) => void
}

const YandexMap = ({
  height,
  mapRef,
  geometry,
  isLoading,
  deliveryZone,
  deliveryType,
  selectedBranch,
  onBranchClick = () => {},
  onSelectBranch = () => {},
  onLocationChange,
  onMapBounded = (e) => {},
}: IProps) => {
  const t = useI18n()

  const [zoom, setZoom] = useState(12)
  const [ymaps, setYmaps] = useState<any>()
  const [isDragging, setDragging] = useState(false)
  const [deliveryZones, setDeliveryZones] = useState<IDeliveryZone[]>([])

  const { data: branches } = useBranchList({
    params: { page: 1, limit: 100 },
    props: {
      enabled: true,
    },
  })

  const onBoundsChange = (e: any) => {
    const coords = e.originalEvent.newCenter
    setDragging(false)
    if (deliveryType === 'delivery') {
      getAddress([coords[1], coords[0]])
      onMapBounded(coords)
    }
  }

  const getAddress = async (coords: number[]) => {
    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apikey}&geocode=${String(
          coords
        )}&lang=ru_RU&format=json`
      )

      if (response?.data) {
        const geoObject =
          response?.data?.response?.GeoObjectCollection?.featureMember[0]
            ?.GeoObject
        let city = ''
        if (geoObject.metaDataProperty?.GeocoderMetaData?.Address?.Components) {
          for (const item of geoObject.metaDataProperty?.GeocoderMetaData
            ?.Address?.Components) {
            if (item.kind === 'locality') {
              city = item.name
            }
          }
        }

        onLocationChange(
          {
            address: geoObject?.name,
            city,
            location: [coords[1], coords[0]],
          },
          false
        )
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message)
    }
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

  const geolocationLayout = () => {
    if (ymaps) {
      return ymaps?.templateLayoutFactory?.createClass(
        `<div class='${styles.geolocationControl} ${
          fonts.GTWalsheimPro.className
        }'>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.53789 8.46249L0.681641 6.49374C0.519141 6.43124 0.400391 6.33436 0.325391 6.20311C0.250391 6.07186 0.212891 5.93749 0.212891 5.79999C0.212891 5.66249 0.253516 5.52811 0.334766 5.39686C0.416016 5.26561 0.537891 5.16874 0.700391 5.10624L12.2129 0.831238C12.3629 0.768738 12.5066 0.756238 12.6441 0.793738C12.7816 0.831238 12.9004 0.899988 13.0004 0.999988C13.1004 1.09999 13.1691 1.21874 13.2066 1.35624C13.2441 1.49374 13.2316 1.63749 13.1691 1.78749L8.89414 13.3C8.83164 13.4625 8.73477 13.5844 8.60352 13.6656C8.47227 13.7469 8.33789 13.7875 8.20039 13.7875C8.06289 13.7875 7.92852 13.75 7.79727 13.675C7.66602 13.6 7.56914 13.4812 7.50664 13.3187L5.53789 8.46249Z" fill="black"/>
          </svg>
          ${
            deliveryType === 'self-pickup'
              ? t('determine_location')
              : t('determine_location_delivery')
          }
        </div>`
      )
    }

    return undefined
  }

  useEffect(() => {
    getActiveZones()
  }, [])

  //? Dark mode
  // useEffect(() => {
  //   if (ymaps && mapRef.current) {
  //     mapRef.current.layers.add(
  //       new ymaps.Layer(
  //         'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&theme=dark&%c&%l&scale={{ scale }}'
  //       )
  //     )
  //   }
  // }, [ymaps])

  return (
    <Box
      className={styles.wrapper}
      position='relative'
      overflow='hidden'
      // height={height ? height : '45vh'}
      borderRadius={{ base: 'none', md: '2xl' }}
    >
      {deliveryType === 'delivery' && (
        <Marker
          zoneData={deliveryZone}
          hover={isDragging}
          isLoading={isLoading}
        />
      )}
      {deliveryType === 'self-pickup' && (
        <NearestBranchControl onSelectBranch={onSelectBranch} />
      )}
      <Flex
        top={{ base: '40%', md: 18 }}
        flexDir='column'
        className={styles.zoomControl}
      >
        <Center
          onClick={() => {
            mapRef?.current?.setZoom(zoom + 1, { duration: 100 })
            setZoom(zoom + 1)
          }}
          flex={1}
        >
          <Icon icon='material-symbols:add-rounded' />
        </Center>
        <Divider />
        <Center
          onClick={() => {
            mapRef?.current?.setZoom(zoom - 1, { duration: 100 })
            setZoom(zoom - 1)
          }}
          flex={1}
        >
          <Icon icon='material-symbols:remove-rounded' />
        </Center>
      </Flex>
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
          modules={['Placemark', 'geocode', 'Layer', 'templateLayoutFactory']}
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
          {deliveryType === 'delivery' && (
            <GeolocationControl
              options={{
                layout: geolocationLayout(),
                position: { bottom: '10px', left: '50%' },
              }}
            />
          )}
          {deliveryType === 'self-pickup' ? (
            <Clusterer
              options={{
                clusterIconColor: '#F87A1D',
                groupByCoordinates: false,
                zoom: 15,
              }}
            >
              {branches?.branches?.map((branch: IBranch) => (
                <Placemark
                  key={branch.id}
                  geometry={[branch.location.lat, branch.location.long]}
                  options={{
                    iconColor: '#F87A1D',
                    cursor: 'pointer',
                    iconImageOffset: [-25, -50],
                  }}
                  onClick={() => {
                    mapRef &&
                      mapRef.current?.setCenter(
                        [branch.location.lat, branch.location.long],
                        18,
                        {
                          duration: 300,
                        }
                      )
                    onBranchClick(branch)
                  }}
                />
              ))}
            </Clusterer>
          ) : (
            deliveryZones?.map((zone, idx) => (
              <Polygon
                key={zone?.id}
                geometry={[zone?.points ? zone?.points : []]}
                options={{
                  fillColor: (zone?.rgb_code || '#ffff00') + '50',
                  fillOpacity: 1,
                  strokeColor: zone?.rgb_code || '#ffff00',
                }}
              />
            ))
          )}
        </Map>
      </YMaps>
    </Box>
  )
}

function errorHandler(err: any) {
  if (err.code === 1) {
    console.log('Error: Access is denied!')
  } else if (err.code === 2) {
    console.log('Error: Position is unavailable!')
  }
}

export default YandexMap
