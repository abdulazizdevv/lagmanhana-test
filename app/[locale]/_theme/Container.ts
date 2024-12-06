import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

export const Container = defineStyleConfig({
  baseStyle: {
    maxW: '1200px',
  },
  sizes: {
    // sm: defineStyle({
    //   maxW: '45ch',
    // }),
    // md: defineStyle({
    //   maxW: 'container.sm',
    // }),
    // lg: defineStyle({
    //   maxW: '75ch',
    // }),
    xl: defineStyle({
      maxW: '1200px',
    }),
  },
})
