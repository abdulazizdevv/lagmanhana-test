import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  label: {
    width: '100%', // change the font family of the label
  },
  control: {
    _checked: {
      _hover: {
        bgColor: 'primary.400',
        borderColor: 'primary.400',
      },
    },
  },
})

export const checkboxTheme = defineMultiStyleConfig({ baseStyle })
