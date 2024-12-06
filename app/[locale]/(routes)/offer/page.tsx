'use client'
import { Container } from '@chakra-ui/react'
import loadable from '@loadable/component'

// export const metadata = {
//   alternates: {
//     canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/offer`,
//     languages: {
//       en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/offer`,
//       ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/offer`,
//       uz: `${process.env.NEXT_PUBLIC_DOMAIN}/offer`,
//     },
//   },
// }

const PublicOffer = loadable(() => import('@/_components/Pages/PublicOffer'))

export default function PublicOfferPage() {
  return (
    <>
      <Container sx={{ pt: 1, pb: 4 }}>
        <PublicOffer />
      </Container>
    </>
  )
}
