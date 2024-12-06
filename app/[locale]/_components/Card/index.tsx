'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import NumberToPrice from '@/_components/NumberToPrice'
// Style
import styles from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_TO_CART, REMOVE, SET_QUANTITY } from '@/_store/cart/cart.slice'
import {
  AspectRatio,
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardBody,
  CardFooter,
  Flex,
  HStack,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import AddToCart from '@/_components/AddToCart'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { ICartProductHook, IProduct, IRedux, ITag, ITags } from '@/_types'
import { parseCookies } from 'nookies'
import numToPrice from '@/_utils/numToPrice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import Image from 'next/image'
import { fonts } from '@/fonts'
import useCartProduct from '@/_hooks/useCartProduct'
import { dataLayerComponent } from '@/_utils/gtm'

function ProductCard({
  product,
  index,
  h1,
}: {
  product: IProduct
  index: number
  h1: string
}) {
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0)

  const t = useI18n()
  const toast = useToast()
  const router = useRouter()
  const dispatch = useDispatch()
  const currentLocale = useCurrentLocale()

  const { menu_id } = parseCookies()

  const commonState = useSelector((state: IRedux) => state.common)
  const { isOrdered, productInCart }: ICartProductHook = useCartProduct(
    product.id
  )

  // const sendToGTM = useCallback(() => {
  //   const data = {
  //     item_name: product?.title?.ru,
  //     item_id: product?.id,
  //     item_brand: 'Chicago',
  //     item_category: product?.slug,
  //     index: product?.order,
  //     item_list_name: '',
  //     item_list_id: product?.categories?.[0],
  //     price: product?.out_price,
  //     quantity: 1,
  //   }
  //   dataLayerComponent({
  //     event: 'select_item',
  //     ecommerce: {
  //       items: [data],
  //     },
  //   })
  // }, [
  //   product?.categories,
  //   product?.id,
  //   product?.order,
  //   product?.out_price,
  //   product?.slug,
  //   product?.title?.ru,
  // ])

  const navigateTo = useCallback(
    (e?: any) => {
      e?.preventDefault()
      // if (
      //   (commonState?.branch?.menu_id && product?.active_in_menu) ||
      //   !commonState?.branch?.menu_id
      // ) {log

      // sendToGTM()
      router.push('/product/' + (product.slug ? product.slug : product.id))
      // }
    },
    [
      //  commonState?.branch?.menu_id,
      // product?.active_in_menu,
      // sendToGTM,
      product,
      router,
    ]
  )

  const addToCartHandler = useCallback(() => {
    dispatch(
      ADD_TO_CART({
        ikpu: product?.ikpu,
        package_code: product?.package_code,
        product_type: product?.product_type,
        barcode: product?.barcode,
        price_with_discount: product.out_price + totalDiscountPrice,
        price: product.out_price,
        product_id: product.id,
        type: product.type,
        variants: [],
        order_modifiers: [],
        quantity: 1,
        name: product.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
      })
    )
    // dataLayerComponent({
    //   event: 'add_to_cart',
    //   ecommerce: {
    //     items: [
    //       {
    //         item_name: product.title?.ru,
    //         item_id: product.id,
    //         price: product.out_price,
    //         item_category: product?.categories?.[0]?.title?.ru,
    //         item_list_name: 'Product card',
    //         // item_list_id: router.asPath,
    //         index: product.order,
    //         quantity: 1,
    //       },
    //     ],
    //   },
    // })
    // dataLayerComponent({
    //   event: 'add_to_cart_ads',
    //   value: product?.out_price,
    //   items: [
    //     {
    //       id: product?.id,
    //       google_business_vertical: 'retail',
    //     },
    //   ],
    // })
    // dataLayerComponent({
    //   event: 'add_to_cart_fb',
    //   value: product?.out_price,
    //   content_ids: [product?.id],
    //   content_type: 'product',
    //   currency: 'UZS',
    // })

    toast({
      id: product.id,
      duration: 2000,
      position: 'top-right',
      render: () => (
        <HStack
          color='white'
          p={2}
          boxShadow='0px 8px 16px 0px #5B68713D, 0px 0px 1px 0px #1A202452, 4px 4px 12px 0px #00000029'
          bg='#60666A'
          borderRadius='lg'
          as={Link}
          href={'/cart'}
        >
          <Image
            src={
              product.image
                ? process.env.BASE_URL + product.image
                : defaultImage
            }
            // alt={product.title?.ru}
            alt={
              h1
                ? h1
                : product.title?.[
                    currentLocale === 'kz' ? 'uz' : currentLocale
                  ] + ` - photo ${index}`
            }
            width={60}
            height={40}
            style={{
              width: '60px',
              height: '40px',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
          <Stack spacing={0}>
            <Text color='#BEC1C2'>{t('added')}</Text>
            <Text color={'#F6F8F9'}>
              {product.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </Text>
          </Stack>
        </HStack>
      ),
    })
  }, [product, dispatch, totalDiscountPrice, currentLocale, toast, t])

  // commonState?.branch?.menu_id && !data?.active_in_menu
  const onClickCardHandler = useCallback(() => {
    product.type === 'simple' &&
    !product.has_modifier &&
    (menu_id ? product?.active_in_menu : true)
      ? addToCartHandler()
      : navigateTo()
  }, [product, addToCartHandler, navigateTo])

  // const sendGTM = () => {
  //   dataLayerComponent({
  //     event: 'remove_from_cart',
  //     ecommerce: {
  //       items: [
  //         {
  //           item_brand: 'Chicago',
  //           item_name:
  //             product?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
  //           item_id: product?.id,
  //           price: product?.out_price,
  //           item_category: product?.categories?.[0],
  //           item_list_name: 'Card',
  //           item_list_id: 'card',
  //           index: 1,
  //           quantity: productInCart?.quantity,
  //         },
  //       ],
  //     },
  //   })
  // }
  const removeHandler = () => {
    // sendGTM()
    dispatch(REMOVE(productInCart?.key))
  }

  // Calculate discounts total price
  useEffect(() => {
    if (product?.discounts?.length > 0) {
      let sum = 0
      for (const discount of product.discounts) {
        sum += discount.discount_price
      }
      setTotalDiscountPrice(sum)
    }
  }, [product.discounts])

  return (
    <Card
      maxW='sm'
      overflow='hidden'
      transition='100ms ease-in-out'
      // border='1px solid #00000012'
      boxShadow='none'
      borderRadius={{ base: '24px', md: '24px' }}
      // opacity={menu_id && !product.active_in_menu ? 0.3 : 1}
      _hover={{
        borderRadius: '24px',
        boxShadow: '0px 20px 24px -4px #10182814',
      }}
      p={{ base: 2, md: 3 }}
    >
      <Link href={'/product/' + (product.slug ? product.slug : product.id)}>
        {/* Tags Box */}
        {product?.tags_obj?.length > 0 && (
          <AvatarGroup
            size='sm'
            top={'20px'}
            left={0}
            px={1.5}
            py={0.5}
            zIndex={2}
            bgColor='white'
            position='absolute'
            borderRightRadius='full'
          >
            {product?.tags_obj?.map((tag: any, index: number) => {
              return (
                <Avatar
                  key={tag.id}
                  name={
                    tag?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]
                  }
                  src={tag.icon ? process.env.BASE_URL + tag.icon : ''}
                  zIndex={index}
                />
              )
            })}
          </AvatarGroup>
        )}
        <AspectRatio position='relative' maxH='260px' ratio={4 / 3}>
          <Image
            src={
              product.image
                ? process.env.BASE_URL + product.image
                : defaultImage
            }
            alt={
              h1
                ? h1
                : product.title?.[
                    currentLocale === 'kz' ? 'uz' : currentLocale
                  ] + ` - photo ${index}`
            }
            style={{ objectFit: 'cover', borderRadius: '16px' }}
            fill
            loading='eager'
            sizes='(max-width: 768px) 100vw, 
               (min-width: 768px) and (max-width: 1200px) 50vw, 
               33vw'
          />
        </AspectRatio>
        <CardBody shadow={'none'} pt={2} p={0}>
          <Stack gap={1}>
            <Box
              color={'primary.500'}
              fontWeight={500}
              // qdisplay={{ base: 'none', md: 'block' }}
            >
              {product?.discounts?.length > 0 ? (
                <Text fontSize='2xl'>
                  <Flex flexDir={'column'}>
                    <Text as={'span'} color={'gray.200'} fontSize={'14px'}>
                      <del>
                        <NumberToPrice
                          value={product.out_price}
                          textProps={{
                            as: 'span',
                          }}
                          spanProps={{
                            fontWeight: '500',
                          }}
                        />
                      </del>
                    </Text>
                    <span className={styles.with_discount}>
                      <NumberToPrice
                        value={product.out_price + totalDiscountPrice}
                        textProps={{
                          fontSize: {
                            base: 'xl',
                            md: '2xl',
                          },
                          as: 'span',
                        }}
                        spanProps={{
                          fontSize: {
                            base: 'xl',
                            md: '2xl',
                          },
                          fontWeight: '500',
                          color: 'primary.500',
                        }}
                      />
                    </span>
                  </Flex>
                </Text>
              ) : (
                <NumberToPrice
                  value={product.out_price + totalDiscountPrice}
                  product={product}
                  textProps={{
                    // fontWeight: 600,
                    lineHeight: '24px',
                    color: 'black',
                    fontSize: {
                      base: 'xl',
                      md: '2xl',
                    },
                    as: 'span',
                    // color:
                    //   (menu_id && product.active_in_menu) || !menu_id
                    //     ? undefined
                    //     : '#888',
                    // opacity:
                    //   (menu_id && product.active_in_menu) || !menu_id
                    //     ? undefined
                    //     : 0.5,
                  }}
                  spanProps={{
                    lineHeight: '28px',
                    fontSize: {
                      base: 'xl',
                      md: '2xl',
                    },
                    color: 'black',
                  }}
                  unstyled={true}
                />
              )}
            </Box>
            <Text
              fontSize={{ base: 'md', md: 'xl' }}
              fontWeight={500}
              whiteSpace='nowrap'
              overflow='hidden'
              lineHeight={{ base: '20px', md: '24px' }}
              textOverflow='ellipsis'
            >
              {product.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </Text>
            <Text
              fontSize={{ base: 12, md: 14 }}
              lineHeight={{ base: '17px', md: '20px' }}
              // display={{ base: 'none', md: 'block' }}
              color='gray.500'
              h={8}
            >
              {(product.description?.[
                currentLocale === 'kz' ? 'uz' : currentLocale
              ]).substring(0, 27) +
                ((product.description?.[
                  currentLocale === 'kz' ? 'uz' : currentLocale
                ]).length > 27
                  ? '...'
                  : '')}
            </Text>
          </Stack>
        </CardBody>
      </Link>
      <CardFooter
        pt={4}
        p={0}
        gap={2}
        // alignItems={{ base: 'stretch', md: 'center' }}
        w={'100%'}
      >
        {/* {(menu_id && product.active_in_menu) || !menu_id ? ( */}

        <AddToCart
          padding={{ base: 1, md: 7 }}
          onClick={onClickCardHandler}
          isOrdered={isOrdered}
          quantity={productInCart?.quantity}
          setQuantity={(e: number) => {
            dispatch(SET_QUANTITY({ key: productInCart?.key, quantity: e + 1 }))
          }}
          rounded={'12px'}
          onRemove={() => removeHandler()}
          isDisabled={!((menu_id && product.active_in_menu) || !menu_id)}
        >
          <Box>
            {(menu_id && product.active_in_menu) || !menu_id ? (
              <Text as='span' fontWeight={500}>
                {t('add_to_cart')}
              </Text>
            ) : (
              <Text as='span' fontWeight={500}>
                {t('will_be_later')}
              </Text>
            )}
          </Box>
        </AddToCart>
      </CardFooter>
    </Card>
  )
}

export default memo(ProductCard)
