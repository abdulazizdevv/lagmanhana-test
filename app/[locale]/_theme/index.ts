/* theme.ts */
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { Button } from './Button'
import { Container } from './Container'
import { FormLabel } from './FormControl'
import { mode } from '@chakra-ui/theme-tools'
import { modalTheme } from './Modal'
import { cardTheme } from './Card'
import { menuTheme } from './Menu'
import { popoverTheme } from './Popover'
import { drawerTheme } from './Drawer'
import { IconButton } from './IconButton'
import { checkboxTheme } from './Checkbox'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  components: {
    Checkbox: checkboxTheme,
    Card: cardTheme,
    Button,
    IconButton,
    Container,
    FormLabel,
    Modal: modalTheme,
    Menu: menuTheme,
    Popover: popoverTheme,
    Drawer: drawerTheme,
  },
  colors: {
    paper: {
      light: {
        50: '#FFF',
        100: '#F5F6FA',
        200: '#F2F4F7',
        300: '#F2F3F7',
        400: '#EEEEEE',
        500: '#F5F6FA',
        800: '#1A1A1A',
      },
      dark: {
        100: '#7676803D',
        200: '#636366',
        300: '#454545',
        400: '#333333',
        500: '#292929',
        800: '#222222',
        900: '#101828',
      },
    },
    primary: {
      100: '#F87A1D',
      200: '#F87A1D',
      300: '#F87A1D',
      400: '#F87A1D',
      500: '#F87A1D',
      600: '#F87A1D',
      700: '#fc9d56',
      800: '#fc9d56',
      900: '#8667AE',
    },
    secondary: {
      50: '#FFD300',
      100: '#FFD300',
      200: '#FFD300',
      300: '#FFD300',
      400: '#FFD300',
      500: '#FFD300',
      600: '#FFD300',
      700: '#FFD300',
      800: '#FFD300',
      900: '#000',
    },
    brand: {
      400: '#F87A1D',
      500: '#FFD301',
    },
    gray: {
      // 200: '#98A2B3',
      300: '#EAECF0',
      400: '#A5A5A5',
      500: '#667085',
      600: '#475467',
      700: '#344054',
    },
    error: '#EC5962',
    success: '#3FD75B',
  },
  styles: {
    global: (props: any) => ({
      body: {
        fontFamily: 'body',
        color: mode('gray.800', 'whiteAlpha.900')(props),
        // bg: mode('paper.light.200', 'paper.dark.800')(props),
        lineHeight: 'base',
      },
      '*::placeholder': {
        color: mode('#A5A5A5', 'whiteAlpha.400')(props),
      },
      '*, *::before, &::after': {
        borderColor: mode('gray.200', 'whiteAlpha.300')(props),
        wordWrap: 'break-word',
      },
    }),
  },
  config,
})
