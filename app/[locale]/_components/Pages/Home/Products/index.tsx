// import Card from '@/_components/Card'
import { SimpleGrid, Text, Box, Center } from '@chakra-ui/react'
import ProductCard from '@/_components/Card'
import { useCurrentLocale } from '@/_locales/client'

interface IProps {
  products: any[]
  categories: any[]
}

function Products({ products, categories }: IProps) {
  const currentLocale = useCurrentLocale()

  const filteredCategories = categories?.filter(
    (_, idx) => products?.[idx]?.count > 0
  )

  return filteredCategories?.length > 0 ? (
    categories?.map(
      (category, idx) =>
        products?.[idx]?.count > 0 && (
          <Box
            as='section'
            key={category?.id}
            id={category?.slug}
            pt={{ base: 4, md: 44 }}
            mb={{ base: 2, md: 0 }}
          >
            <Text
              lineHeight={1}
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight={700}
              mb={{ base: 4, md: 4 }}
            >
              {category?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </Text>
            <SimpleGrid
              spacing={{ base: 2, lg: 4 }}
              columns={{ base: 2, md: 3, lg: 4 }}
            >
              {products?.[idx]?.products?.map((product: any, idx: number) => (
                <ProductCard
                  index={idx}
                  h1=''
                  product={product}
                  key={product.id}
                />
              ))}
            </SimpleGrid>
          </Box>
        )
    )
  ) : (
    <Center flexDir='column' textAlign='center' gap={2} minH='60vh'>
      {/* <Image src={noResults} alt='no results' width={140} height={113} /> */}
      <Text fontSize='2xl' fontWeight={700}>
        Ничего не найдено
      </Text>
      <Text fontWeight={500} fontSize='sm' color='gray.800'>
        По примененному фильтру товары не <br /> найдены. Повторите попытку.
      </Text>
    </Center>
  )
}

export default Products
