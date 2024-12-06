import { Checkbox } from '@chakra-ui/react'

interface IRadioCard {
  value: any
  children: React.ReactNode
}

function Tag({ value, children }: IRadioCard) {
  return (
    <Checkbox
      p={2}
      pl={0}
      // fontSize={'24px'}
      size='md'
      rounded='xl'
      value={value}
      bg='#fff'
      _hover={{
        bg: 'paper.light.300',
      }}
      fontWeight={500}
      colorScheme='primary'
      flexDirection='row-reverse'
    >
      {children}
    </Checkbox>
  )
}

export default Tag
