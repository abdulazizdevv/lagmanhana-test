'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { Suspense, useRef } from 'react'
import FixedMenu from '@/_components/FixedMenu'
import CatalogBar from '@/_components/Catalogbar'
import CarouselBanner from '../CarouselMain'
import Products from '../Pages/Home/components/Products'
import BreadCrumb from '../Breadcrumb'
import { useCurrentLocale, useI18n } from '@/_locales/client'

function Categories({
  categories,
  category,
  products,
  banners,
}: {
  banners: any
  category: any
  categories: any
  products: any
}) {
  const t = useI18n()
  const [sm] = useMediaQuery('(max-width: 450px)')
  const catalogRef = useRef<any>()
  const currentLocale = useCurrentLocale()
  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('categories'),
      link: '/',
    },
    {
      item: sm
        ? category?.title?.[currentLocale]?.length > 20
          ? category?.title?.[currentLocale]?.substring(0, 12) + '...'
          : category?.title?.[currentLocale]
        : category?.title?.[currentLocale],
      link: `/categories/${category?.slug}`,
    },
    // {
    //   item:
    //     category?.title?.[currentLocale] ===
    //     categoryWithChildren?.title?.[currentLocale]
    //       ? ''
    //       : categoryWithChildren?.title?.[currentLocale],
    //   link: '',
    // },
  ]
  return (
    <>
      <FixedMenu
        data={categories?.categories}
        products={products}
        instanceRef={catalogRef}
      />
      {banners?.banners?.length > 0 && (
        <CarouselBanner list={banners?.banners} />
      )}

      <Suspense fallback={<p>Loading...</p>}>
        <Container mt={{ base: 3, md: 5 }}>
          <Box ref={catalogRef}>
            <CatalogBar data={categories?.categories} active={category} />
            <Flex flexDir={'column'} pt={{ base: 4, md: 6 }}>
              <BreadCrumb items={BreadcrumbData} />
              <Heading as='h1' size='lg' pt={{ base: 4, md: 6 }}>
                {category?.title?.[currentLocale]}
              </Heading>
            </Flex>
            <Suspense fallback={<p>Loading feed...</p>}>
              <Products data={products?.products} category={category} />
            </Suspense>
            {category?.child_categories?.map(
              (item: any, idx: number) =>
                products?.products?.[idx + 1] && (
                  <div key={item?.id}>
                    <Text
                      fontSize='xl'
                      color='gray.700'
                      fontWeight={600}
                      mt={{ base: 4, md: 6 }}
                    >
                      {item?.title?.[currentLocale]}
                    </Text>
                    <Products data={products?.products?.[idx + 1]} />
                  </div>
                )
            )}
          </Box>
        </Container>
      </Suspense>
      {/* <BottomCart />  */}
      {/* <Analytics data={category} /> */}
    </>
  )
}

export default Categories
