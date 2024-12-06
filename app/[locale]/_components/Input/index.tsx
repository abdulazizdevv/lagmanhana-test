import React from 'react'
import { Input } from '@chakra-ui/react'

interface EmailInputProps {
  value: string
  type?: string
  placeholder?: string
  onChange: (value: string) => void
}

const InputComponent: React.FC<EmailInputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder,
}) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      // _focus={{
      //   outline: '#7E5FA6',
      //   borderColor: '#7E5FA6',
      //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
      // }}
      // _active={{
      //   outline: '#7E5FA6',
      //   borderColor: '#7E5FA6',
      //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
      // }}
      boxShadow='0px 1px 2px 0px #1018280D'
      border='1px solid #D0D5DD'
    />
  )
}

export default InputComponent
