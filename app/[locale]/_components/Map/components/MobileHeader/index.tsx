import { useI18n } from '@/_locales/client'
import { saveDeliveryType } from '@/_store/common/common.slice'
import { Button, HStack, IconButton } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDispatch, useSelector } from 'react-redux'
import { IRedux } from '@/_types'

function MobileHeader({ onClose = () => {} }: { onClose: () => void }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const { deliveryType } = useSelector((state: IRedux) => state.common)

  return (
    <HStack px={4} py={2}>
      <IconButton
        variant='ghost'
        onClick={onClose}
        aria-label='Close the map'
        icon={<Icon icon='material-symbols:arrow-back-rounded' fontSize={24} />}
      />
      <Button
        flex={1}
        h='36px'
        borderColor={deliveryType === 'delivery' ? 'primary.400' : undefined}
        color={deliveryType === 'delivery' ? 'primary.400' : undefined}
        variant='outline'
        onClick={() => dispatch(saveDeliveryType('delivery'))}
      >
        {t('delivery')}
      </Button>
      <Button
        flex={1}
        h='36px'
        borderColor={deliveryType === 'self-pickup' ? 'primary.400' : undefined}
        color={deliveryType === 'self-pickup' ? 'primary.400' : undefined}
        variant='outline'
        onClick={() => dispatch(saveDeliveryType('self-pickup'))}
      >
        {t('takeaway')}
      </Button>
    </HStack>
  )
}

export default MobileHeader
