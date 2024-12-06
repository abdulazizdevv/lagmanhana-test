import { useCurrentLocale, useI18n } from '@/_locales/client'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import Image from 'next/image'

interface PopupAlertProps {
  open: boolean
  data: any
  handleClose: () => void
}

const PopupAlert: React.FC<PopupAlertProps> = ({ open, data, handleClose }) => {
  const currentLocale = useCurrentLocale()
  const t = useI18n()
  return (
    <Modal isCentered isOpen={open} onClose={handleClose} size={'lg'}>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px)' />
      <ModalContent mx={4}>
        <ModalBody p={2}>
          <Box
            position={'relative'}
            borderRadius={'12px'}
            overflow={'hidden'}
            aspectRatio={'2/1'}
            p={2}
          >
            <Image
              src={process.env.BASE_URL + data?.image}
              alt={data?.title}
              // alt={t('seo.h1_main') + ` - photo 1`}
              priority={true}
              style={{
                // objectFit: 'cover',
                objectPosition: 'center',
              }}
              fill
              loading='eager'
            />
            <ModalCloseButton
              onClick={handleClose}
              color={'paper.light.50'}
              bg={'#fff'}
              borderRadius={'50%'}
            />
          </Box>
          <Box>
            <Text fontSize={28} mb={5} textAlign={'center'} fontWeight={700}>
              {data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </Text>
            <Text
              fontSize={16}
              color={'#cfcdcd'}
              textAlign={'center'}
              fontWeight={600}
            >
              {data?.about?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            </Text>
            <Button width={'100%'} mt={5}>
              Заказать🍱
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PopupAlert
