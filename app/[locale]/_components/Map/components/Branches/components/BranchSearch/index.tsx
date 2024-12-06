import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'

interface IProps {
  value: string
  placeholder: string
  onChange: (e: any) => void
}

function BranchSearch({ placeholder = '', value, onChange, ...props }: IProps) {
  return (
    <Box position='relative'>
      <InputGroup display={'flex'}>
        <InputLeftElement pointerEvents='none' height='100%' fontSize={24}>
          <Icon icon='material-symbols:search-rounded' color='#A5A5A5' />
        </InputLeftElement>
        <Input
          // _focus={{
          //   outline: '#AA2400',
          //   borderColor: '#AA2400',
          //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
          // }}
          // _active={{
          //   outline: '#AA2400',
          //   borderColor: '#AA2400',
          //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
          // }}
          // boxShadow={'0px 1px 2px 0px #1018280D'}
          border={'1px solid #D0D5DD'}
          name='search-branch'
          variant='outline'
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete='off'
          autoCorrect='off'
          {...props}
        />
      </InputGroup>
    </Box>
  )
}

export default BranchSearch
