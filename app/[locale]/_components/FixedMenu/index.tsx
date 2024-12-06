'use client'

import React, { RefObject, useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'
import {
  Box,
  Button,
  HStack,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react'
import Link from 'next/link'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import { debounce } from 'lodash'
import { useCurrentLocale } from '@/_locales/client'

interface IOffsetTops {
  id: string
  offsetTop: number
  offsetHeight: number
}

interface IProps {
  data: any[]
  products: any[]
  parent?: any
  instanceRef: any
  noFilters?: boolean
  menuRef?: RefObject<HTMLDivElement | null>
}

function FixedMenu({
  data,
  products,
  parent,
  menuRef,
  noFilters = false,
  instanceRef,
}: IProps) {
  const [activeCategory, setActiveCategory] = useState<any>('')
  const [categoriesOffsetTops, setOffsetTops] = useState<IOffsetTops[]>([])
  const [isFixedCatalog, setFixedCatalog] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [fixedMenuX, setFixedMenuX] = useState(0)
  const [lg] = useMediaQuery('(max-width: 960px)')

  const catalogMenuRef = useRef<HTMLDivElement>(null)
  const currentLocale = useCurrentLocale()
  const pathname = usePathname()

  useEffect(() => {
    if (catalogMenuRef.current) {
      const sanitizedId = CSS.escape(`${activeCategory}-fixed`)
      const targetElement = catalogMenuRef.current.querySelector<HTMLElement>(
        `#${sanitizedId}`
      )
      catalogMenuRef.current.scrollLeft = (targetElement?.offsetLeft || 0) - 400
    }
  }, [fixedMenuX])

  const handleScroll = debounce(() => {
    const position = window.scrollY
    setScrollPosition(position)
  }, 10)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    // only main page
    if (products?.length > 0 && data?.length > 0) {
      const offsets: IOffsetTops[] = data?.map((category: any) => ({
        id: category?.slug,
        offsetTop: category?.slug
          ? (document?.querySelector<HTMLElement>(`#${category?.slug}`)
              ?.offsetTop || 0) - 200
          : 0,
        offsetHeight: category?.slug
          ? document?.querySelector<HTMLElement>(`#${category?.slug}`)
              ?.offsetHeight || 0
          : 0,
      }))

      if (offsets) {
        setOffsetTops(offsets)
      }
    }
  }, [data, products?.length])

  useEffect(() => {
    // only main page
    if (scrollPosition > instanceRef?.current?.offsetTop - 10) {
      setFixedCatalog(true)
    } else {
      setFixedCatalog(false)
      setFixedMenuX(0)
    }

    let activeCat = ''
    for (let i = 0; i < categoriesOffsetTops?.length; i++) {
      const { id, offsetTop, offsetHeight } = categoriesOffsetTops[i]

      if (
        scrollPosition > offsetTop - 60 &&
        scrollPosition < offsetTop + offsetHeight - 60
      ) {
        activeCat = id

        setFixedMenuX((i - 1) * 100)
        break
      }
    }

    setActiveCategory(activeCat)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  const bgColor = useColorModeValue('white', 'paper.dark.500')

  return (
    <Box
      bgColor={bgColor}
      className={classNames(styles.top, {
        [styles.active]: isFixedCatalog,
      })}
      transform={{
        base: `translateY(${isFixedCatalog ? '56px' : '-100%'})`,
        md: `translateY(${isFixedCatalog ? '72px' : '-100%'})`,
      }}
    >
      <Box py={1} pt={lg ? 45 : 2}>
        <HStack
          className={styles.wrapper}
          ref={catalogMenuRef}
          height={{ base: 'fit-content', md: '60px' }}
        >
          {/* {!noFilters && <ProductFilters />} */}
          {data?.map((category, idx) => (
            <Link
              href={
                pathname.includes('categories')
                  ? '/categories/' +
                    (parent ? parent.slug + '/' + category.slug : category.slug)
                  : `#${category?.slug}`
              }
              key={category.id}
              replace
            >
              <Button
                borderRadius={'8px'}
                color={'paper.dark.800'}
                fontWeight={400}
                id={category?.slug + '-fixed'}
                size={{ base: 'sm', md: 'md' }}
                onClick={() => setActiveCategory(idx)}
                variant={'ghost'}
                bg={category.slug === activeCategory ? 'brand.400' : '#fff'}
              >
                {
                  category.title?.[
                    currentLocale === 'kz' ? 'uz' : currentLocale
                  ]
                }
              </Button>
            </Link>
          ))}
        </HStack>
      </Box>
    </Box>
  )
}

export default FixedMenu
