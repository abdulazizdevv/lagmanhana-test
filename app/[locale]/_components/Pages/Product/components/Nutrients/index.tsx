import React from 'react'
import {
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'
import { IProduct } from '@/_types'
import { useI18n } from '@/_locales/client'
import ExclamationMark from '@/_assets/icons/ExclamationMark'

function Nutrients({ data }: { data: IProduct }) {
  const t = useI18n()

  if (!data?.weight) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label='Macronutrients'
          // position='absolute'
          top={0}
          right={0}
          variant='ghost'
          icon={<ExclamationMark />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow bgColor={'#3A3A3C'} />
        <PopoverBody bg={'#3A3A3C'} borderRadius={'8px'}>
          {data?.weight > 0 && (
            <Flex color={'#fff'} justifyContent={'space-between'}>
              {t('weight')}:{' '}
              <Text as={'span'}>
                {data?.weight} {t('gram_symbol')}
              </Text>
            </Flex>
          )}
          {data?.fats > 0 && (
            <Flex color={'#fff'} justifyContent={'space-between'}>
              {t('fats')}:{' '}
              <Text as={'span'}>
                {data?.fats} {t('gram_symbol')}
              </Text>
            </Flex>
          )}
          {data?.proteins > 0 && (
            <Flex color={'#fff'} justifyContent={'space-between'}>
              {t('proteins')}:{' '}
              <Text as={'span'}>
                {data?.proteins} {t('gram_symbol')}
              </Text>
            </Flex>
          )}
          {data?.carbohydrates > 0 && (
            <Flex color={'#fff'} justifyContent={'space-between'}>
              {t('carbohydrates')}:{' '}
              <Text as={'span'}>
                {data?.carbohydrates} {t('gram_symbol')}
              </Text>
            </Flex>
          )}
          {data?.energy > 0 && (
            <Flex color={'#fff'} justifyContent={'space-between'}>
              {t('kcal')}: <Text as={'span'}>{data?.energy}</Text>
            </Flex>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
  return <div>Nutrients</div>
}

export default Nutrients
