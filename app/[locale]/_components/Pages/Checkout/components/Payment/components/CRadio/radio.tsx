import { fonts } from '@/fonts'
import { Box, Flex, Text, useColorModeValue, useRadio } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function RadioCard({ unstyled, name, ...props }: any) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()
  const bgColor = useColorModeValue('paper.light.300', 'paper.dark.200')
  const specialNames: string[] = ['filters', 'tags']

  return (
    <Box as='label'>
      <input {...input} />
      <Flex
        {...checkbox}
        align='center'
        justify='space-between'
        fontSize={
          specialNames.includes(name) ? '16px' : { base: 'sm', md: 'md' }
        }
        cursor='pointer'
        transition='150ms ease-in-out'
        borderRadius={{ base: '6px', md: '8px' }}
        gap={2}
        py={2}
      >
        {props.children}

        {input?.checked ? (
          <Text fontSize={{ base: '20px', md: '20px' }} color='primary.400'>
            <Icon color='#000' icon='radix-icons:radiobutton' />
          </Text>
        ) : (
          <Box
            width={{ base: '20px', md: '20px' }}
            h={{ base: '20px', md: '20px' }}
            bg='white'
            _dark={{ bg: '#202020' }}
            border={'1px solid #D0D5DD'}
            // boxShadow='0px 2px 8px 0px #0000001F inset'
            borderRadius={name === 'tags' ? '4px' : '50%'}
          ></Box>
        )}
      </Flex>
    </Box>
  )
}

export default RadioCard
