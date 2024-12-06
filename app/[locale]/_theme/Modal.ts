import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  dialog: {
    borderRadius: '16px',
    bgColor: 'white',
    _dark: {
      bgColor: 'paper.dark.500',
    },
  },
})

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
})
