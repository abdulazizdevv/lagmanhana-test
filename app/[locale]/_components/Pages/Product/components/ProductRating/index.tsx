import React, { useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Rating, RoundedStar } from '@smastrom/react-rating'
import styles from './style.module.scss'
import Comments from '../Comments'
import { IProduct, IReview } from '@/_types'
import { useI18n } from '@/_locales/client'

interface IReviews {
  count: number
  reviews: IReview[]
}

function ProductRating({
  data,
  reviews,
}: {
  data: IProduct
  reviews: IReviews
}) {
  const [reviewsModal, setReviewsModal] = useState(false)

  const t = useI18n()

  return (
    <>
      <Flex align='center' gap={3}>
        <Box
          // bgColor='paper.light.100'
          // _dark={{ bgColor: 'paper.dark.400' }}
          className={styles.rating}
        >
          <Rating
            readOnly
            style={{ maxWidth: 100 }}
            value={data?.rating || 0}
            itemStyles={{
              itemShapes: RoundedStar,
              activeFillColor: '#FFC500',
              inactiveFillColor: '#E0E8F1',
            }}
          />
          {data?.rating}/5
        </Box>
        <Text
          as='span'
          fontSize='xs'
          lineHeight={'17px'}
          className={styles.reviews}
          onClick={() => setReviewsModal(true)}
        >
          {reviews?.count || 0}{' '}
          {t('_reviews', {
            ru_word_grammarly:
              reviews?.count > 4
                ? 'отзывов'
                : reviews?.count > 1
                ? 'отзыва'
                : t('review').toLocaleLowerCase(),
          })}
        </Text>
      </Flex>
      <Comments
        reviews={reviews?.reviews}
        isOpen={Boolean(reviewsModal)}
        handleClose={() => setReviewsModal(false)}
      />
    </>
  )
}

export default ProductRating
