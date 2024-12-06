import React, { FormEvent, useState } from 'react'
import customerService from '@/_services/customerService'
import { authActions } from '@/_store/auth/auth.slice'
import { IRedux } from '@/_types'
import { Box, Button, Card, Flex, Text, useToast } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'

import { useI18n } from '@/_locales/client'
import {
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useMediaQuery,
} from '@chakra-ui/react'
import ModalComponent from '@/_components/Modal'
import PhoneInput from 'react-phone-number-input/input'
import InputComponent from '@/_components/Input'

function Details() {
  const { user } = useSelector((state: IRedux) => state.auth)
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const dispatch = useDispatch()
  const toast = useToast()
  const t = useI18n()

  const [isOpenModal, setOpenModal] = useState(false)
  const [formData, setFormData] = useState({
    name:
      user?.name.split(' ')[0] +
      ' ' +
      (user?.name.split(' ')[1] ? user?.name.split(' ')[1] : ''),
    last_name: user?.name.split(' ')[1] ? user?.name.split(' ')[1] : '',
    date_of_birth: user?.date_of_birth ? user?.date_of_birth : '',
    phone: user?.phone,
  })

  const { name, phone, last_name, date_of_birth } = formData

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const data = {
      phone: phone,
      date_of_birth: date_of_birth || null,
      name: name + last_name,
    }

    await customerService.update(user?.id, data).then((res) => {
      dispatch(
        authActions.updateUser({
          // name: last_name ? name + ' ' + last_name : name,
          name: name,
          date_of_birth: date_of_birth,
        })
      )
      toast({
        title: t('successfully_edit'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
      setOpenModal(false)
    })
  }

  return (
    <>
      <Box>
        <Flex justifyContent={'space-between'} mb={5}>
          <Text fontSize={20} fontWeight={700}>
            {name}
          </Text>
          <Button
            // display={{ base: 'none', md: 'flex' }}
            onClick={() => setOpenModal(true)}
            fontSize={14}
            fontWeight={500}
            bg={'#F2F4F7'}
            variant={'ghost'}
          >
            {t('change')}
          </Button>
        </Flex>
        <Flex gap={4} justify={{ base: 'space-between', md: 'flex-start' }}>
          <Box>
            <Text color='gray.500' mb={1}>
              {t('phone_number')}
            </Text>
            <Text>{phone}</Text>
          </Box>
          <Box>
            <Text color='gray.500' mb={1}>
              {t('birthday')}
            </Text>
            <Text>{date_of_birth ? date_of_birth : '-'}</Text>
          </Box>
        </Flex>
      </Box>
      <ModalComponent
        size='lg'
        isOpen={isOpenModal}
        title={t('edit_data')}
        onClose={() => setOpenModal(false)}
      >
        <form onSubmit={onSubmit}>
          <Flex flexDirection={'column'} gap={4}>
            <Box>
              <FormLabel>{t('full_name')}</FormLabel>
              <InputComponent
                value={name}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    name: e,
                  }))
                }
                placeholder={t('name')}
                // variant='outline'
              />
            </Box>
            {/* <Box>
              <FormLabel>{t('last_name')}</FormLabel>
              <InputComponent
                value={last_name}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    last_name: e,
                  }))
                }
                placeholder={t('last_name')}
              />
            </Box> */}
            <Box>
              <FormLabel>{t('birthday')}</FormLabel>
              <InputComponent
                value={date_of_birth}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    date_of_birth: e,
                  }))
                }
                type='date'
                // bg={'#'}
                // color={'#fff'}
                placeholder={t('birthday')}
                // _focusVisible={{
                //   borderColor: '#fff',
                // }}
              />
              {/* <Calendar onChange={onChange} value={value} /> */}
            </Box>
            <Box>
              <FormLabel>{t('phone_number')}</FormLabel>
              <Input
                readOnly
                value={phone}
                placeholder={t('phone_number')}
                as={PhoneInput}
                variant='outline'
                color={'gray.200'}
                focusBorderColor='#fff'
              />
            </Box>
            <Button
              py={'14px'}
              px={'38px'}
              height={'48px'}
              width={'fit-content'}
              alignSelf={'end'}
              bg={'primary.500'}
              variant={'primary'}
              mt={'8px'}
              borderRadius={'8px'}
              type='submit'
              fontSize={14}
              fontWeight={500}
            >
              {t('save')}
            </Button>
          </Flex>
        </form>
      </ModalComponent>
    </>
  )
}

export default Details
