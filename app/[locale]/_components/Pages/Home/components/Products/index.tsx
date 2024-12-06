import React from 'react'

import { Center, SimpleGrid, Text } from '@chakra-ui/react'
import { ICategory, IProduct } from '@/_types'
import Image from 'next/image'
import ProductCard from '@/_components/Card'

interface IProps {
  data: any
  category?: ICategory
}

function Products({ data, category }: IProps) {
  return (
    <>
      {data?.length > 0 ? (
        <SimpleGrid
          mt={5}
          spacing={{ base: 2, lg: 4 }}
          columns={{ base: 2, md: 3, lg: 4 }}
          justifyContent={data?.length > 0 ? 'flex-start' : 'center'}
        >
          {data?.map((product: IProduct, idx: number) => (
            <ProductCard index={idx} h1='' product={product} key={product.id} />
          ))}
        </SimpleGrid>
      ) : (
        !category?.child_categories?.length && (
          <Center flexDir='column' textAlign='center' gap={2} minH='60vh'>
            <Text fontSize='2xl' fontWeight={700}>
              Ничего не найдено
            </Text>
            <Text fontWeight={500} fontSize='sm' color='gray.800'>
              По примененному фильтру товары не <br /> найдены. Повторите
              попытку.
            </Text>
          </Center>
        )
      )}
      {/* {category?.child_categories?.map((item: IChildCategory) => (
        <Box key={item.id} pt={6} as='section'>
          <h2>{item.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}</h2>
          <SimpleGrid
            spacing={{ base: 2, lg: 4 }}
            columns={{ base: 2, md: 3, lg: 4 }}
          >
            {item?.products &&
              item?.products?.map((product: IProduct) => (
                <Card product={product} key={product.id} />
              ))}
          </SimpleGrid>
        </Box>
      ))} */}
    </>
  )
}

export default Products
