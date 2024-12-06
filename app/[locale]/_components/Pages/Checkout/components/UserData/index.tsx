import { useI18n } from '@/_locales/client'
import customerService from '@/_services/customerService'
import { authActions } from '@/_store/auth/auth.slice'
import { IRedux } from '@/_types'
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const UserData = () => {
  const t = useI18n()
  const { user } = useSelector((state: IRedux) => state.auth)
  const dispatch = useDispatch()
  const [username, setUserName] = useState(user?.name)
  const [edit, setEdit] = useState(true)
  const handleChangeName = (value: string) => {
    setUserName(value)
  }
  const handleEdit = async () => {
    const data = {
      phone: user?.phone,
      date_of_birth: user?.date_of_birth || null,
      name: username,
    }

    !edit &&
      username !== user?.name &&
      (await customerService.update(user?.id, data).then(() => {
        dispatch(
          authActions.updateUser({
            name: username,
            date_of_birth: data?.date_of_birth,
          })
        )
      }))
    setEdit(!edit)
  }
  return (
    <Box>
      <Text fontSize='xl' fontWeight={700}>
        {t('personal_data')}
      </Text>
      <Flex
        flexWrap={{ base: 'wrap', md: 'nowrap' }}
        gap={4}
        mt={{ base: 2, md: 4 }}
      >
        <Box w={'100%'}>
          <FormLabel fontSize={14} fontWeight={400}>
            {t('full_name')}
          </FormLabel>
          <InputGroup w='100%'>
            <Input
              name='username'
              placeholder='Username'
              border='1px solid #D0D5DD'
              borderRadius='8px'
              boxShadow='0px 1px 2px 0px #1018280D'
              // _focus={{
              //   outline: '#7E5FA6',
              //   borderColor: '#7E5FA6',
              //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
              // }}
              // _active={{
              //   outline: '#7E5FA6',
              //   borderColor: '#7E5FA6',
              //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
              // }}
              value={username}
              autoComplete='off'
              autoCorrect='off'
              w='100%'
              isDisabled={edit}
              onChange={(e) => {
                handleChangeName(e.target.value)
              }}
            />
            <InputRightElement width='50px'>
              {/* You can add any additional elements or buttons here */}
              <Button variant={'none'} onClick={() => handleEdit()}>
                {edit ? (
                  <Icon icon='bx:pencil' width='1.2em' height='1.2em' />
                ) : (
                  <Icon icon='mynaui:check' width='25px' height='25px' />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>

        <InputGroup display={'flex'} flexDir={'column'}>
          <FormLabel fontSize={14} fontWeight={400}>
            {t('phone_number')}
          </FormLabel>
          <Input
            name={'phone'}
            // _focus={{
            //   outline: '#7E5FA6',
            //   borderColor: '#7E5FA6',
            //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
            // }}
            // _active={{
            //   outline: '#7E5FA6',
            //   borderColor: '#7E5FA6',
            //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
            // }}
            boxShadow={'0px 1px 2px 0px #1018280D'}
            border={'1px solid #D0D5DD'}
            placeholder={t('phone_number')}
            w={'100%'}
            value={user?.phone}
            borderRadius={'8px'}
            isDisabled={true}
          />
        </InputGroup>
      </Flex>
    </Box>
  )
}

export default UserData
