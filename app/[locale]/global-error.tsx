'use client' // Error components must be Client Components

import Link from 'next/link'
import { useEffect } from 'react'
import { Button, Center, HStack, Text } from '@chakra-ui/react'
import { useI18n } from './_locales/client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useI18n()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error({ error })
  }, [error])

  return (
    <html>
      <body>
        <Center minH='80vh' flexDir='column'>
          <Text fontSize={{ md: '224px' }} fontWeight={900}>
            404
          </Text>
          <Text fontSize={{ base: 'xl', lg: '5xl' }} fontWeight={900}>
            Страница не найдена
          </Text>
          <Text mb={6}>
            Страница, которую вы ищете, не существует или была перемещена.
          </Text>
          <HStack>
            <Button
              size='lg'
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              Попробуйте еще раз
            </Button>
            <Link href='/'>
              <Button size='lg' variant='primary'>
                {t('back_main_page')}
              </Button>
            </Link>
          </HStack>
        </Center>
      </body>
    </html>
  )
}
