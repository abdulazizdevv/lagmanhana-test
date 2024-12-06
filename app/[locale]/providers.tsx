'use client'

import React from 'react'
import { ChakraProvider, Stack } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '@/_store/index'
import { I18nProviderClient } from '@/_locales/client'
import { usePathname } from 'next/navigation'
import { theme } from './_theme'

const queryClient = new QueryClient()

function Providers({
  locale,
  children,
}: {
  locale: string
  children: React.ReactNode
}) {
  const pathName = usePathname()
  const isAboutPage = pathName.includes('about')
  const backgroundColor = isAboutPage ? '#fff' : '#F2F4F7'

  return (
    <Provider store={store}>
      <I18nProviderClient locale={locale}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Stack gap={0} minH='100vh' bg={backgroundColor}>
              {children}
            </Stack>
          </ChakraProvider>
        </QueryClientProvider>
      </I18nProviderClient>
    </Provider>
  )
}

export default Providers
