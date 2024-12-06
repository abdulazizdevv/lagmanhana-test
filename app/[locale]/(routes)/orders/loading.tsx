import Loading from '@/_components/Loading'
import SkeletonMyOrders from '@/_components/Skleton/SkeletonMyOrders'
import { Box, Container, Flex, Skeleton } from '@chakra-ui/react'
import React from 'react'

function loading() {
  return (
    <>
      {/* Desktop View */}
      <Box
        display={{ base: 'none', md: 'flex' }}
        flex={1}
        justifyContent='center'
      >
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
          gap='20px'
          height='100vh'
        >
          <Loading />
        </Flex>
      </Box>

      {/* Mobile View */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Container>
          <Flex my={4} gap={'10px'}>
            <Skeleton height='12px' width='47px' rounded={'17px'} />
            <Skeleton height='11px' width='6px' />
            <Skeleton height='12px' width='73px' rounded={'17px'} />
            <Skeleton height='11px' width='6px' />
            <Skeleton height='12px' width='85px' rounded={'17px'} />
          </Flex>
          <Flex justifyContent='space-between' mt={5} mb={6}>
            <Skeleton height='12px' width='53px' borderRadius={17} />
            <Skeleton height='12px' width='53px' borderRadius={17} />
          </Flex>
          <SkeletonMyOrders />
        </Container>
      </Box>
    </>
  )
}

export default loading
