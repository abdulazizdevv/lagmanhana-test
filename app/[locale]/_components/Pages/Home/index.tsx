'use client'
import {
  Box,
  Button,
  Container,
  Flex,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'

import Catalog from './components/Catalog'
import CarouselBanner from '@/_components/CarouselMain'
import AlertWorkHours from '@/_components/AlertWorkHours'
import { useI18n } from '@/_locales/client'
import FilteredTags from './components/FilteredTags'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { setFilterTags } from '@/_store/common/common.slice'
import Products from './Products'
import NonSubcategory from './components/NonSubcategory'

function Home({
  categories,
  products,
  banners,
  searchParams,
  subCategories,
}: {
  categories: any
  products: any
  banners: any
  searchParams: any
  subCategories: any
}) {
  const t = useI18n()
  const dispatch = useDispatch()
  const router = useRouter()
  const handleClearFilter = () => {
    dispatch(setFilterTags(''))
    router.push(`/`)
  }

  return (
    <>
      {banners?.banners?.length > 0 && (
        <CarouselBanner list={banners?.banners} />
      )}
      <Container mt={banners?.banners?.length > 0 ? 0 : 5}>
        <AlertWorkHours isBanner={banners?.banners?.length} />
        <Catalog products={products} categories={categories} />
        {searchParams?.tag_ids || searchParams?.sort ? (
          <Box mt={4}>
            {products?.products?.length > 0 ? (
              <Flex flexDir={'column'}>
                <Text fontWeight={700} fontSize={32}>
                  {t('result_filter')}
                </Text>
                <SimpleGrid
                  spacing={{ base: 2, lg: 4 }}
                  columns={{ base: 2, md: 3, lg: 4 }}
                >
                  {products?.products?.map((el: any, idx: number) => (
                    <FilteredTags index={idx + 1} key={el.id} products={el} />
                  ))}
                </SimpleGrid>
              </Flex>
            ) : (
              <Flex flexDir={'column'}>
                <Text fontWeight={700} fontSize={32}>
                  {t('result_by_filter')}: 0
                </Text>
                <Text color={'gray.500'} fontSize={'sm'}>
                  {t('search_not_found_text')}
                </Text>
                <Button
                  mt={3}
                  fontWeight={500}
                  w={'fit-content'}
                  py={'10px'}
                  px={6}
                  variant={'ghost'}
                  color={'primary.500'}
                  _hover={{
                    bgColor: 'primary.500',
                    color: '#fff',
                  }}
                  onClick={handleClearFilter}
                >
                  {t('reset_filter')}
                </Button>
              </Flex>
            )}
          </Box>
        ) : (
          <>
            {subCategories?.length > 0 ? (
              categories?.map((category: any, idx: number) => (
                <Products
                  key={category.id}
                  products={products}
                  categories={categories}
                />
              ))
            ) : (
              <NonSubcategory categories={categories} products={products} />
            )}
          </>
        )}
      </Container>
    </>
  )
}

export default Home
