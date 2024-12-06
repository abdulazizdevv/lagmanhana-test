import React, { useMemo, useState } from 'react'
import styles from '../../style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { checkoutActions } from '@/_store/checkout/checkout.slice'
import {
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import Image from 'next/image'
import PaymeIcon from '@/_assets/payment/PaymeIcon'
import cash from '@/_assets/payment/cash.svg'
import click from '@/_assets/payment/click.svg'
import uzum from '@/_assets/payment/uzum.svg'
import kaspi from '@/_assets/payment/kaspi.svg'
import epay from '@/_assets/payment/epay.svg'
import { Icon } from '@iconify/react/dist/iconify.js'
import EpayModal from './components/EpayModal'
import { IRedux } from '@/_types'
import CRadioGroup from './components/CRadio'

interface IProps {
  isShouldCardSave: boolean
  paymentData: string
  onChange: (e: any) => void
  onShouldSaveCard: (e: boolean) => void
  usedTypes: any
}

interface IPaymentOptions {
  id: string
  name: Record<string, string>
  type: string
  active: boolean
  image: string
  shipper_id: string
  integration?: string
}

function Payment({
  isShouldCardSave,
  paymentData,
  onChange,
  onShouldSaveCard,
  usedTypes,
}: IProps) {
  const [isDialog, setDialog] = useState<boolean>(false)
  const [isEpayModal, setEpayModal] = useState<boolean>(false)

  const t = useI18n()
  const dispatch = useDispatch()
  const checkoutState = useSelector((state: IRedux) => state.checkout)

  const onPaymentTypeChange = (newValue: string) => {
    let old_type = checkoutState?.payment_type_id
    if (old_type !== newValue) {
      let paymentType = usedTypes
        ?.map((el: any) => el?.id === newValue && el?.type)
        .filter(Boolean)
      let paymentIntegrationType = usedTypes
        ?.map((el: any) => el?.id === newValue && el?.integration)
        .filter(Boolean)

      onChange(newValue)
      dispatch(checkoutActions.changePaymentId(newValue))
      dispatch(
        checkoutActions.changePaymentIntegration(paymentIntegrationType[0])
      )
      dispatch(checkoutActions.changePaymentType(paymentType[0]))
    }
  }

  const onEpayCardChange = (newValue: any) => {
    setEpayModal(false)
    dispatch(checkoutActions.saveCard(newValue))
  }

  const epayOption = useMemo(() => {
    let epay = usedTypes?.find((type: any) => type.integration === 'epay')
    if (epay) {
      return {
        value: 'epay',
        label: 'Epay',
        id: epay.id,
        image: getPaymentIcon('epay', 'white'),
      }
    }

    return null
  }, [usedTypes])

  const epayData = useMemo(() => {
    let epay = usedTypes?.find((type: any) => type.integration === 'epay')
    if (epay) {
      return epay
    }
    return null
  }, [usedTypes])

  return (
    <>
      <div>
        <Text fontSize='xl' fontWeight={700}>
          {t('payment_method')}
        </Text>
        {usedTypes?.length > 0 && (
          <Option usedTypes={usedTypes} onClick={() => setDialog(true)} />
        )}
        {/* <Divider my={4} /> */}
        {/* {usedTypes?.some(
          (type: any) => type?.value === 'iiko_card' && type?.is_used
        ) && (
          <Option
            value={
              paymentData['iiko_card']
                ? numToPrice(paymentData['iiko_card'])
                : undefined
            }
            // icon={<BalanceIcon style={{ color: '#9AA6AC' }} />}
            description={t('accumulative_card')}
            onClick={() => setDialog('accumulative_card')}
            onRemove={onRemoveIikoCard}
          />
        )} */}
      </div>

      <PaymentTypes
        isOpen={isDialog}
        usedTypes={usedTypes}
        onClose={() => setDialog(false)}
        onChange={onPaymentTypeChange}
        setEpayModal={setEpayModal}
        setDialog={setDialog}
      >
        {null}
        {/* {epayOption && (
          <EPayOption
            value={epayOption}
            onClick={() => {
              // onPaymentTypeChange('epay')
              onPaymentTypeChange(epayData?.id)
              setEpayModal(true)
              setDialog(false)
            }}
          />
        )} */}
      </PaymentTypes>
      <EpayModal
        isShouldCardSave={isShouldCardSave}
        isOpen={isEpayModal}
        onClose={() => setEpayModal(false)}
        onCancel={() => {
          onPaymentTypeChange('kaspi')
          setEpayModal(false)
          setDialog(true)
        }}
        onShouldSaveCard={onShouldSaveCard}
        onConfirm={onEpayCardChange}
      />
    </>
  )
}

const getPaymentIcon = (type: string, color: string) => {
  switch (type) {
    case 'kaspi':
      return <Image src={kaspi} alt='kaspi' width={32} height={32} />
    case 'epay':
      return <Image src={epay} alt='epay' width={32} height={32} />
    case 'payme':
      return <PaymeIcon fill={color} />
    case 'click':
      return <Image src={click} alt={'click'} width={32} height={32} />
    case 'apelsin':
      return (
        <Image
          src={uzum}
          style={{ borderRadius: '8px' }}
          alt={'click'}
          width={32}
          height={32}
        />
      )
    case 'uzum':
      return (
        <Image
          style={{ borderRadius: '8px' }}
          src={uzum}
          alt={'click'}
          width={32}
          height={32}
        />
      )
    default:
      return <Image src={cash} alt={'cash'} width={32} height={32} />
  }
}

function PaymentTypes({
  isOpen,
  onClose,
  onChange,
  usedTypes,
  children,
  setEpayModal,
  setDialog,
}: {
  isOpen: boolean
  onClose: () => void
  onChange: (e: string) => void
  usedTypes: any
  setEpayModal: any
  setDialog: any
  children: React.ReactNode
}) {
  const t = useI18n()
  const currentLocale: any = useCurrentLocale()

  const checkoutState = useSelector((state: IRedux) => state.checkout)
  const txtColor = useColorModeValue('black', 'white')
  const epayData = usedTypes?.find((el: any) => el?.integration == 'epay')

  const options = useMemo(
    () =>
      usedTypes
        ?.filter((item: IPaymentOptions) => item.type !== 'cashback') // Filter out 'cashback' types
        .map((item: IPaymentOptions) => ({
          value: item?.id,
          label: item?.name?.[currentLocale],
          image: item?.image ? (
            <Image
              src={process.env.BASE_URL + item?.image}
              alt={item?.name?.[currentLocale]}
              width={32}
              height={32}
            />
          ) : (
            <Image src={cash} alt={'cash'} width={32} height={32} />
          ),
        })),
    [usedTypes, currentLocale]
  )

  // const firstOption = useMemo(() => {
  //   let kaspi = usedTypes?.find(
  //     (type: any) => type.value === 'kaspi' && type?.is_used
  //   )
  //   if (kaspi) {
  //     return [
  //       {
  //         value: 'kaspi',
  //         label: 'Kaspi.kz',
  //         image: getPaymentIcon('kaspi', 'white'),
  //       },
  //     ]
  //   }

  //   return []
  // }, [usedTypes])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='md' isCentered>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalCloseButton mt={2} />
        <ModalHeader className={styles.title}>
          {t('payment_method')}
          {/* Способ оплаты */}
        </ModalHeader>
        <ModalBody p={4} pt={1}>
          <CRadioGroup
            unstyled={true}
            name='payment_type'
            value={checkoutState?.payment_type_id}
            options={[...(options || [])]}
            onChange={(e) => {
              if (epayData?.id === e) {
                onChange(e)
                setEpayModal(true)
                setDialog(false)
              } else {
                onChange(e)
              }
            }}
          />
          {children}
        </ModalBody>
        <ModalFooter px={4} pt={0}>
          <Button
            fontWeight={500}
            fontSize={14}
            variant='primary'
            flex={1}
            height={'48px'}
            onClick={onClose}
          >
            {t('confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function Option({
  onClick,
  usedTypes,
}: {
  onClick: () => void
  usedTypes: IPaymentOptions[]
}) {
  const t = useI18n()
  const currentLocale = useCurrentLocale()
  const checkoutState = useSelector((state: IRedux) => state.checkout)

  return (
    <HStack justify='space-between' my={4}>
      <HStack>
        <Center
          bg='#fff'
          border='1px solid #D9D9D9'
          borderRadius='md'
          width={10}
          height={10}
        >
          {checkoutState?.payment_type_id
            ? usedTypes?.map(
                (el) =>
                  el?.id === checkoutState?.payment_type_id && (
                    <Image
                      key={el?.id}
                      src={process.env.BASE_URL + el?.image}
                      alt={el?.image || 'default image'}
                      width={32}
                      height={32}
                    />
                  )
              )
            : usedTypes?.length > 0 && (
                <Image
                  key={usedTypes[0]?.id}
                  src={process.env.BASE_URL + usedTypes[0]?.image}
                  alt={usedTypes[0]?.image || 'default image'}
                  width={32}
                  height={32}
                />
              )}
        </Center>
        <Text fontWeight={500}>
          {checkoutState?.payment_type_id ? (
            usedTypes?.map((el) => {
              if (el?.id === checkoutState?.payment_type_id) {
                return (
                  <React.Fragment key={el?.id}>
                    {checkoutState?.payment_integration === 'epay' &&
                    checkoutState?.card?.id
                      ? checkoutState?.card?.mask
                      : el?.name?.[currentLocale]}
                  </React.Fragment>
                )
              }
              return null
            })
          ) : (
            <React.Fragment>
              {checkoutState?.payment_integration === 'epay' &&
              checkoutState?.card?.id
                ? checkoutState?.card?.mask
                : usedTypes[0]?.name?.[currentLocale]}
            </React.Fragment>
          )}
        </Text>
      </HStack>

      <Button
        variant={'ghost'}
        bg={'#F2F4F7'}
        fontSize={14}
        fontWeight={500}
        onClick={onClick}
      >
        {t('change')}
      </Button>
    </HStack>
  )
}

function EPayOption({
  value,
  onClick,
}: {
  value: { image: React.ReactNode; label: string }
  onClick?: () => void
}) {
  return (
    <>
      <Divider borderColor='#FFFFFF12' my={2} />
      <Flex
        onClick={onClick}
        align='center'
        cursor='pointer'
        justify='space-between'
        py={{ base: 1.5, md: 3 }}
        transition='150ms ease-in-out'
        fontSize={{ base: 'sm', md: 'lg' }}
        borderRadius={{ base: 'lg', md: '2xl' }}
      >
        <HStack>
          {value.image}
          <Text>{value.label}</Text>
        </HStack>
        <Text fontSize={{ base: '14px', md: '24px' }}>
          <Icon
            icon='material-symbols:chevron-right-rounded'
            color='#fff'
            fontSize='inherit'
          />
        </Text>
      </Flex>
    </>
  )
}

export default Payment
