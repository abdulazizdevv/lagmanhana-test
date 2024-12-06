import React, { useState } from 'react'
import {
  Button,
  Card,
  Divider,
  Flex,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useI18n } from '@/_locales/client'
import { useDispatch, useSelector } from 'react-redux'
import {
  createPoint,
  openPoint,
  removePoint,
  setMapModalLg,
} from '@/_store/common/common.slice'
import { IRedux } from '@/_types'
import ModalComponent from '@/_components/Modal'

const Addresses = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const { points } = useSelector((state: IRedux) => state.common)
  const [isOpen, setIsOpen] = useState({
    address: '',
    open: false,
    id: '',
  })

  return (
    <Card shadow={'none'} borderRadius='2xl' gap={5} p={3}>
      <Flex justifyContent={'space-between'}>
        <Text fontSize={24} fontWeight={700}>
          {t('addresses')}
        </Text>
        <Button
          // display={{ base: 'none', md: 'flex' }}
          onClick={() => {
            dispatch(setMapModalLg(true))
            dispatch(createPoint())
          }}
          bg={'#F2F4F7'}
          variant={'ghost'}
          fontSize={14}
          fontWeight={500}
        >
          {t('add_address')}
        </Button>
      </Flex>
      <Stack divider={<Divider />}>
        {points?.map((item) => (
          <Flex align='center' justifyContent={'space-between'} key={item?.id}>
            <Text fontWeight={400} lineHeight={'24px'}>
              {item?.address}
            </Text>
            <Flex>
              <IconButton
                variant='ghost'
                aria-label='Edit address'
                icon={
                  <Icon
                    icon='mdi:pencil'
                    color='#667085'
                    width={'16px'}
                    height={'16px'}
                  />
                }
                onClick={() => {
                  dispatch(setMapModalLg(true))
                  dispatch(openPoint(item))
                }}
              />
              <IconButton
                color='error'
                variant='ghost'
                aria-label='Edit address'
                icon={
                  <Icon
                    icon='material-symbols:delete'
                    width={'16px'}
                    height={'16px'}
                  />
                }
                // onClick={() => dispatch(removePoint(item?.id))}
                onClick={() =>
                  setIsOpen({
                    address: item?.address,
                    open: true,
                    id: item?.id,
                  })
                }
              />
            </Flex>
          </Flex>
        ))}
      </Stack>
      <ModalComponent
        size='sm'
        isOpen={isOpen?.open}
        title={
          <>
            <Text fontWeight={700} fontSize={18}>
              {t('delete_address')}:
            </Text>
            <Text mt={2} color={'#667085'} fontWeight={400}>
              {isOpen?.address}
            </Text>
          </>
        }
        onClose={() =>
          setIsOpen({
            address: '',
            open: false,
            id: '',
          })
        }
      >
        <Flex gap={2}>
          <Button
            onClick={() =>
              setIsOpen({
                address: '',
                open: false,
                id: '',
              })
            }
            w={'100%'}
            fontWeight={500}
            fontSize={14}
          >
            {t('leave')}
          </Button>
          <Button
            onClick={() => {
              dispatch(removePoint(isOpen?.id))
              setIsOpen({
                address: '',
                open: false,
                id: '',
              })
            }}
            w={'100%'}
            variant={'primary'}
            fontWeight={500}
            fontSize={14}
          >
            {t('delete')}
          </Button>
        </Flex>
      </ModalComponent>
    </Card>
  )
}

export default Addresses
