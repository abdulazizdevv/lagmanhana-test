import { Radio, RadioProps } from '@chakra-ui/react'

interface IRadioCard extends RadioProps {
  value: any
  onchangeSorted: any
}

function SortedRadio({ value, onchangeSorted, ...props }: IRadioCard) {
  return (
    <Radio
      fontSize={'20px'}
      value={value?.id}
      bg='#fff'
      fontWeight={500}
      colorScheme='primary'
      flexDirection='row-reverse'
      justifyContent={'space-between'}
      onChange={() => onchangeSorted(value?.id, value)}
      {...props}
    />
  )
}

export default SortedRadio
