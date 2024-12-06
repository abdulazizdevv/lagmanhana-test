'use client'
import { IVacancy } from '@/_types'
import {
  Box,
  Button,
  Flex,
  GridItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import CreateModal from '../CreateModal'
import { useCurrentLocale, useI18n } from '@/_locales/client'

const VacancyCard = ({ data }: { data: IVacancy }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [vacancyId, setVacancyId] = useState('')

  const t = useI18n()
  const router = useRouter()
  const currentLocale = useCurrentLocale()
  return (
    <>
      <GridItem bg={'#fff'} borderRadius={'24px'}>
        <Box p={4}>
          <Text fontSize={28} fontWeight={700} lineHeight={'33px'}>
            {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
          </Text>
          <Text
            mt={'16px'}
            h={'165px'}
            color={'gray.700'}
            fontWeight={500}
            lineHeight={'19px'}
            overflow={'hidden'}
          >
            <pre style={{ font: 'inherit', whiteSpace: 'pre-wrap' }}>
              {data?.description?.[
                currentLocale === 'kz' ? 'uz' : currentLocale
              ]?.substring(0, 220) +
                (data?.description?.[
                  currentLocale === 'kz' ? 'uz' : currentLocale
                ]?.length > 220
                  ? '...'
                  : '')}
            </pre>
          </Text>
          <Flex gap={'20px'}>
            <Button
              mt={4}
              py={'14px'}
              w={'100%'}
              // bg={bgColor}
              variant='solid'
              fontSize={14}
              fontWeight={500}
              onClick={() => router.push('/vacancies/' + data?.slug)}
            >
              {t('detailed')}
            </Button>
            <Button
              mt={4}
              py={'14px'}
              w={'100%'}
              colorScheme='primary'
              variant={'primary'}
              fontSize={14}
              fontWeight={500}
              onClick={() => {
                setIsOpenModal(true)
                setVacancyId(data?.id)
              }}
            >
              {t('respond')}
            </Button>
          </Flex>
        </Box>
        <CreateModal
          setIsOpenModal={setIsOpenModal}
          vacancyId={vacancyId}
          isOpenModal={isOpenModal}
        />
      </GridItem>
    </>
  )
}

export default VacancyCard
