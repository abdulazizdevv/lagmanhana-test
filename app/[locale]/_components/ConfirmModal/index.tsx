'use client'

import { useI18n } from '@/_locales/client'
import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

interface IDialog {
  isOpen: boolean
  onClose: () => void
  title?: string
  onConfirm: () => void
  description?: string
  children?: React.ReactNode
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  onConfirm,
  description,
  children,
}: IDialog) {
  const t = useI18n()
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius='20px' mx={4}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{description}</Text>
          {children}
        </ModalBody>

        <ModalFooter justifyContent='center'>
          <Button
            colorScheme='gray'
            mr={3}
            size='lg'
            onClick={onClose}
            flex={1}
          >
            {t('no')}
          </Button>
          <Button
            variant='primary'
            size='lg'
            onClick={() => {
              onConfirm()
              onClose()
            }}
            flex={1}
          >
            {t('yes')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
