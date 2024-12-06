import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  UseDisclosureProps,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import BranchList from './BranchList'
import { Icon } from '@iconify/react/dist/iconify.js'
import { IBranch } from '@/_types'
import CMap from '../Map'
import { useI18n } from '@/_locales/client'
import BranchCard from './BranchCard'
import { useRouter } from 'next/navigation'
import BackIcon from '@/_assets/icons/BackIcon'

interface MapModalProps extends UseDisclosureProps {
  data: any
  mapRef: any
  branchData: any
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  handleSelectBranch: (e: any) => void
}

const MapModal = ({
  isOpen,
  onOpen,
  onClose,
  data,
  mapRef,
  branchData,
  handleSelectBranch,
}: MapModalProps) => {
  const [isFocus, setFocus] = useState(false)
  const [searchValue, onChangeValue] = useState('')
  const [lg] = useMediaQuery('(max-width: 960px)')
  const t = useI18n()
  const router = useRouter()
  const onConfirm = () => {
    router.push('/restaurants/' + branchData.slug)
  }

  return (
    <>
      <Modal size={'full'} isOpen={isOpen && lg} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={0}>
            <Box
              mt={2}
              zIndex={20}
              bgColor='transparent'
              border='1px solid #FFFFFF12'
              borderRadius='0 0 12px 12px'
              _dark={{ bgColor: 'paper.dark.500', borderColor: '#FFFFFF12' }}
              display='flex'
              flexDirection='column'
              height='100%'
              position='relative'
            >
              <Flex
                w='100%'
                flex={1}
                alignItems='center'
                gap={2}
                px={4}
                py={'6px'}
              >
                <IconButton
                  p={0}
                  display={{ base: 'flex', md: 'none' }}
                  aria-label='back'
                  justifyContent={'center'}
                  variant={'ghost'}
                  w={'48px'}
                  h={'48px'}
                  icon={<BackIcon color='black' />}
                  onClick={() => onClose()}
                />
                <Box flex={1}>
                  <BranchList onResultSelect={handleSelectBranch} />
                </Box>
              </Flex>

              <Stack height='100%'>
                <CMap
                  height='calc(100vh - 136px)'
                  mapRef={mapRef}
                  data={data}
                  onBranchSelect={(e) => handleSelectBranch(e)}
                />
              </Stack>

              <Flex
                flexDir={'column'}
                p={4}
                gap={2}
                mt='auto'
                bgColor='#fff'
                position={'fixed'}
                bottom={0}
                w={'100%'}
              >
                <BranchCard data={branchData} />

                <Button
                  width='full'
                  variant='primary'
                  isDisabled={Boolean(!branchData)}
                  onClick={onConfirm}
                >
                  {t('select')}
                </Button>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MapModal
