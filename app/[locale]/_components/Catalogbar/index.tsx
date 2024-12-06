'use client'

import React, { useRef } from 'react'
import {
  Box,
  Button,
  HStack,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react'
import { ICategory } from '@/_types'
import ProductFilters from '../ProductFilters'
import SearchProduct from '../Search'
import Link from 'next/link'
import { useCurrentLocale, useI18n } from '@/_locales/client'

interface IProps {
  data: any[]
  active?: ICategory
  noFilters?: boolean
}

function CatalogBar({ data, active, noFilters = false }: IProps) {
  const catalogRef = useRef<any>()
  const currentLocale = useCurrentLocale()
  const [lg] = useMediaQuery('(max-width: 960px)')
  const t = useI18n()
  const handleScroll = () => {
    window.scrollTo({
      top: catalogRef?.current?.offsetTop - (lg ? 120 : 80),
      behavior: 'smooth',
    })
  }

  const btnVariant = useColorModeValue('yellow.500', 'solid')

  if (!data?.length) {
    return null
  }

  return (
    <>
      <SearchProduct />
      <HStack
        maxWidth='100%'
        ref={catalogRef}
        onClick={handleScroll}
        borderRadius='xl'
        justifyContent='flex-start'
        spacing={{ base: 1, md: 3 }}
        flexWrap={{ base: 'nowrap', md: 'wrap' }}
        overflowX={{ base: 'auto', md: 'visible' }}
      >
        {!noFilters && (
          <Box display={{ base: 'none', md: 'block' }}>
            <ProductFilters />
          </Box>
        )}
        <Link href='/' scroll={false} replace>
          <Button
            borderRadius={'8px'}
            color={'paper.dark.800'}
            fontWeight={400}
            variant={{
              base: btnVariant,
              md: !active ? 'brand.400' : 'ghost',
            }}
            bg={!active ? 'brand.400' : '#fff'}
          >
            {t('all')}
          </Button>
        </Link>
        {data?.map((category) => (
          <Link
            href={`/categories/${category?.slug}`}
            scroll={false}
            replace
            key={category.id}
          >
            <Button
              borderRadius={'8px'}
              color={'paper.dark.800'}
              fontWeight={400}
              variant={category.slug === active?.slug ? 'brand.400' : 'white'}
              bg={category.slug === active?.slug ? 'brand.400' : '#fff'}
            >
              {category.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </Button>
          </Link>
        ))}
      </HStack>
      {active?.child_categories && active?.child_categories?.length > 0 && (
        <HStack
          p={2}
          mt={3}
          w='fit-content'
          rounded='full'
          maxWidth='100%'
          bgColor='white'
          justifyContent='flex-start'
          flexWrap={{ sm: 'nowrap', md: 'wrap' }}
          overflowX={{ sm: 'auto', md: 'visible' }}
        >
          {active?.child_categories?.map((item: any) => (
            <Link
              href={
                '/categories/' +
                (active ? active.slug + '/' + item.slug : item.slug)
              }
              scroll={false}
              replace
              key={item.id}
            >
              <Button
                key={item.id}
                variant={{
                  base: btnVariant,
                  md: active ? btnVariant : 'ghost',
                }}
                id={item.id}
                borderRadius={'28px'}
                color={'paper.dark.800'}
                fontWeight={400}
                bg={active ? 'paper.light.200' : '#fff'}
              >
                {item?.title?.[currentLocale]}
              </Button>
            </Link>
          ))}
        </HStack>
      )}
    </>
  )
}

export default CatalogBar
