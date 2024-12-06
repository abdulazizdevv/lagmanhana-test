import { IProduct } from '@/_types'
import { Flex, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import React from 'react'

function Rating({ data }: { data: IProduct }) {
  return (
    +data?.rating?.toFixed(1) > 0 && (
      <Flex
        px={3}
        py={2}
        gap={1}
        left={4}
        bottom={0}
        zIndex={2}
        align='center'
        bgColor='white'
        position='absolute'
        borderTopRadius='lg'
      >
        <Icon icon='ic:round-star' color='#EB5A26' fontSize='18px' />
        <Text fontWeight={500} color='#EB5A26'>
          {data?.rating?.toFixed(1)}
        </Text>
      </Flex>
    )
  )
}

export default Rating
