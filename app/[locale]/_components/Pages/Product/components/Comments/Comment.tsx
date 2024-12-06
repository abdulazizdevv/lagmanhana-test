import React, { useState } from 'react'
import dayjs from 'dayjs'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Rating, RoundedStar } from '@smastrom/react-rating'
import { useI18n } from '@/_locales/client'

require('dayjs/locale/uz-latn')
require('dayjs/locale/ru')
require('dayjs/locale/en')

function Comment({ data }: { data: any }) {
  const [showMore, setShowMore] = useState(true)
  const t = useI18n()

  const ratingText = [
    t('terrible'),
    t('bad'),
    t('acceptable'),
    t('good'),
    t('excellent'),
  ]

  return (
    <Card w={'100%'} bg='paper.light.100' borderRadius='lg'>
      <CardHeader px={4} py={3}>
        <Flex
          gap={{ base: 2, md: 4 }}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            <Box>
              <Heading size='sm' mb={1}>
                {data.client_name}
              </Heading>
              <Text color='#A5A5A5' fontSize='xs'>
                {dayjs(data.created_at)
                  // .locale(router.locale === 'uz' ? 'uz-latn' : 'ru')
                  .format('MMMM D, YYYY')}
              </Text>
            </Box>
          </Flex>
          <Box>
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
            <Text
              textAlign={{ base: 'left', md: 'right' }}
              mt={1}
              fontSize='sm'
            >
              {ratingText[data?.rating - 1 || 0]}
            </Text>
          </Box>
        </Flex>
      </CardHeader>
      <CardBody px={4} py={3} textAlign={'left'}>
        <Text fontSize={14} lineHeight={'20px'} color={'paper.dark.800'}>
          {showMore
            ? data.review_message
            : data.review_message?.substring(0, 170) + '...'}
        </Text>
        {data.review_message?.length > 170 && (
          <Button
            w='full'
            fontSize='xs'
            variant='link'
            width={'fit-content'}
            fontWeight={400}
            color={'primary.500'}
            textDecor={'underline'}
            transform={`translateY(${showMore ? 0 : -5}px)`}
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? 'Уменьшить' : 'Читать дальше'}
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default Comment
