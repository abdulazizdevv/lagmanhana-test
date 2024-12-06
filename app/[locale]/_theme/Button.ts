import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const primary = defineStyle({
  fontSize: '14px',
  bgColor: 'primary.400',
  color: 'paper.dark.800',
  _dark: {
    color: 'black',
  },
  _active: {
    bgColor: `primary.800`,
  },
  _disabled: {
    bgColor: `primary.700`,
    color: 'paper.dark.800',
  },
  _hover: {
    bgColor: `primary.500`,
    _disabled: {
      bgColor: `primary.700`,
    },
  },
})

export const Button = defineStyleConfig({
  baseStyle: {
    fontSize: '14px',
    borderRadius: '8px',
  },
  variants: {
    primary,
    solid: {
      _light: {
        bgColor: 'paper.light.400',
        _hover: { bgColor: '#E4E4E4' },
        _active: { bgColor: '#DDDDDD' },
        _disabled: { opacity: 0.4 },
      },
      fontSize: '14px',
    },
    ghost: { fontSize: '14px' },
  },
})
