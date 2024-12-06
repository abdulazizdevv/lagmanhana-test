'use client'

import Image from 'next/image'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

import styles from './style.module.scss'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { AspectRatio, Box, Skeleton, useMediaQuery } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface ICarousel {
  list: any[]
  aspectRatio?: string
  options?: object
  children?: React.ReactNode
}

function CarouselBanner({ list, aspectRatio = '3 / 2', options }: ICarousel) {
  const t = useI18n()
  const currentLocale = useCurrentLocale()
  const [lg] = useMediaQuery('(max-width: 960px)')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Box mb={{ base: 2, md: 4 }}>
        <Skeleton
          aspectRatio={{ base: '4 / 2', md: '1600 / 453' }}
          height='auto'
          width='auto'
        />
      </Box>
    )
  }
  const defaultOptions = {
    drag: true,
    arrows: false,

    pagination: false,
    classes: {
      prev: styles.slidePrevBtn,
      next: styles.slideNextBtn,
    },
  }

  return (
    <Box my={{ base: 4, md: 6 }}>
      <Splide
        className={styles.slider}
        options={{
          ...defaultOptions,
          autoplay: true,
          autoHeight: true,
          type: 'loop',
          lazyLoad: 'sequential',
          classes: {
            arrows: styles.bannerArrows,
            prev: styles.slidePrevBtn,
            next: styles.slideNextBtn,
          },
          focus: 0.3,
          perPage: 2.5,
          perMove: 2.5,
          gap: '16px',
          trimSpace: false,
          breakpoints: {
            992: {
              // perPage: 2.5,
              arrows: false,
            },
            800: {
              // focus: 'start',
              // perPage: 2,
              arrows: false,
            },
            600: {
              // focus: 'start',
              focus: 0.05,
              perPage: 1.5,
              perMove: 1,
              arrows: false,
            },
          },
          ...options,
        }}
      >
        {list?.map((item) => {
          return (
            <CustomSlide url={item.url} key={item?.id}>
              <AspectRatio
                display={'grid'}
                placeItems={'center'}
                position='relative'
                ratio={3 / 2}
                maxH={'600px'}
                borderRadius={lg ? '12px' : '32px'}
              >
                <Image
                  src={
                    item?.image?.includes(process.env.BASE_URL)
                      ? item?.image
                      : process.env.BASE_URL + item?.image
                  }
                  priority={true}
                  style={{
                    borderRadius: lg ? '12px' : '32px',
                    objectFit: 'cover',
                    aspectRatio: aspectRatio,
                    // objectPosition: '0px',
                  }}
                  loading='eager'
                  alt={
                    t('banner') +
                    ' ' +
                    item.title[currentLocale === 'kz' ? 'uz' : currentLocale]
                  }
                  fill
                />
              </AspectRatio>
            </CustomSlide>
          )
        })}
      </Splide>
    </Box>
  )
}

function CustomSlide({
  url,
  children,
}: {
  url?: string
  children: React.ReactNode
}) {
  if (url) {
    return (
      <SplideSlide>
        <a
          href={url}
          target={
            url.includes(process.env.NEXT_PUBLIC_DOMAIN as string)
              ? '_self'
              : '_blank'
          }
          rel='noreferrer'
          // style={{ backgroundColor: 'transparent' }}
        >
          {children}
        </a>
      </SplideSlide>
    )
  }
  return <SplideSlide>{children}</SplideSlide>
}

export default CarouselBanner
