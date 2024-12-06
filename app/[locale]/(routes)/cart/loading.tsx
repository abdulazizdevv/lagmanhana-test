import Loading from '@/_components/Loading'
import SkeletonCart from '@/_components/Skleton/CartSkeleton'
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
        <Skeleton height='52px' width='100%' mb={6} />
        <Container>
          <Flex justifyContent='space-between' mt={5} mb={6}>
            <Skeleton height='12px' width='53px' borderRadius={17} />
            <Skeleton height='12px' width='53px' borderRadius={17} />
          </Flex>
          <SkeletonCart />
        </Container>
      </Box>
    </>
  )
}

export default loading
