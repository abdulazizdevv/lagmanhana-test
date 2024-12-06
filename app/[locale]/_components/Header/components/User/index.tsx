'use client'

import { useState } from 'react'
import AuthDialog from '@/_components/AuthDialog'
import { Button, Divider, Flex, useColorModeValue } from '@chakra-ui/react'
import {
  Box,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { authActions } from '@/_store/auth/auth.slice'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from '@/_locales/client'
import Link from 'next/link'
import { IRedux } from '@/_types'
import { Icon } from '@iconify/react/dist/iconify.js'
import ProfileIcon from '@/_assets/icons/ProfileIcon'
import BagIcon from '@/_assets/icons/BagIcon'

interface IMenuOptions {
  label: 'profile' | 'my_order'
  link: string
  img: any
}

const options: IMenuOptions[] = [
  { img: <ProfileIcon />, label: 'profile', link: '/profile' },
  {
    img: <BagIcon width='16' height='16' color='#344054' />,
    label: 'my_order',
    link: '/orders',
  },
]

function User() {
  const [isAuth, setIsAuth] = useState(false)
  const { user } = useSelector((state: IRedux) => state.auth)

  const t = useI18n()

  return (
    <>
      {user ? (
        <UserDropdown />
      ) : (
        <Button
          bg={{ base: 'paper.light.400', md: 'gray.300' }}
          color={{ base: 'paper.light.900', md: '#000' }}
          variant={'ghost'}
          borderRadius={'12px'}
          onClick={() => setIsAuth(true)}
          fontWeight={500}
          fontSize={16}
          height={{ base: '36px', md: '40px' }}
          py={'8.5px'}
          px={'20px'}
        >
          {t('login')}
        </Button>
      )}
      <AuthDialog isOpen={isAuth} onClose={() => setIsAuth(false)} />
    </>
  )
}

export const UserDropdown = () => {
  const { isOpen, onToggle, onClose } = useDisclosure()

  const t = useI18n()
  const router = useRouter()
  const dispatch = useDispatch()

  const handleRemoveData = () => {
    dispatch(authActions.logout())
    router.push('/')
  }

  const txtColor = useColorModeValue('#4b4a4a', 'primary.500')

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement='bottom-end'>
      <PopoverTrigger>
        <IconButton
          aria-label='user'
          borderRadius={'12px'}
          onClick={onToggle}
          icon={
            <Icon icon='solar:user-bold-duotone' width='24px' height='24px' />
          }
        />
      </PopoverTrigger>
      <PopoverContent
        mt={1}
        width='240px'
        bgColor='white'
        overflow='hidden'
        borderRadius='16px'
        border='1px solid #00000012'
        _dark={{ bgColor: 'paper.dark.500', borderColor: '#FFFFFF12' }}
      >
        <PopoverBody p={0} borderRadius='16px'>
          <Stack spacing={0}>
            {options.map((item: IMenuOptions) => (
              <Link href={item?.link} key={item?.label}>
                <Flex
                  p={'12px'}
                  _hover={{ bg: 'paper.light.300' }}
                  fontWeight={500}
                  fontSize={14}
                  cursor={'pointer'}
                  color={'gray.700'}
                  onClick={() => {
                    onClose()
                  }}
                  gap={2}
                  alignItems={'center'}
                >
                  {item?.img}
                  {t(item?.label)}
                </Flex>
              </Link>
            ))}
            <Divider borderColor={'gray.300'} />
            <Flex
              p={'12px'}
              _hover={{ bg: 'paper.light.300' }}
              fontWeight={500}
              fontSize={14}
              cursor={'pointer'}
              onClick={handleRemoveData}
              gap={2}
              alignItems={'center'}
            >
              <Icon icon='mynaui:logout' width='1.2em' height='1.2em' />
              <Text>{t('go_out')}</Text>
            </Flex>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default User
