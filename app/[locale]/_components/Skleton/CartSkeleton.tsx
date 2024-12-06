import React from 'react'
import { Card, Flex, Skeleton, SkeletonCircle } from '@chakra-ui/react'

function SkeletonCart() {
  return (
    <>
      <Card maxW='sm' overflow='hidden' borderRadius='2xl'>
        <Flex p={2} justifyContent={'space-between'}>
          <Flex gap={1}>
            <Skeleton h='48px' width={'48px'} rounded={'lg'} />
            <Flex flexDir={'column'} gap={'5px'}>
              <Skeleton height='20px' width={'117px'} rounded={'20px'} />
              <Skeleton height='10px' width={'111px'} rounded={'20px'} />
              <Skeleton height='10px' width={'141px'} rounded={'20px'} />
              <Skeleton height='10px' width={'169px'} rounded={'20px'} />
              <Skeleton height='10px' width={'136px'} rounded={'20px'} />
              <Skeleton height='10px' width={'111px'} rounded={'20px'} />
              <Skeleton height='10px' width={'74px'} rounded={'20px'} />
            </Flex>
          </Flex>
          <Flex
            alignItems={'center'}
            justifyContent={'space-around'}
            borderRadius={'8px'}
            w={'98px'}
            height={'36px'}
            bg={'#F5F6FA'}
          >
            <Skeleton h='2px' width={'10px'} rounded={'lg'} />
            <Skeleton h='12px' width={'4px'} rounded={'lg'} />
            <SkeletonCircle size={'10px'} />
          </Flex>
        </Flex>
        <Flex p={2} justifyContent={'space-between'}>
          <Flex gap={1}>
            <Skeleton h='48px' width={'48px'} rounded={'lg'} />
            <Flex flexDir={'column'} gap={'5px'}>
              <Skeleton height='20px' width={'117px'} rounded={'20px'} />
              <Skeleton height='10px' width={'111px'} rounded={'20px'} />
              <Skeleton height='10px' width={'141px'} rounded={'20px'} />
              <Skeleton height='10px' width={'169px'} rounded={'20px'} />
              <Skeleton height='10px' width={'136px'} rounded={'20px'} />
              <Skeleton height='10px' width={'111px'} rounded={'20px'} />
              <Skeleton height='10px' width={'74px'} rounded={'20px'} />
            </Flex>
          </Flex>
          <Flex
            alignItems={'center'}
            justifyContent={'space-around'}
            borderRadius={'8px'}
            w={'98px'}
            height={'36px'}
            bg={'#F5F6FA'}
          >
            <Skeleton h='2px' width={'10px'} rounded={'lg'} />
            <Skeleton h='12px' width={'4px'} rounded={'lg'} />
            <SkeletonCircle size={'10px'} />
          </Flex>
        </Flex>
        <Flex p={2} justifyContent={'space-between'}>
          <Flex gap={1}>
            <Skeleton h='48px' width={'48px'} rounded={'lg'} />
            <Flex flexDir={'column'} gap={'5px'}>
              <Skeleton height='20px' width={'117px'} rounded={'20px'} />
              <Skeleton height='10px' width={'111px'} rounded={'20px'} />
              <Skeleton height='10px' width={'141px'} rounded={'20px'} />
              <Skeleton height='10px' width={'169px'} rounded={'20px'} />
              <Skeleton height='10px' width={'136px'} rounded={'20px'} />
              <Skeleton height='10px' width={'111px'} rounded={'20px'} />
              <Skeleton height='10px' width={'74px'} rounded={'20px'} />
            </Flex>
          </Flex>
          <Flex
            alignItems={'center'}
            justifyContent={'space-around'}
            borderRadius={'8px'}
            w={'98px'}
            height={'36px'}
            bg={'#F5F6FA'}
          >
            <Skeleton h='2px' width={'10px'} rounded={'lg'} />
            <Skeleton h='12px' width={'4px'} rounded={'lg'} />
            <SkeletonCircle size={'10px'} />
          </Flex>
        </Flex>
      </Card>
      <Card mt={4} maxW='sm' overflow='hidden' borderRadius='16'>
        <Flex p={3} justifyContent={'space-between'} alignItems={'end'}>
          <Flex flexDir={'column'} gap={'14px'}>
            <Skeleton h='15px' width={'50px'} rounded={'22px'} />
            <Skeleton h='14px' width={'28px'} rounded={'22px'} />
            <Skeleton h='14px' width={'37px'} rounded={'22px'} />
            <Skeleton h='14px' width={'43px'} rounded={'22px'} />
          </Flex>
          <Flex
            flexDir={'column'}
            justifyContent={'end'}
            alignItems={'end'}
            gap={'14px'}
          >
            <Skeleton h='14px' width={'70px'} rounded={'22px'} />
            <Skeleton h='14px' width={'75px'} rounded={'22px'} />
            <Skeleton h='14px' width={'43px'} rounded={'22px'} />
          </Flex>
        </Flex>
      </Card>
    </>
  )
}

export default SkeletonCart
