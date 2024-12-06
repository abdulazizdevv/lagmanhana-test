import { SplideSlide } from '@splidejs/react-splide'

import MultipleSlide from '@/_components/MultipleSlide'
import Card from '@/_components/Card'
import { useI18n } from '@/_locales/client'
import { IProduct } from '@/_types'
import styles from '../../style.module.scss'
import { Box, Text } from '@chakra-ui/react'
import { memo } from 'react'

function Recommended({ favourites }: { favourites: IProduct[] }) {
  const t = useI18n()
  return (
    <Box mt={6}>
      <Text fontSize='xl' fontWeight={700} mb={4}>
        {t('recommended')}{' '}
      </Text>
      <MultipleSlide
        options={{ gap: '1.5rem', arrows: favourites?.length > 4 }}
      >
        {favourites?.map((item, idx) => (
          <SplideSlide key={item?.id}>
            <Card
              h1={t('recommended')}
              index={idx + 1}
              key={item.id}
              product={item}
            />
          </SplideSlide>
        ))}
      </MultipleSlide>
    </Box>
  )
}

export default memo(Recommended)
