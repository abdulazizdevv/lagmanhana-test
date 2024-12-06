import {
  Button,
  Container,
  HStack,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react'
import React from 'react'
import SkletonCard from './_components/Skleton/Card'

function loading() {
  return (
    <div>
      <Skeleton
        aspectRatio={{ base: '4 / 2', md: '1600 / 453' }}
        height='auto'
        width='auto'
      />
      <Container>
        <HStack
          style={{
            marginTop: '24px',
            marginBottom: '24px',
            padding: '8px',
          }}
        >
          <Button borderRadius={'26px'}>
            <Skeleton height='14px' width='38px' borderRadius={6} />
          </Button>
          <Button variant='ghost'>
            <Skeleton height='14px' width='38px' borderRadius={6} />
          </Button>
          <Button variant='ghost'>
            <Skeleton height='14px' width='38px' borderRadius={6} />
          </Button>
          <Button variant='ghost'>
            <Skeleton height='14px' width='38px' borderRadius={6} />
          </Button>
          <Button variant='ghost'>
            <Skeleton height='14px' width='38px' borderRadius={6} />
          </Button>
          <Button variant='ghost'>
            <Skeleton height='14px' width='38px' borderRadius={6} />
          </Button>
        </HStack>
        <Skeleton height='24px' width='120px' borderRadius={4} mb={6} />
        <SimpleGrid
          spacing={{ base: 2, lg: 4 }}
          columns={{ base: 2, md: 3, lg: 4 }}
        >
          <SkletonCard />
          <SkletonCard />
          <SkletonCard />
          <SkletonCard />
        </SimpleGrid>
      </Container>
    </div>
  )
}

export default loading
