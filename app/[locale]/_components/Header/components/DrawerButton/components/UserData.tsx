'use client'
import CloseIcon from '@/_assets/icons/CloseIcon'
import LogOut from '@/_assets/icons/LogOut'
import UserIcon from '@/_assets/icons/user'
import { useI18n } from '@/_locales/client'
import { Box, Button, Flex, HStack, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import User from '../../User'
import { useSelector } from 'react-redux'
import { IRedux } from '@/_types'
import { Icon } from '@iconify/react/dist/iconify.js'

const UserData = ({ onClose, isAuth, setIsAuth }: any) => {
  const { user } = useSelector((state: IRedux) => state.auth)

  const t = useI18n()
  return (
    <HStack justifyContent='space-between' width='100%' cursor={'pointer'}>
      <Flex alignItems='center' gap={2}>
        <IconButton
          aria-label='user'
          borderRadius={'12px'}
          icon={
            <Icon icon='solar:user-bold-duotone' width='24px' height='24px' />
          }
        />
        {/* <Icon icon='solar:user-bold-duotone' width='1.2em' height='1.2em' /> */}
        <Box>
          <Text fontWeight={500} fontSize={16}>
            {user.name}
          </Text>
          <Text fontWeight={400} color={'#000000AD'} fontSize={14}>
            {user.phone}
          </Text>
        </Box>
      </Flex>

      <IconButton
        aria-label='Open menu'
        icon={<CloseIcon color={'gray'} />}
        variant='ghost'
        onClick={() => {
          onClose()
          setIsAuth(false)
        }}
        bg='#fff'
        borderRadius='full'
        me={-70}
      />
    </HStack>
  )
}

export default UserData
