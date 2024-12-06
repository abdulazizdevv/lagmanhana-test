import { Splide, SplideSlide } from '@splidejs/react-splide'
import { Options } from '@splidejs/splide'
import React, { useEffect, useRef } from 'react'
import './styles.scss'
import { Box } from '@chakra-ui/react'
import Image from 'next/image'

interface IProps {
  list: {
    active: true
    title: { uz: string; ru: string; en: string }
    image: any
  }[]
  aspectRatio?: string
  options?: object
  h1?: any
  children?: React.ReactNode
}

const Slider: React.FC<IProps> = ({ list, h1 }) => {
  const mainRef = useRef<Splide>(null)
  const thumbsRef = useRef<Splide>(null)

  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide)
    }
  }, [])

  const renderSlides = (): React.ReactNode[] => {
    return list?.map((slide) => (
      <SplideSlide key={slide.title?.ru} style={{ border: 'none' }}>
        <Box
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'grid',
            placeItems: 'center',
          }}
          overflow='hidden'
          rounded='lg'
        >
          <Image
            src={
              slide?.image?.includes(process.env.BASE_URL)
                ? slide?.image
                : process.env.BASE_URL + slide?.image
            }
            priority={true}
            style={{ objectFit: 'cover' }}
            alt={h1 + ` - photo 1`}
            fill
          />
        </Box>
      </SplideSlide>
    ))
  }

  const mainOptions: Options = {
    type: 'loop',
    perPage: 1,
    perMove: 1,
    gap: '1rem',
    pagination: false,
    arrows: true,
    height: '60vw',
    breakpoints: {
      768: {
        arrows: false,
        aspectRatio: '3 / 2',
      },
    },
  }

  const thumbsOptions: Options = {
    type: 'slide',
    rewind: true,
    gap: '1rem',
    pagination: false,
    fixedWidth: 144,
    fixedHeight: 88,
    cover: true,
    focus: 'center',
    isNavigation: true,
    arrows: false,
    breakpoints: {
      768: {
        arrows: false,
      },
    },
  }

  return (
    <>
      <Splide
        options={mainOptions}
        ref={mainRef}
        aria-labelledby='thumbnail-slider-example'
      >
        {renderSlides()}
      </Splide>

      <Splide
        options={thumbsOptions}
        ref={thumbsRef}
        aria-label='The carousel with thumbnails. Selecting a thumbnail will change the main carousel'
      >
        {renderSlides()}
      </Splide>
    </>
  )
}

export default Slider
