import React from 'react'
import { Card, CardBody, Skeleton, SkeletonText } from '@chakra-ui/react'

function SkletonCard() {
  return (
    <Card maxW="sm" overflow="hidden" borderRadius="2xl">
      <Skeleton maxH="260px" aspectRatio="3 / 2" />
      <CardBody px={{ base: 2, md: 4 }} pt={{ base: 2, md: 3 }}>
        <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      </CardBody>
    </Card>
  )
}

export default SkletonCard
