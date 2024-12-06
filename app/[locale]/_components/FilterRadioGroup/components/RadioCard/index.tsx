import { Box, Flex, Text, useRadio } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

interface IRadioCard {
  name: string
  value: any
  isChecked?: boolean
  unstyled?: boolean
  onChange: (value: any) => void
  children: React.ReactNode
}

function RadioCard({
  unstyled,
  name,
  value,
  isChecked,
  onChange,
  children,
}: IRadioCard) {
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
          bg: unstyled ? '' : 'paper.light.300',
        }}
        _hover={{
          bg: 'paper.light.300',
        }}
        gap={0}
        borderRadius={'8px'}
        px={'8px'}
        py={{ base: 1.5, md: 2 }}
      >
        {children}
        {isChecked ? (
          <Text fontSize={'20px'} color='primary.400'>
            {name !== 'tags' ? (
              <Icon
                icon='material-symbols:check-circle-rounded'
                color='inherit'
                fontSize='inherit'
              />
            ) : (
              <Icon icon='ph:check-square-fill' width='1.2em' height='1.2em' />
            )}
          </Text>
        ) : (
          <Box
            width={'20px'}
            h={'20px'}
            bg='white'
            _dark={{ bg: '#202020' }}
            border={'1px solid #D0D5DD'}
            borderRadius={name === 'tags' ? '4px' : '50%'}
          ></Box>
        )}
      </Flex>
    </Box>
  )
}

export default RadioCard
