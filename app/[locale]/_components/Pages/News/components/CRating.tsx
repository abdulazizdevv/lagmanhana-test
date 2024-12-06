'use client'

import React, { FormEvent, useState } from 'react'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { Rating, RoundedStar } from '@smastrom/react-rating'
import { getTrackingStatus } from '@/_utils/getStatus'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { Text, Flex, AspectRatio, useToast } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import { Stack } from '@chakra-ui/react'
import reviewService from '@/_services/reviewService'
import { IOrder, IProduct, IRedux } from '@/_types'
import Image from 'next/image'
import InputComponent from '@/_components/Input'
import AuthDialog from '@/_components/AuthDialog'
import { useSelector } from 'react-redux'

interface IProps {
  review?: any
  newsId: string
  data: any
}

function CRating({ review, newsId, data }: IProps) {
  const [isAuth, setIsAuth] = useState(false)

  const [rate, setRate] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [isSent, setSent] = useState(false)
  const [isOpen, setOpenModal] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')

  const { user } = useSelector((state: IRedux) => state.auth)

  const CUSTOM_ITEM_LABELS: any = {
    uz: ['Dahshatli', 'Yomon', 'Qoniqarli', 'Yaxshi', 'Ajoyib'],
    en: ['Terrible', 'Bad', 'Satisfactory', 'Good', 'Excellent'],
    ru: ['Ужасно', 'Плохо', 'Удовлетворительно', 'Хорошо', 'Отлично'],
  }

  const t = useI18n()
  const toast = useToast()

  const currentLocale = useCurrentLocale()

  const onSelectRate = (newValue: any) => {
    setRate(newValue)
    setOpenModal(true)
  }

  const onClose = () => {
    setOpenModal(false)
    setRate(0)
  }

  const onSubmitReview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      client_id: user?.id,
      client_mail: userEmail,
      client_name: user?.name,
      client_phone: user?.phone,
      lang: currentLocale,
      subject_id: newsId,
      rating: rate,
      related_subject: 'news_events',
      review_message: reviewMsg,
      type: rate > 3 ? 'like' : 'dislike',
    }

    reviewService
      .create(data)
      .then((res) => {
        setOpenModal(false)
        setSent(true)
        toast({
          title: t('successfully_sent_review'),
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      })
      .catch(console.log)
      .finally(() => setLoading(false))
  }

  return (
    <>
      {!Boolean(review?.length > 0) && (
        <Text
          textDecoration={'underline'}
          cursor={'pointer'}
          onClick={() => {
            if (!user) {
              setIsAuth(true)
            } else {
              setOpenModal(true)
            }
          }}
          color={'#1570EF'}
        >
          Оставить отзыв
        </Text>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <form onSubmit={(e) => onSubmitReview(e)}>
            <ModalHeader px={4} pb={0}>
              {t('leave_a_review')}
            </ModalHeader>
            <ModalBody px={4}>
              <Flex
                py={4}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Rating
                  readOnly={Boolean(review?.id)}
                  style={{ maxWidth: 200 }}
                  value={!review?.id ? rate : review?.rating}
                  itemStyles={{
                    itemShapes: RoundedStar,
                    activeFillColor: '#FFC500',
                    inactiveFillColor: '#E0E8F1',
                  }}
                  onChange={onSelectRate}
                />
                <Text fontSize={12} color={'#A5A5A5'}>
                  {
                    CUSTOM_ITEM_LABELS?.[
                      currentLocale === 'kz' ? 'uz' : currentLocale
                    ]?.[rate - 1]
                  }
                </Text>
              </Flex>
              <Stack>
                <FormControl>
                  <FormLabel>{t('email')}</FormLabel>
                  <InputComponent
                    type='email'
                    placeholder='example@gmail.com'
                    value={userEmail}
                    onChange={(e) => setUserEmail(e)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>{t('your_feedback')}</FormLabel>
                  <Textarea
                    value={reviewMsg}
                    placeholder={t('describe_your_impressions')}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    // _focus={{
                    //   outline: '#7E5FA6',
                    //   borderColor: '#7E5FA6',
                    //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
                    // }}
                    // _active={{
                    //   outline: '#7E5FA6',
                    //   borderColor: '#7E5FA6',
                    //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
                    // }}
                    boxShadow='0px 1px 2px 0px #1018280D'
                    border='1px solid #D0D5DD'
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter px={4}>
              <Button
                w='full'
                type='submit'
                variant='primary'
                isDisabled={rate === 0 || isSent || isLoading}
              >
                {t('send')}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <AuthDialog isOpen={isAuth} onClose={() => setIsAuth(false)} />
    </>
  )
}

export default CRating
