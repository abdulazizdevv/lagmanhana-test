import CloseIcon from '@/_assets/icons/CloseIcon'
import LogOut from '@/_assets/icons/LogOut'
import { useI18n } from '@/_locales/client'
import { Box, Button, Flex, HStack, IconButton, Text } from '@chakra-ui/react'
import React from 'react'

const LoginBtn = ({ onClose, isAuth, setIsAuth }: any) => {
  const t = useI18n()
  return (
    <Flex justifyContent={'space-between'}>
      <HStack
        justifyContent='space-between'
        width='100%'
        cursor={'pointer'}
        onClick={() => {
          setIsAuth(true)
          onClose()
        }}
      >
        <Flex alignItems='center' gap={2}>
          <IconButton aria-label='logout' icon={<LogOut />} />
          <Text fontWeight={500} fontSize={16}>
            {t('your_are_logged')}
          </Text>
        </Flex>
        <Button
          bg={'primary.500'}
          variant={'outlined'}
          fontWeight={500}
          borderRadius={'12px'}
          onClick={() => setIsAuth(true)}
        >
          {t('login')}
        </Button>
      </HStack>
      <IconButton
        aria-label='Open menu'
        icon={<CloseIcon color={'gray'} />}
        variant='ghost'
        onClick={onClose}
        bg='#fff'
        borderRadius='full'
        me={-65}
      />
    </Flex>
  )
}

export default LoginBtn
