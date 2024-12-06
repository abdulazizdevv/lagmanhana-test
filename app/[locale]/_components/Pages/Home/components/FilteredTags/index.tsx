import Card from '@/_components/Card'
import { useI18n } from '@/_locales/client'
import { IProduct } from '@/_types'
import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'

const FilteredTags = ({
  products,
  index,
}: {
  products: any
  index: number
}) => {
  const t = useI18n()
  return (
    <Box mt={5}>
      <Card h1={t('seo.h1_main')} index={index} product={products} />
    </Box>
  )
}

export default FilteredTags
