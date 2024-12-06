'use client'

import { memo, useMemo } from 'react'
import { Box, Button, Divider, SimpleGrid } from '@chakra-ui/react'
import { useChangeLocale, useCurrentLocale, useI18n } from '@/_locales/client'
import ru from '@/_assets/icons/ru.svg'
import uz from '@/_assets/icons/uzbekistán.svg'
import kz from '@/_assets/icons/kz.svg'
import en from '@/_assets/icons/en.svg'
import Image from 'next/image'

const langs: { value: 'uz' | 'ru' | 'en' | 'kz'; label: string }[] = [
  { value: 'kz', label: 'Қазақ' },
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
]

function Language() {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()
  const t = useI18n()
  const onChange = (value: 'uz' | 'ru' | 'en' | 'kz') => {
    changeLocale(value)
  }

  return (
    <Box display={{ base: 'block', lg: 'none' }}>
      <Divider mb={2} />
      <SimpleGrid
        // px={4}
        mb={2}
        columns={3}
        spacing={2}
        display={{
          base: 'grid',
          lg: 'none',
        }}
      >
        {/* <Button
          border={locale === 'uz' ? '1px solid #1570EF' : '1px solid #ffffff'}
          variant={'outline'}
          onClick={() => onChange('uz')}
          bg={'#F2F4F7'}
        >
          <Image
            src={uz}
            alt={t('seo.h1_main') + ` - photo 2`}
            width={24}
            height={24}
          />
        </Button> */}
        <Button
          border={locale === 'kz' ? '1px solid #1570EF' : '1px solid #ffffff'}
          onClick={() => onChange('kz')}
          variant={'outline'}
          bg={'#F2F4F7'}
        >
          <Image src={kz} alt='kz' width={24} height={24} />
        </Button>
        <Button
          border={locale === 'ru' ? '1px solid #1570EF' : '1px solid #ffffff'}
          variant={'outline'}
          onClick={() => onChange('ru')}
          bg={'#F2F4F7'}
        >
          <Image src={ru} alt={'ru'} width={24} height={24} />
        </Button>

        <Button
          border={locale === 'en' ? '1px solid #1570EF' : '1px solid #ffffff'}
          variant={'outline'}
          onClick={() => onChange('en')}
          bg={'#F2F4F7'}
        >
          <Image src={en} alt={'en'} width={24} height={24} />
        </Button>
      </SimpleGrid>
    </Box>
  )
}

export default memo(Language)
