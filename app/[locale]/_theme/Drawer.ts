import { drawerAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  dialog: {
    backgroundColor: 'white',
    _dark: {
      backgroundColor: 'paper.dark.500',
    },
  },
})

export const drawerTheme = defineMultiStyleConfig({
  baseStyle,
})
