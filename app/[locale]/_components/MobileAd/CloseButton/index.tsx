import CloseIcon from '@/_assets/icons/CloseIcon'
import { sessionActions } from '@/_store/session/session.slice'
import { IconButton } from '@chakra-ui/react'
import React from 'react'
import { useDispatch } from 'react-redux'

function CloseButton() {
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(sessionActions.closeAd())
  }

  return (
    <IconButton
      size="xs"
      variant="ghost"
      aria-label="Close the mobile ad"
      onClick={onClose}
      icon={<CloseIcon />}
    />
  )
}

export default CloseButton
