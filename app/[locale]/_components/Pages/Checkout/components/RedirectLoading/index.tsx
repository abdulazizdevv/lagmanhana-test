import React from 'react'
import { Center, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import Loading from '@/_components/Loading'

function RedirectLoading({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} size='sm' isCentered>
      <ModalOverlay bg='#aaa9a980' backdropFilter='blur(3px)' />
      <ModalContent bg='transparent' boxShadow='none'>
        <Center>
          <Loading />
        </Center>
      </ModalContent>
    </Modal>
  )
}

export default RedirectLoading
