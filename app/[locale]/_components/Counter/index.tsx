import { HStack, Button, IconButton } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'

interface ICounter {
  variable: number
  bg?: string
  color?: string
  onIncrease: () => void
  onDecrease: () => void
  min?: number
  size?: string
  max?: number
  height?: any
  rounded?: any
  width?: number | { [key: string]: string | number }
  unstyled?: boolean
  className?: any
  padding?: any
  isDisabled?: boolean
}

export default function Counter({
  min,
  size = 'md',
  max,
  width,
  height,
  color,
  bg,
  variable,
  onIncrease,
  onDecrease,
  className,
  isDisabled,
  padding,
  rounded,
}: ICounter) {
  const hoverStylesPlus = bg
    ? {
        bg: 'linear-gradient(270deg, #bbb 0%, rgba(211, 181, 246, 0) 100%)',
        color: '#000',
      }
    : {}
  const hoverStylesMinus = bg
    ? {
        bg: 'linear-gradient(270deg, rgba(211, 181, 246, 0) 0%, #bbb 100%)',
        color: '#000',
      }
    : {}
  return (
    <HStack
      gap={0}
      borderRadius={rounded ? rounded : '8px'}
      className={className}
      bg={bg ? bg : 'paper.light.500'}
      // _dark={{ bg: 'paper.dark.400' }}
      h={height ? height : 'fit-content'}
      width={width}
      display={'flex'}
      justifyContent={'space-between'}
    >
      <IconButton
        aria-label='minus-product'
        onClick={onDecrease}
        isDisabled={min === variable || isDisabled}
        size={size}
        // flex={0.5}
        borderRadius={rounded ? rounded : '8px'}
        px={padding}
        textAlign={'left'}
        variant={bg ? 'primary' : 'ghost'}
        bg={bg ? bg : 'paper.light.500'}
        color={color ? color : 'paper.dark.800'}
        _hover={hoverStylesMinus}
        // borderRightRadius={0}
        icon={<Icon icon='hugeicons:minus-sign' />}
      />
      <Button color={color ? color : ''} size={size} variant='unstyled'>
        {variable}
      </Button>
      <IconButton
        aria-label='plus-product'
        onClick={onIncrease}
        isDisabled={max === variable || isDisabled}
        size={size}
        px={padding}
        textAlign={'right'}
        borderRadius={rounded ? rounded : '8px'}
        variant={bg ? 'primary' : 'ghost'}
        bg={bg ? bg : 'paper.light.500'}
        color={color ? color : 'paper.dark.800'}
        _hover={hoverStylesPlus}
        icon={<Icon icon='hugeicons:plus-sign' />}
      />
    </HStack>
  )
}
