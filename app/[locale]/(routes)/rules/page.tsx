'use client'
import React from 'react'
import type { Metadata } from 'next'
import loadable from '@loadable/component'
import { Container } from '@chakra-ui/react'
// export const metadata: Metadata = {
//   alternates: {
//     canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/rules`,
//     languages: {
//       en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/rules`,
//       ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/rules`,
//       uz: `${process.env.NEXT_PUBLIC_DOMAIN}/rules`,
//     },
//   },
// }
const PrivacyPublic = loadable(
  () => import('@/_components/Pages/PrivacyPolicy')
)

const PrivacyPolice = () => {
  return (
    <Container sx={{ pt: 1, pb: 4 }}>
      <PrivacyPublic />
    </Container>
  )
}

export default PrivacyPolice
