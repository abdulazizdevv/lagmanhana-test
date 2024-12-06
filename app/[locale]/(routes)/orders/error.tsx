'use client' // Error components must be Client Components

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, Center, Text } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/_locales/client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState(404)
  const pathname = usePathname()
  const t = useI18n()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error({ error })

    // const fetchData = async () => {
    //   await getProductById(pathname?.split('/')?.[3], {
    //     order_source: 'website',
    //     only_delivery: true,
    //     only_self_pickup: false,
    //     branch_id: undefined,
    //     client_id: 'c12e0108-981f-422c-9c52-2451ff0a9f88',
    //     with_discounts: true,
    //   })
    //     .then((res) => console.log(res?.data))
    //     .catch((err) => {
    //       setStatus(err?.response?.status)
    //       setName(err?.response?.data?.Error?.message)
    //     })
    // }

    // fetchData()
  }, [error])

  return (
    <Center minH='80vh' flexDir='column'>
      <Text fontSize={{ base: '120px', md: '224px' }} fontWeight={900}>
        {status}
      </Text>
      <Text fontSize={{ base: 'xl', lg: '5xl' }} fontWeight={900}>
        {name}
      </Text>
      <Text
        fontSize={{ base: 'sm', lg: 'md' }}
        mx={2}
        mb={6}
        textAlign='center'
      >
        {error?.message}
      </Text>
      <Link href='/'>
        <Button size='lg' variant='primary'>
          {t('back_main_page')}
        </Button>
      </Link>
    </Center>
  )
}
