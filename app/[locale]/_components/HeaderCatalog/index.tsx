'use client'
import styles from './style.module.scss'
import { Box, Button, Container } from '@chakra-ui/react'
// import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useCurrentLocale } from '@/_locales/client'

interface IProps {
  data?: { categories: any[] }
  activeCategory?: string
}

function HeaderCatalog({ data, activeCategory }: IProps) {
  const currentLocale = useCurrentLocale()
  // const catalogMenuRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className={styles.fixed_categories}>
      <Box sx={{ position: 'relative' }}>
        {/* {data?.categories?.length > 10 && (
          <IconButton
            left={0}
            fontSize="lg"
            className={styles.icon}
            aria-label="minus-product"
            // onClick={() => move(-230)}
            display={{ base: 'none', md: 'flex' }}
            icon={<Icon icon="icon-park-outline:left" />}
          />
        )} */}
        <div
          className={styles.wrapper}
          // ref={catalogMenuRef}
        >
          {data?.categories?.map((category) => (
            <Link href={'/categories/' + category?.slug} key={category.id}>
              <Button
                fontWeight={400}
                borderRadius={'8px'}
                variant={'none'}
                bg={'transparent'}
                _hover={{
                  bgColor: 'brand.400',
                  color: 'paper.dark.800',
                }}
              >
                {
                  category.title?.[
                    currentLocale === 'kz' ? 'uz' : currentLocale
                  ]
                }
              </Button>
            </Link>
          ))}
        </div>
        {/* {data?.categories?.length > 10 && (
          <IconButton
            fontSize="lg"
            right={0}
            className={styles.icon}
            aria-label="minus-product"
            // onClick={() => move(230)}
            display={{ base: 'none', md: 'flex' }}
            icon={<Icon icon="icon-park-outline:left" />}
          />
        )} */}
      </Box>
    </div>
  )
}

export default HeaderCatalog
