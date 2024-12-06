'use client'

import React, { useRef } from 'react'

import { Box } from '@chakra-ui/react'
import '@splidejs/react-splide/css'

import img1 from '@/_assets/about_img_1.png'
import img2 from '@/_assets/about_img_2.png'
import img3 from '@/_assets/about_img_3.png'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import Image from 'next/image'

function Carousel() {
  const images = [
    {
      image: img1,
    },
    {
      image: img2,
    },
    {
      image: img3,
    },
  ]
  const splideRef = useRef<any>(null)

  return (
    <Box mt={10}>
      <Splide
        ref={splideRef}
        options={{
          arrows: false,
          type: 'loop',
          perPage: 3,
          focus: 'center',
          pagination: false,
          breakpoints: {
            600: {
              perPage: 1,
              padding: '2.5rem',
            },
          },
        }}
      >
        {images?.map((item, idx) => (
          <SplideSlide key={idx}>
            <Box
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
              }}
              height={{ base: '316px', md: '400px' }}
              mx={{ base: 2, md: 4 }}
            >
              <Image
                src={item?.image}
                priority={true}
                alt={'About' + ` - photo ${idx + 1}`}
                style={{ objectFit: 'cover' }}
                fill
              />
            </Box>
          </SplideSlide>
        ))}
      </Splide>
    </Box>
  )
}

export default Carousel
