import Image from 'next/image'
import styles from './style.module.scss'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import { useCurrentLocale } from '@/_locales/client'
import { Box, Stack, Text } from '@chakra-ui/react'

function Ingredient({ data }: { data: any }) {
  const currentLocale = useCurrentLocale()

  return (
    <Stack w='fit-content'>
      <Box position='relative' width='50px' height='50px'>
        <Image
          src={data?.image ? process.env.BASE_URL + data?.image : defaultImage}
          alt={data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
          style={{ objectFit: 'contain' }}
          fill
        />
      </Box>
      <Text fontSize={{ base: 10, md: 14 }}>
        {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
      </Text>
    </Stack>
  )
}

export default Ingredient
