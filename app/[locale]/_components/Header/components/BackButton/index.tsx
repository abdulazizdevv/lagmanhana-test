import BackIcon from '@/_assets/icons/BackIcon'
import { IconButton, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

function BackButton() {
  const router = useRouter()
  const txtColor = useColorModeValue('#222222', '#FFFFFF')

  return (
    <IconButton
      aria-label='Open menu'
      icon={<BackIcon color={txtColor} />}
      variant='ghost'
      onClick={() => router.back()}
    />
  )
}

export default BackButton
