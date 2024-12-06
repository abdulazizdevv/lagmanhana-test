'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './style.module.scss'
import { SplideSlide } from '@splidejs/react-splide'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { Box, Container, Divider, Text } from '@chakra-ui/react'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { getProductFavourites } from '@/_services/products'
import { IRedux, ISavedModifier } from '@/_types'
import MultipleSlide from '@/_components/MultipleSlide'
import Card from '@/_components/Card'
import BreadCrumb from '@/_components/Breadcrumb'
import V1 from './V1'

interface IProductOption {}

interface IProductVariant {
  id: string
  out_price: number
  discounts: any[]
  title: {
    uz: string
    ru: string
    en: string
  }
}

interface IVariantsMap {
  [key: string]: any
}

function SingleProduct({ data, deliveryTime, reviews }: any) {
  const [originProps, setOriginProps] = useState([])
  const [modifiersPrice, setModifiersPrice] = useState(0)
  const [orderModifiers, setOrderModifiers] = useState<ISavedModifier[]>([])
  const [productVariants, setProductVariants] = useState<IVariantsMap>({})
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0)
  const [activeVariant, setActiveVariant] = useState<IProductVariant | null>(
    null
  )
  const [showMore, setShowMore] = useState(false)

  const [activeOptions, setActiveOptions] = useState<IProductOption[] | null>(
    null
  )
  const t = useI18n()

  const currentLocale = useCurrentLocale()
  const commonState = useSelector((state: IRedux) => state.common)

  const { data: favouritesData }: UseQueryResult<{ favourites: any[] }, Error> =
    useQuery({
      queryKey: [
        'product-favourites',
        activeVariant ? activeVariant.id : data?.id,
      ],
      queryFn: () =>
        getProductFavourites({
          product_ids: activeVariant ? activeVariant.id : data?.id,
          menu_id: commonState?.branch?.menu_id
            ? commonState?.branch?.menu_id
            : '',
          product_types: 'origin,simple,combo',
        }).then((res) => res.data),
    })

  useEffect(() => {
    for (const [key, value] of Object.entries(productVariants)) {
      if (key == activeOptions?.join('_')) {
        setActiveVariant(value)
        break
      } else {
        setActiveVariant(null)
      }
    }
  }, [activeOptions, productVariants])
  // Calculate discounts total price
  useEffect(() => {
    if (activeVariant?.discounts) {
      let sum = 0
      for (const discount of activeVariant.discounts) {
        sum += discount.discount_price
      }
      setTotalDiscountPrice(sum)
    }
  }, [activeVariant?.discounts])

  useEffect(() => {
    if (orderModifiers) {
      let sum = 0
      for (const modifier of orderModifiers) {
        sum += modifier.modifier_price * modifier.modifier_quantity
      }
      setModifiersPrice(sum)
    }
  }, [orderModifiers])

  useEffect(() => {
    if (data && data?.type === 'origin') {
      const variantsMap: { [key: string]: any } = {}
      const optionsMap: { [key: string]: string } = {}
      const firstOptions: any[] = []
      for (const variantProduct of data?.variant_products) {
        let optionIds = ''
        for (let j = 0; j < variantProduct.product_property.length; j++) {
          const element = variantProduct.product_property[j]
          optionsMap[element.option_id] = element.option_id
          if (optionIds.length > 0) {
            optionIds += '_' + element.option_id
          } else {
            optionIds += element.option_id
          }
        }
        variantsMap[optionIds] = variantProduct
      }
      setProductVariants(variantsMap)
      setOriginProps(data?.properties)
      // Set first options of property to state
      Object.keys(variantsMap)[0]
        ?.split('_')
        .forEach((option) => {
          firstOptions.push(option)
        })
      setActiveOptions(firstOptions)
    }
  }, [data])

  const BreadcrumbData = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item:
        data?.type === 'origin' && activeVariant
          ? activeVariant?.title?.[
              currentLocale === 'kz' ? 'uz' : currentLocale
            ]
          : data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
      link: '/',
    },
  ]

  // const microdata = {
  //   '@context': 'http://schema.org',
  //   '@type': 'Product',
  //   name:
  //     data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale] ||
  //     'Default Product Name', // Fallback name
  //   image: process.env.BASE_URL + data?.image || 'Default Image URL', // Fallback image URL
  //   description:
  //     data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale] ||
  //     'Default Product Description', // Fallback description
  //   offers: {
  //     '@type': 'Offer',
  //     url: typeof window !== 'undefined' ? window.location.href : 'Default URL', // Fallback URL
  //     availability:
  //       (commonState?.branch?.menu_id && data?.active_in_menu) ||
  //       !commonState?.branch?.menu_id
  //         ? 'https://schema.org/InStock'
  //         : 'https://schema.org/OutOfStock',
  //     price: String(data?.out_price) || '0',
  //     priceCurrency: String(data?.currency) || 'UZS',
  //   },
  //   // Only include aggregateRating if reviews exist
  //   aggregateRating:
  //     reviews?.count > 0
  //       ? {
  //           '@type': 'AggregateRating',
  //           ratingValue: data?.rating,
  //           reviewCount: String(reviews?.count || 0),
  //         }
  //       : undefined,
  // }

  // const microdataJson = JSON.stringify(microdata)

  const handleShowMore = () => {
    setShowMore(!showMore)
  }
  return (
    <>
      <Container mt={{ base: 0, md: '16px' }}>
        <BreadCrumb items={BreadcrumbData} />
        <V1 data={data} deliveryTime={deliveryTime} reviews={reviews} />

        {Boolean(favouritesData?.favourites?.length) &&
          favouritesData?.favourites?.length &&
          favouritesData?.favourites?.length > 0 && (
            <Box mt={{ base: 4, md: 8 }} className={styles.recommended}>
              <Text fontSize="2xl" fontWeight={700} mb={{ base: 2, md: 5 }}>
                {t('recommended')}
              </Text>
              <MultipleSlide options={{ gap: '16px', arrows: false }}>
                {favouritesData?.favourites?.map((item: any, index: number) => (
                  <SplideSlide key={item?.id}>
                    <Card
                      index={index}
                      h1={
                        data?.title[
                          currentLocale === 'kz' ? 'uz' : currentLocale
                        ]
                      }
                      product={item}
                    />
                  </SplideSlide>
                ))}
              </MultipleSlide>
            </Box>
          )}

        {data?.seo_text?.[currentLocale === 'kz' ? 'uz' : currentLocale] && (
          <Box>
            <Box position={'relative'} padding="0 6.5vw" mb={'92px'}>
              <Divider
                orientation="vertical"
                bg={'primary.500'}
                height={'100%'}
                position={'absolute'}
                top={0}
                left={0}
                w={'1px'}
              />
              <Box position={'relative'} marginTop={'92px'} color={'#808080'}>
                {!showMore && (
                  <Box
                    dangerouslySetInnerHTML={{
                      __html:
                        data?.seo_text?.[
                          currentLocale === 'kz' ? 'uz' : currentLocale
                        ]?.substring(0, 800) + '...',
                    }}
                  ></Box>
                )}
                <Box
                  sx={
                    !showMore
                      ? {
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          backgroundImage:
                            'linear-gradient(transparent, #f2f4f7)',
                          zIndex: 1,
                          width: '100%',
                          height: '50px',
                        }
                      : {}
                  }
                />
                {showMore && (
                  <Box
                    dangerouslySetInnerHTML={{
                      __html:
                        data?.seo_text?.[
                          currentLocale === 'kz' ? 'uz' : currentLocale
                        ],
                    }}
                  ></Box>
                )}
              </Box>
              <Box>
                <Text
                  cursor={'pointer'}
                  as={'span'}
                  color={'#808080'}
                  fontWeight={500}
                  onClick={handleShowMore}
                >
                  {showMore ? t('less') : t('more')}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
      {/* <Script
        id='microdata-product'
        strategy='lazyOnload'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: microdataJson }}
      /> */}
    </>
  )
}

export default SingleProduct
