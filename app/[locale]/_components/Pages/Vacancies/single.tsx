'use client'
import BreadCrumb from '@/_components/Breadcrumb'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { IStocks } from '@/_types'
import CreateModal from './components/CreateModal'
import BackIcon from '@/_assets/icons/BackIcon'
import { useRouter } from 'next/navigation'

const SingleVacancy = ({ data }: { data: IStocks }) => {
  const t = useI18n()
  const currentLocale = useCurrentLocale()
  const router = useRouter()

  const BreadCrumpStocks = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('vacancies'),
      link: '/vacancies',
    },
    {
      item: data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
      link: '',
    },
  ]
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [vacancyId, setVacancyId] = useState('')

  const onShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale],
          url: window.location.href,
        })
        .then(() => {
          console.log('Successfully shared')
        })
        .catch((error) => {
          console.error('Something went wrong', error)
        })
    }
  }

  const bgColor = useColorModeValue('white', 'paper.dark.500')

  return (
    <Container mb={{ base: '30px', md: '200px' }}>
      <Box my={{ base: 0, md: 5 }}>
        <BreadCrumb items={BreadCrumpStocks} />
        <Box>
          <Flex
            alignItems={'center'}
            gap={1}
            mt={{ base: 0, md: 3 }}
            mb={{ base: 4, md: 0 }}
          >
            <IconButton
              p={0}
              display={{ base: 'flex', md: 'none' }}
              aria-label='back'
              justifyContent={'center'}
              variant={'ghost'}
              icon={<BackIcon color='black' />}
              onClick={() => router.back()}
            />
            <Text fontWeight={700} fontSize={{ base: 22, md: 28 }}>
              {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </Text>
          </Flex>
        </Box>
      </Box>
      {data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale] && (
        <Box
          bg={bgColor}
          p={4}
          borderRadius={'16px'}
          flexDirection={'column'}
          gap={'24px'}
          w={{ base: '100%', md: '50%' }}
        >
          <pre
            style={{
              font: 'inherit',
              whiteSpace: 'pre-wrap',
              color: 'gray.700',
            }}
          >
            {data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
          </pre>
          <Flex
            display={{ base: 'none', md: 'flex' }}
            gap={'20px'}
            w={'100%'}
            justifyContent={'space-between'}
            mt={4}
          >
            <Button
              flex={1}
              colorScheme='primary'
              variant='solid'
              fontSize={14}
              _active={{
                bgColor: 'primary.500',
                color: '#fff',
              }}
              onClick={() => onShare()}
            >
              {t('share')}
            </Button>
            <Button
              flex={1}
              variant='primary'
              onClick={() => {
                setIsOpenModal(true)
                setVacancyId(data?.id)
              }}
            >
              {t('respond')}
            </Button>
          </Flex>
        </Box>
      )}
      <Flex
        display={{ base: 'flex', md: 'none' }}
        gap={'8px'}
        bg={bgColor}
        position={'fixed'}
        flexDir={'column'}
        w='100%'
        bottom={0}
        left={0}
        p={'16px 12px'}
        m={'0 auto'}
        fontSize={14}
        fontWeight={500}
        borderRadius={'24px 24px 0 0 '}
        zIndex={999}
      >
        <Button
          mt={4}
          py={'14px'}
          w={'100%'}
          h={'48px'}
          colorScheme='primary'
          variant={'outline'}
          fontSize={14}
          fontWeight={500}
          onClick={() => onShare()}
        >
          {t('share')}
        </Button>
        <Button
          py={'14px'}
          w={'100%'}
          h={'48px'}
          fontSize={14}
          fontWeight={500}
          colorScheme='primary'
          variant={'primary'}
          onClick={() => {
            setIsOpenModal(true)
            setVacancyId(data?.id)
          }}
        >
          {t('respond')}
        </Button>
      </Flex>

      <CreateModal
        setIsOpenModal={setIsOpenModal}
        vacancyId={vacancyId}
        isOpenModal={isOpenModal}
      />
    </Container>
  )
}

export default SingleVacancy
