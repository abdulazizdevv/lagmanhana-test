'use client'
import ModalComponent from '@/_components/Modal'
import { useI18n } from '@/_locales/client'
import { request } from '@/_services/http-client'
import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import axios from 'axios'
import React, { useState } from 'react'
import PhoneInput from 'react-phone-number-input/input'

const CreateModal = ({ setIsOpenModal, isOpenModal, vacancyId }: any) => {
  const [fileName, setFileName] = useState('')
  const [fileNameLoader, setFileNameLoader] = useState(false)
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const t = useI18n()
  const toast = useToast()
  const cancelRef = React.useRef<any>()

  const [formData, setFormData] = useState({
    description: '',
    file: '',
    full_name: '',
    phone_number: '',
    status: '',
    vacancy_id: '',
  })

  const handleFileUpload = async (e: any) => {
    setFileNameLoader(true)
    let file = e.target.files[0]

    const data = new FormData()
    data.append('file', file)

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v2/upload`,
      data,
      {
        headers: {
          'Content-Type': 'mulpipart/form-data',
          Shipper: process.env.NEXT_PUBLIC_SHIPPER_ID,
        },
      }
    )

    if (res.status === 200) {
      setTimeout(() => {
        setFileName(file.name)
      }, 1000)
      setFormData((prevData) => ({
        ...prevData,
        file: res.data?.filename,
      }))
    }
  }

  const handleSubmit = async (evt: any) => {
    evt.preventDefault()
    let data = {
      ...formData,
      status: 'new',
      vacancy_id: vacancyId,
    }

    const create = await request.post('/v2/vacancy-candidate', data)
    if (create.status === 200) {
      toast({
        title: 'Заявка отправлена',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'subtle',
      })
      setIsOpenModal(false)
      setFormData((prevData) => ({
        ...prevData,
        description: '',
        file: '',
        full_name: '',
        phone_number: '',
        status: '',
        vacancy_id: '',
      }))
    }
  }
  const handleRemoveFile = () => {
    setFileName('')
    setFileNameLoader(false)
  }
  return (
    <>
      <ModalComponent
        size='xl'
        isOpen={isOpenModal && !isMobile}
        title={t('send_request')}
        onClose={() => setIsOpenModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <Flex flexDirection={'column'} gap={4}>
            <Box>
              <FormLabel>{t('full_name')}</FormLabel>
              <Input
                focusBorderColor='primary.400'
                value={formData.full_name}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    full_name: e.target.value,
                  }))
                }
                placeholder={t('name')}
              />
            </Box>
            <Box>
              <FormLabel>{t('phone')}</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents='none'>
                  <Icon icon='hugeicons:smart-phone-01' fontSize='24px' />
                </InputLeftElement>
                <Input
                  focusBorderColor='primary.400'
                  placeholder={t('phone_number')}
                  onChange={(e: any) =>
                    setFormData((prevData: any) => ({
                      ...prevData,
                      phone_number: e,
                    }))
                  }
                  as={PhoneInput}
                  value={formData?.phone_number}
                />
              </InputGroup>
            </Box>
            <Box>
              <FormLabel>Комментарий</FormLabel>
              <Textarea
                focusBorderColor='primary.400'
                value={formData.description}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
                placeholder={'Комментарий'}
              />
            </Box>
            <Box p={'16px'} borderRadius={'16px'} border={'1px dashed gray'}>
              {!fileNameLoader && (
                <>
                  <label htmlFor='file'>
                    <Flex
                      justifyContent={'center'}
                      alignItems='center'
                      cursor={'pointer'}
                      gap='16px'
                    >
                      <Flex
                        justifyContent={'center'}
                        alignItems='center'
                        gap={2}
                      >
                        <Icon
                          icon='uiw:cloud-upload'
                          width='24px'
                          height='24px'
                          style={{ color: '#000' }}
                        />
                        <Text color='primary.500' fontWeight={500}>
                          {t('select_file')}
                        </Text>
                      </Flex>
                      <input
                        id='file'
                        type='file'
                        style={{ display: 'none' }}
                        onChange={(e: any) => handleFileUpload(e)}
                      />
                    </Flex>
                  </label>
                  <Box py={'16px'}>
                    <hr />
                  </Box>
                </>
              )}
              {fileNameLoader && (
                <Flex justifyContent={'space-between'}>
                  <Flex gap={2} alignItems={'center'}>
                    {fileName ? (
                      <Icon
                        icon='heroicons:check-16-solid'
                        width='24px'
                        height='24px'
                        style={{ color: 'green' }}
                      />
                    ) : (
                      <Spinner />
                    )}
                    <Text fontWeight={500} color={'#A5A5A5'}>
                      {fileName}
                    </Text>
                  </Flex>
                  <IconButton
                    variant={'ghost'}
                    aria-label='delete-btn'
                    onClick={handleRemoveFile}
                    icon={
                      <Icon
                        icon='mi:delete'
                        width='20px'
                        height='20px'
                        style={{ color: '#A5A5A5' }}
                      />
                    }
                  />
                </Flex>
              )}
            </Box>
            <Button
              mt={'8px'}
              variant='primary'
              type='submit'
              fontSize={14}
              fontWeight={500}
              height={'48px'}
              isDisabled={!formData?.phone_number && !formData?.file}
            >
              {t('confirm')}
            </Button>
          </Flex>
        </form>
      </ModalComponent>
      <Modal
        isOpen={isOpenModal && isMobile}
        onClose={() => setIsOpenModal(false)}
        isCentered
      >
        <ModalOverlay bg='blackAlpha.500' backdropFilter='blur(5px)' />
        <ModalContent
          borderRadius='24px 24px 0 0'
          marginBottom={0}
          maxW='100vw'
          p={3}
        >
          <Box
            width={12}
            height={1}
            bg={'#A5A5A5'}
            borderRadius={99}
            mx='auto'
          />
          <ModalBody p={1}>
            <Text fontSize={22} fontWeight={600} mb={4}>
              {t('send_request')}
            </Text>
            <form onSubmit={handleSubmit}>
              <Flex flexDirection={'column'} gap={4}>
                <Box>
                  <FormLabel>{t('full_name')}</FormLabel>
                  <Input
                    focusBorderColor='primary.400'
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        full_name: e.target.value,
                      }))
                    }
                    placeholder={t('name')}
                  />
                </Box>
                <Box>
                  <FormLabel>{t('phone')}</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                      <Icon icon='hugeicons:smart-phone-01' fontSize='24px' />
                    </InputLeftElement>
                    <Input
                      focusBorderColor='primary.400'
                      placeholder={t('phone_number')}
                      onChange={(e: any) =>
                        setFormData((prevData: any) => ({
                          ...prevData,
                          phone_number: e,
                        }))
                      }
                      as={PhoneInput}
                      value={formData?.phone_number}
                    />
                  </InputGroup>
                </Box>
                {/* <Box>
                  <FormLabel>Комментарий</FormLabel>
                  <Textarea
                    focusBorderColor='primary.400'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        description: e.target.value,
                      }))
                    }
                    placeholder={'Комментарий'}
                  />
                </Box> */}
                <Box
                  p={'16px'}
                  borderRadius={'16px'}
                  border={'1px dashed gray'}
                >
                  {!fileNameLoader && (
                    <>
                      <label htmlFor='file'>
                        <Flex
                          justifyContent={'center'}
                          alignItems='center'
                          cursor={'pointer'}
                          gap='16px'
                        >
                          <Flex
                            justifyContent={'center'}
                            alignItems='center'
                            gap={2}
                          >
                            <Icon
                              icon='uiw:cloud-upload'
                              width='24px'
                              height='24px'
                              style={{ color: '#000' }}
                            />
                            <Text color='primary.500' fontWeight={500}>
                              {t('select_file')}
                            </Text>
                          </Flex>
                          <input
                            id='file'
                            type='file'
                            style={{ display: 'none' }}
                            onChange={(e: any) => handleFileUpload(e)}
                          />
                        </Flex>
                      </label>
                      <Box py={'16px'}>
                        <hr />
                      </Box>
                    </>
                  )}
                  {fileNameLoader && (
                    <Flex justifyContent={'space-between'}>
                      <Flex gap={2} alignItems={'center'}>
                        {fileName ? (
                          <Icon
                            icon='heroicons:check-16-solid'
                            width='24px'
                            height='24px'
                            style={{ color: 'green' }}
                          />
                        ) : (
                          <Spinner />
                        )}
                        <Text fontWeight={500} color={'#A5A5A5'}>
                          {fileName}
                        </Text>
                      </Flex>
                      <IconButton
                        variant={'ghost'}
                        aria-label='delete-btn'
                        onClick={handleRemoveFile}
                        icon={
                          <Icon
                            icon='mi:delete'
                            width='20px'
                            height='20px'
                            style={{ color: '#A5A5A5' }}
                          />
                        }
                      />
                    </Flex>
                  )}
                </Box>
                <Button
                  py={'10px'}
                  px={'35px'}
                  width={'100%'}
                  alignSelf={'end'}
                  mt={'8px'}
                  borderRadius={'8px'}
                  type='submit'
                  variant='primary'
                  fontSize={14}
                  fontWeight={500}
                  height={'48px'}
                  isDisabled={!formData?.phone_number && !formData?.file}
                >
                  {t('confirm')}
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateModal
