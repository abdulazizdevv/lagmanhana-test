import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseStyle = definePartsStyle({
  container: {
    backgroundColor: 'white',
    boxShadow: '0px 0px 12px 0px #0000000D',
    _dark: {
      backgroundColor: 'paper.dark.500',
    },
  },
})

export const cardTheme = defineMultiStyleConfig({ baseStyle })
