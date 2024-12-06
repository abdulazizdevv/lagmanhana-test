import { useI18n } from '@/_locales/client'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from '@chakra-ui/react'
import React from 'react'

function ZoneAlert() {
  const t = useI18n()
  
  return (
    <Alert status='error' addRole={true} my={3} borderRadius='lg'>
      <AlertIcon />
      <Box>
        <AlertTitle>{t('address_not_in_service_area')}.</AlertTitle>
        <AlertDescription fontSize='sm'>
          {t('you_can_order_pickup_or_specify_another_address')}
        </AlertDescription>
      </Box>
    </Alert>
  )
}

export default ZoneAlert
