import React, { useState } from 'react'
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { IOrderStepsProduct, IOrder } from '@/_types'
import { useI18n } from '@/_locales/client'
import NumberToPrice from '@/_components/NumberToPrice'
import CRating from './components/CRating'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import Image from 'next/image'
import { Rating, RoundedStar } from '@smastrom/react-rating'
import dayjs from 'dayjs'

interface IProps {
  product: IOrderStepsProduct
  orderData: IOrder
  refetch: () => void
}

function ProductCard({ orderData, product, refetch }: IProps) {
  const [showMore, setShowMore] = useState(true)

  const t = useI18n()

  const date = dayjs(product?.review?.created_at || null)
  dayjs.locale('ru')

  const formattedDate = date.format('D MMMM YYYY [г.]')

  return (
    <>
      <HStack justify='space-between' align='center'>
        <HStack gap={4}>
          <AspectRatio
            minW='40px'
            ratio={1 / 1}
            overflow='hidden'
            borderRadius='md'
            position='relative'
          >
            <Image
              src={
                product?.image
                  ? process.env.BASE_URL + product?.image
                  : defaultImage
              }
              alt={'Photo - ' + product?.name}
              style={{ objectFit: 'cover' }}
              fill
            />
          </AspectRatio>
          <Box>
            <Text fontSize={14} fontWeight={700}>
              {product?.name}
            </Text>
            <Flex alignItems={'center'} gap={1}>
              <Text fontSize='sm' color='#A5A5A5' lineHeight={1}>
                {product?.quantity} x
              </Text>
              <NumberToPrice
                value={
                  (product?.total_amount || 0) +
                  (product?.total_modifier_amount || 0)
                }
                textProps={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: '#222222',
                }}
                spanProps={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: '#222222',
                }}
              />
            </Flex>
          </Box>
        </HStack>
        <HStack alignItems='center' gap={3}>
          <CRating
            refetch={refetch}
            review={product?.review}
            productId={product?.product_id}
            orderData={orderData}
            product={product}
          />
        </HStack>
      </HStack>
      {product?.review?.id && (
        <Stack p={2} mt={2} borderRadius={8} bg={'#F9FAFB'}>
          <Flex justifyContent={'space-between'}>
            <Text fontSize={14}>{t('your_feedback')}</Text>
            <Text color={'gray.700'} fontSize={12}>
              {formattedDate}
            </Text>
          </Flex>
          <Box>
            {/* <Text>{product?.review?.rating}</Text> */}
            <Rating
              readOnly={Boolean(product?.review?.rating)}
              style={{ maxWidth: 100 }}
              value={product?.review?.rating || 0}
              itemStyles={{
                itemShapes: RoundedStar,
                activeFillColor: '#FFC500',
                inactiveFillColor: '#E0E8F1',
              }}
            />
            <Text mt={'2px'} fontSize={12} lineHeight={'17px'}>
              {showMore
                ? product?.review?.review_message
                : product?.review?.review_message?.substring(0, 140) + '...'}
            </Text>
            {product?.review?.review_message?.length > 140 && (
              <Button
                w='fit-content'
                color={'primary.500'}
                fontSize='xs'
                variant='link'
                fontWeight={400}
                transform={`translateY(${showMore ? 0 : -5}px)`}
                onClick={() => setShowMore((prev) => !prev)}
              >
                {showMore ? 'Показать меньше' : 'Показать больше'}
              </Button>
            )}
          </Box>
        </Stack>
      )}
    </>
  )
}

export default ProductCard
