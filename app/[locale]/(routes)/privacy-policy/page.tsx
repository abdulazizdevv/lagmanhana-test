'use client'
import { Container } from '@chakra-ui/react'
import loadable from '@loadable/component'

const PrivacyPublic = loadable(
  () => import('@/_components/Pages/PrivacyPolicy')
)

export default function PrivacyPolicePage() {
  return (
    <>
      <Container sx={{ pt: 1, pb: 4 }}>
        <PrivacyPublic />
      </Container>
    </>
  )
}
