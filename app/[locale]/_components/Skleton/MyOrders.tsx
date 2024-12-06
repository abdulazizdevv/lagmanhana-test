import React from 'react'
import {
  Box,
  Card,
  CardBody,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react'

function SkeletonSingleCard() {
  return (
    <Card maxW='sm' overflow='hidden' borderRadius='2xl'>
      <Box p={2}>
        <Box position='relative'>
          <Skeleton maxH='260px' aspectRatio='3 / 2' rounded={'lg'} />

          <Flex
            position={'absolute'}
            bg={'#fff'}
            borderRadius={'8px 8px 0px 0px'}
            py={'7px'}
            px={'12px'}
            left={'25px'}
            bottom={0}
            gap={1}
          >
            <SkeletonCircle size='5' />
            <Skeleton w={'23px'} h='14px' rounded={'20px'} />
          </Flex>
        </Box>
        {/* Added rounded here */}
        <CardBody
          rounded={'lg'}
          px={{ base: 2, md: 4 }}
          pt={{ base: 2, md: 3 }}
        >
          <Box>
            <Flex mb={'6px'} justifyContent={'space-between'}>
              <Skeleton h={'17px'} w={'50%'} rounded={'lg'} />{' '}
              <SkeletonCircle size='5' />
            </Flex>
            <Flex gap={1}>
              <SkeletonCircle size='5' />
              <SkeletonCircle size='5' />
              <SkeletonCircle size='5' />
            </Flex>
            <Box mt={2}>
              <Skeleton w={'100%'} h='10px' mt={2} rounded={'15px'} />
              <Skeleton w={'100%'} h='10px' mt={2} rounded={'15px'} />
              <Skeleton w={'100%'} h='10px' mt={2} rounded={'15px'} />
              <Skeleton w={'100%'} h='10px' mt={2} rounded={'15px'} />
            </Box>
          </Box>
        </CardBody>
      </Box>
    </Card>
  )
}

export default SkeletonSingleCard
