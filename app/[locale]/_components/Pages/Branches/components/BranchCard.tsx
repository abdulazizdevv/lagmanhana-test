'use client'
import { IBranch } from '@/_types'
import { Box, Button, Card, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import ScheduleStatus from './ScheduleStatus'
import { useI18n } from '@/_locales/client'

const BranchCard = ({
  data,
  branchData,
  onBranchSelect,
}: {
  data: IBranch
  branchData: any
  onBranchSelect: (e: any) => void
}) => {
  const t = useI18n()

  return (
    <Box
      p={{ base: 3, md: 4 }}
      cursor={'pointer'}
      onClick={() => {
        onBranchSelect(data)
      }}
      borderRadius={16}
      bg={'#F9FAFB'}
      gap={'24px'}
      w={'100%'}
      border={
        branchData?.id === data.id ? '1px solid #FFC821' : '1px solid #F9FAFB'
      }
    >
      <Box>
        <Flex flexDirection={'column'} gap={'4px'}>
          {/* <Text display={{ base: 'block', md: 'none' }} color={'success'}>
            {ScheduleStatus({ branch: data, t })}
          </Text> */}
          <Text fontSize={'18px'} fontWeight={700}>
            <Link href={'/restaurants/' + data.slug}>{data?.name}</Link>
          </Text>
          <Text maxWidth={'280px'} fontSize='14px' fontWeight={400}>
            {data?.address}
          </Text>
        </Flex>
        {/* <Text display={{ base: 'none', md: 'block' }} color={'success'}>
          {ScheduleStatus({ branch: data, t })}
        </Text> */}
        <Flex flexDir={'column'} gap={2} mt={2}>
          <Flex gap={'6px'}>
            <Text color={'#475467'}>{t('schedule')}:</Text>
            <Text fontSize='sm'>
              {t('mon-sun')}: {data?.work_hour_start} - {data?.work_hour_end}
            </Text>
          </Flex>
          <Flex gap={'6px'}>
            <Text color={'#475467'}>{t('phone')}:</Text>
            <Box fontSize='sm'>
              <Link href={`tel:${data?.phone}`}>{data?.phone}</Link>
            </Box>
          </Flex>
        </Flex>
        <Flex flexDir={{ base: 'column', md: 'row' }} gap={3} mt={2}>
          <Link
            style={{ width: '100%' }}
            target='_blank'
            href={`https://yandex.com/maps/?ll=${data?.location?.long}%2C${data?.location?.lat}&mode=whatshere&whatshere%5Bpoint%5D=${data?.location?.long}%2C${data?.location?.lat}&z=14`}
          >
            <Button
              w={'100%'}
              variant={'primary'}
              fontSize={14}
              fontWeight={500}
            >
              {t('build_route')}
            </Button>
          </Link>
          <Link href={'/restaurants/' + data.slug} style={{ width: '100%' }}>
            <Button w='100%' variant='solid' fontSize={14} fontWeight={500}>
              {t('detailed')}
            </Button>
          </Link>
        </Flex>
      </Box>
    </Box>
  )
}

export default BranchCard
