import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'
interface IProps {
  size: string
  isOpen: boolean
  title: any
  children: ReactNode
  onClose: () => void
}
const ModalComponent = ({ size, isOpen, onClose, title, children }: IProps) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay bg='#00000080' backdropFilter='blur(3px)' />
      <ModalContent mx={4}>
        <ModalHeader px={4}>{title}</ModalHeader>
        <ModalBody px={4}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ModalComponent
