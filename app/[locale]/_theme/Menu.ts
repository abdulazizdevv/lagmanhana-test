import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  list: {
    // this will style the MenuList component
    borderRadius: '2xl',
    border:
      '1px solid linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04)), linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))',
    bgColor: 'white',
    _dark: {
      bgColor: 'paper.dark.500',
    },
  },
  item: {
    // this will style the MenuItem and MenuItemOption components
    bgColor: 'white',
    _dark: {
      bgColor: 'paper.dark.500',
    },
    _hover: {
      bgColor: 'paper.light.400',
      _dark: {
        bgColor: 'paper.dark.400',
      },
    },
    _focus: {
      bgColor: 'paper.light.400',
      _dark: {
        bgColor: 'paper.dark.400',
      },
    },
  },
})
// export the base styles in the component theme
export const menuTheme = defineMultiStyleConfig({ baseStyle })
