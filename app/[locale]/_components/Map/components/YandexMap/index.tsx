import {
  Clusterer,
  GeolocationControl,
  Map,
  Placemark,
  Polygon,
  YMaps,
} from '@pbe/react-yandex-maps'
import { useEffect, useState } from 'react'
import { Box, Center, Divider, Flex } from '@chakra-ui/react'
import Marker from './components/Marker'
import axios from 'axios'
import styles from './styles.module.scss'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useBranchList } from '@/_services/branches'
import { IBranch, IDeliveryZone } from '@/_types'
import { getActiveDeliveryZones } from '@/_services/zoneService'
import { useI18n } from '@/_locales/client'
import getAPIKey from '@/_utils/getAPIKey'
import NearestBranchControl from './components/NearestBranchControl'
import mapPin from '@/_assets/map_pin.svg'

interface IProps {
  mapRef: any
  selectedBranch?: IBranch | null
  deliveryZone: IDeliveryZone | null
  isLoading: boolean
  deliveryType: string
  geometry: number[]
  onLocationChange: (e: any, isSelect: boolean) => void
  onMapBounded: (e: any) => void
  onBranchClick: (e: any) => void
  onSelectBranch: (e: IBranch | null) => void
}

const YandexMap = ({
  mapRef,
  geometry,
  isLoading,
  selectedBranch,
  deliveryZone,
  deliveryType,
  onSelectBranch = () => {},
  onBranchClick = () => {},
  onLocationChange,
  onMapBounded = (e) => {},
}: IProps) => {
  const apikey = getAPIKey()
  const t = useI18n()

  const [zoom, setZoom] = useState(12)
  const [isDragging, setDragging] = useState(false)
  const [ymaps, setYmaps] = useState<any>()
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
        `<div class=${styles.geolocationControl}>
        <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        xmlns='http://www.w3.org/2000/svg'
      >
        <mask
          id='mask0_1138_50368'
          style={{ maskType: 'alpha' }}
          maskUnits='userSpaceOnUse'
          x='0'
          y='0'
          width='18'
          height='18'
        >
          <rect width='18' height='18' fill='#D9D9D9' />
        </mask>
        <g mask='url(#mask0_1138_50368)'
        >
          <path
            d='M7.53789 10.4623L2.68164 8.49356C2.51914 8.43105 2.40039 8.33418 2.32539 8.20293C2.25039 8.07168 2.21289 7.9373 2.21289 7.7998C2.21289 7.6623 2.25352 7.52793 2.33477 7.39668C2.41602 7.26543 2.53789 7.16855 2.70039 7.10605L14.2129 2.83105C14.3629 2.76855 14.5066 2.75605 14.6441 2.79355C14.7816 2.83105 14.9004 2.8998 15.0004 2.9998C15.1004 3.0998 15.1691 3.21855 15.2066 3.35605C15.2441 3.49355 15.2316 3.6373 15.1691 3.7873L10.8941 15.2998C10.8316 15.4623 10.7348 15.5842 10.6035 15.6654C10.4723 15.7467 10.3379 15.7873 10.2004 15.7873C10.0629 15.7873 9.92852 15.7498 9.79727 15.6748C9.66602 15.5998 9.56914 15.4811 9.50664 15.3186L7.53789 10.4623Z'
            fill="inherit"
          />
        </g>
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
      <Flex flexDir='column' className={styles.zoomControl}>
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
              }}
            >
              {branches?.branches?.map((branch: IBranch) => (
                <Placemark
                  key={branch.id}
                  options={{
                    iconColor: '#F87A1D',
                    iconImageOffset: [-25, -50],
                  }}
                  geometry={[branch.location.lat, branch.location.long]}
                  onClick={() => onBranchClick(branch)}
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
