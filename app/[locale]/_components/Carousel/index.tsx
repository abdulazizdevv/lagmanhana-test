'use client'

import Image from 'next/image'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

import styles from './style.module.scss'
import { useCurrentLocale, useI18n } from '@/_locales/client'

interface ICarousel {
  h1: string
  list: any[]
  aspectRatio?: string
  options?: object
  children?: React.ReactNode
}

function Carousel({ list, h1, aspectRatio = '3 / 1', options }: ICarousel) {
  const t = useI18n()
  const currentLocale = useCurrentLocale()

  const defaultOptions = {
    perPage: 1,
    classes: {
      prev: styles.slidePrevBtn,
      next: styles.slideNextBtn,
    },
  }

  return (
    <Splide
      className={styles.slider}
      options={{
        ...defaultOptions,
        type: 'loop',
        cover: true,
        autoplay: true,
        arrows: list?.length > 1,
        autoHeight: true,
        lazyLoad: 'sequential',
        classes: {
          arrows: styles.bannerArrows,
          prev: styles.slidePrevBtn,
          next: styles.slideNextBtn,
        },
        breakpoints: {
          992: {
            arrows: false,
          },
        },
        ...options,
      }}
    >
      {list?.map((item, idx) => (
        <CustomSlide url={item.url} key={item?.id}>
          <div
            style={{
              position: 'relative',
              width: 'auto',
              height: 'auto',
              aspectRatio: aspectRatio,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Image
              src={
                item?.image?.includes(process.env.BASE_URL)
                  ? item?.image
                  : process.env.BASE_URL + item?.image
              }
              priority={true}
              style={{ objectFit: 'cover' }}
              alt={h1 + ` - photo ${idx}`}
              sizes='(max-width: 768px) 100vw, 
              (min-width: 768px) and (max-width: 1200px) 50vw, 
              33vw'
              fill
            />
          </div>
        </CustomSlide>
      ))}
    </Splide>
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
        >
          {children}
        </a>
      </SplideSlide>
    )
  }
  return <SplideSlide>{children}</SplideSlide>
}

export default Carousel
