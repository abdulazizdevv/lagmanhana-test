import RadioIcon from '@/_assets/icons/RadioIcon'
import { Box, Flex, Text, useColorModeValue, useRadio } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function RadioCard({ unstyled, name, ...props }: any) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()
  const specialNames: string[] = ['filters', 'tags', 'address']

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
        // _checked={{
        //   bg: unstyled ? '' : 'paper.light.300',
        // }}
        bg={'paper.light.300'}
        borderRadius={
          specialNames.includes(name) ? '12px' : { base: '6px', md: '8px' }
        }
        px={specialNames.includes(name) ? '8px' : { base: 1, md: 2 }}
        py={{ base: 4, md: 4 }}
        gap={2}
      >
        {props.children}

        {input?.checked ? (
          <Text fontSize={{ base: '20px', md: '24px' }} color='brand'>
            {name !== specialNames.includes(name) ? (
              // <Icon
              //   icon='material-symbols:check-circle-rounded'
              //   color='inherit'
              //   fontSize='inherit'
              //   />
              <RadioIcon
                width={{ base: '20px', md: '24px' }}
                height={{ base: '20px', md: '24px' }}
              />
            ) : (
              <Icon icon='ph:check-square-fill' width='1.2em' height='1.2em' />
            )}
          </Text>
        ) : (
          <Box
            width={{ base: '20px', md: '24px' }}
            h={{ base: '20px', md: '24px' }}
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
