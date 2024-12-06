import { Box, Divider, Flex, Text, useRadio } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

interface IRadioCard {
  name: string
  value: any
  isChecked?: boolean
  onChange: (value: any) => void
  children: React.ReactNode
}

function CRadio({ name, value, isChecked, onChange, children }: IRadioCard) {
  const handleClick = () => {
    onChange(value)
  }

  return (
    <Box as='label' onClick={handleClick}>
      <Flex
        align='center'
        justify='space-between'
        fontSize={'16px'}
        cursor='pointer'
        transition='150ms ease-in-out'
        _checked={{
          bg: 'paper.light.300',
        }}
        _hover={{
          bg: 'paper.light.300',
        }}
        gap={0}
        borderRadius={'8px'}
        color={isChecked ? '#AA2400' : '#1E1F2E'}
        px={'8px'}
        py={{ base: 1, md: 2 }}
      >
        {children}
        {isChecked ? (
          <Text fontSize={{ base: '20px', md: '20px' }} color='#AA2400'>
            <Icon
              icon='fluent:radio-button-16-filled'
              color='inherit'
              fontSize={'20px'}
            />
          </Text>
        ) : (
          <Box
            width={{ base: '15px', md: '20px' }}
            h={{ base: '15px', md: '20px' }}
            bg='white'
            _dark={{ bg: '#202020' }}
            border={'1px solid #D0D5DD'}
            borderRadius={'50%'}
          />
        )}
      </Flex>
    </Box>
  )
}

export default CRadio
