'use client'
import { Box, useColorModeValue, useMediaQuery } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import React, { useState, useEffect } from 'react'

function UpBtn() {
  const [moreScrollDown, setMoreScrollDown] = useState(false)
  const [lg] = useMediaQuery('(max-width: 991px)')

  useEffect(() => {
    const handleScrollDown = () => {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop
      if (scrollPosition > 800) {
        setMoreScrollDown(true)
      } else {
        setMoreScrollDown(false)
      }
    }

    window.addEventListener('scroll', handleScrollDown)
    return () => {
      window.removeEventListener('scroll', handleScrollDown)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const bgColor = useColorModeValue('white', 'paper.dark.500')
  const hoverBgColor = useColorModeValue('paper.light.400', 'paper.dark.400')

  return (
    <Box
      position='fixed'
      bottom={lg ? '80px' : '20px'}
      right='20px'
      onClick={scrollToTop}
      cursor='pointer'
      bg='gray.800'
      p={3}
      borderRadius='full'
      boxShadow='md'
      zIndex={1000}
      bgColor={bgColor}
      _hover={{ backgroundColor: hoverBgColor }}
      style={{
        opacity: moreScrollDown ? 1 : 0,
        transform: moreScrollDown ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      <Icon icon='flowbite:angle-top-solid' width='1.2em' height='1.2em' />
    </Box>
  )
}

export default UpBtn
