import React, { useEffect, useState } from 'react'
import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import { useSelector } from 'react-redux'
import { countryGeometries } from '@/_constants'
import { IRedux } from '@/_types'
import { Center, Divider, Flex } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import styles from './style.module.scss'
import { useI18n } from '@/_locales/client'
import { fonts } from '@/fonts'
import mapPin from '@/_assets/map_pin.svg'

interface IProps {
  mapRef: any
  data: any
  height?: any
  onBranchSelect: (e: any) => void
}

function CMap({ mapRef, data, onBranchSelect, height }: IProps) {
  const [ymaps, setYmaps] = useState<any>()
  const [geometry, setGeometry] = useState(countryGeometries['KZ'])
  const [zoom, setZoom] = useState(12)
  const t = useI18n()
  // const mapRef = useRef<any>(null)
  const commonState = useSelector((state: IRedux) => state.common)
  const country = useSelector((state: IRedux) => state.settings.country)

  useEffect(() => {
    setGeometry(countryGeometries[country?.iso_code || 'KZ'])
  }, [country?.iso_code])

  // ? Dark Mode
  // useEffect(() => {
  //   if (ymaps && mapRef.current) {
  //     mapRef.current.layers.add(
  //       new ymaps.Layer(
  //         'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&theme=dark&%c&%l&scale={{ scale }}'
  //       )
  //     )
  //   }
  // }, [ymaps])
  const geolocationLayout = () => {
    if (ymaps) {
      return ymaps?.templateLayoutFactory?.createClass(
        `<div class='${styles.geolocationControl} ${
          fonts.GTWalsheimPro.className
        }'>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.53789 8.46249L0.681641 6.49374C0.519141 6.43124 0.400391 6.33436 0.325391 6.20311C0.250391 6.07186 0.212891 5.93749 0.212891 5.79999C0.212891 5.66249 0.253516 5.52811 0.334766 5.39686C0.416016 5.26561 0.537891 5.16874 0.700391 5.10624L12.2129 0.831238C12.3629 0.768738 12.5066 0.756238 12.6441 0.793738C12.7816 0.831238 12.9004 0.899988 13.0004 0.999988C13.1004 1.09999 13.1691 1.21874 13.2066 1.35624C13.2441 1.49374 13.2316 1.63749 13.1691 1.78749L8.89414 13.3C8.83164 13.4625 8.73477 13.5844 8.60352 13.6656C8.47227 13.7469 8.33789 13.7875 8.20039 13.7875C8.06289 13.7875 7.92852 13.75 7.79727 13.675C7.66602 13.6 7.56914 13.4812 7.50664 13.3187L5.53789 8.46249Z" fill="black"/>
</svg>

        ${t('determine_location')}</div>`
      )
    }

    return undefined
  }

  return (
    <YMaps
      query={{
        load: 'Map,Placemark',
      }}
    >
      <Map
        state={{
          center: geometry,
          zoom: 13,
          // behaviors: ['drag'],
        }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 12,
          width: '100%',
          height: height ? height : '660px',
        }}
        onLoad={(e) => setYmaps(e)}
        instanceRef={mapRef}
        modules={['Placemark', 'geocode', 'Layer', 'templateLayoutFactory']}
        options={{
          copyrightLogoVisible: false,
          copyrightProvidersVisible: false,
          copyrightUaVisible: false,
          avoidFractionalZoom: true,
          suppressMapOpenBlock: true,
        }}
      >
        {/* <GeolocationControl
          options={{
            layout: geolocationLayout(),
            position: { bottom: '110px', left: '50%' },
          }}
        /> */}
        {/* <ZoomControl /> */}
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

        <Clusterer
          options={{
            clusterIconColor: '#F87A1D',
            groupByCoordinates: false,
          }}
        >
          {data?.map((branch: any) => (
            <Placemark
              key={branch.id}
              geometry={[branch.location.lat, branch.location.long]}
              options={{
                iconColor: '#F87A1D',
                iconImageOffset: [-25, -50],
              }}
              onClick={() => {
                // console.log([branch.location.lat, branch.location.long])
                // if (mapRef.current) {
                //   mapRef.current?.setCenter(
                //     [branch.location.lat, branch.location.long],
                //     18,
                //     {
                //       duration: 300,
                //     }
                //   )
                // }

                onBranchSelect(branch)
              }}
            />
          ))}
        </Clusterer>
        {/* {commonState?.deliveryType == 'delivery' &&
          commonState?.location?.[0] && (
            <Placemark
              geometry={[commonState?.location[0], commonState?.location[1]]}
              options={{ preset: 'islands#geolocationIcon' }}
            />
          )} */}
      </Map>
    </YMaps>
  )
}

export default CMap
