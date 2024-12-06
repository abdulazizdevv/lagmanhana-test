import React from 'react'

import Card from '@/_components/Card'
import { SimpleGrid, Text, CircularProgress, Box } from '@chakra-ui/react'
import { IChildCategory, IProduct } from '@/_types'
import { useCurrentLocale } from '@/_locales/client'

interface IProps {
  data: any
  h1: any
}

function Products({ data, h1 }: IProps) {
  const currentLocale = useCurrentLocale()

  return (
    <>
      <SimpleGrid
        mt={5}
        spacing={{ base: 2, lg: 4 }}
        columns={{ base: 2, md: 3, lg: 4 }}
        justifyContent={data?.length > 0 ? 'flex-start' : 'center'}
      >
        {data?.length > 0
          ? data?.map((product: IProduct, idx: number) => (
              <Card
                h1={h1}
                index={idx + 1}
                product={product}
                key={product.id}
              />
            ))
          : !data?.child_categories?.length && (
              <Text textAlign='center' pt={10}>
                no products
              </Text>
            )}
      </SimpleGrid>
      {data?.child_categories?.map((item: IChildCategory) => (
        <Box key={item.id} pt={6} as='section'>
          <h2>{item.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}</h2>
          <SimpleGrid
            spacing={{ base: 2, lg: 4 }}
            columns={{ base: 2, md: 3, lg: 4 }}
          >
            {item?.products &&
              item?.products?.map((product: IProduct, idx: number) => (
                <Card
                  h1={h1}
                  index={idx + 1}
                  product={product}
                  key={product.id}
                />
              ))}
          </SimpleGrid>
        </Box>
      ))}
    </>
  )
}

export default Products
