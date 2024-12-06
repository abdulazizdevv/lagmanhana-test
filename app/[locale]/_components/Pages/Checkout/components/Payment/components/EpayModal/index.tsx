import CRadioGroup from '@/_components/RadioGroup'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import visa from '@/_assets/payment/visa.svg'
import mastercard from '@/_assets/payment/mastercard.svg'
import { useQuery } from '@tanstack/react-query'
import paymentService from '@/_services/paymentService'
import { useSelector } from 'react-redux'
import { getCardType } from '@/_utils/getCardType'
import { useI18n } from '@/_locales/client'
import { IRedux } from '@/_types'

interface IProps {
  isOpen: boolean
  isShouldCardSave: boolean
  onClose: () => void
  onCancel: () => void
  onConfirm: (e: any) => void
  onShouldSaveCard: (e: boolean) => void
}

const getPaymentIcon = (type: string) => {
  switch (type) {
    case 'mastercard':
      return <Image src={mastercard} alt={'cash'} width={32} height={32} />
    default:
      return <Image src={visa} alt="kaspi" width={32} height={32} />
  }
}

function EpayModal({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  isShouldCardSave,
  onShouldSaveCard,
}: IProps) {
  const [value, setValue] = useState('')

  const t = useI18n()
  const commonState = useSelector((state: IRedux) => state.common)

  const { data, error, isLoading } = useQuery({
    queryKey: ['payment-saved-cards', commonState?.branch?.id],
    queryFn: () =>
      paymentService
        .savedCards({ branch_id: commonState?.branch?.id })
        .then((res) => res.data),
    enabled: isOpen,
    retry: 1,
  })

  const onPaymentTypeChange = (e: string) => {
    setValue(e)
    if (e === 'none') {
      onShouldSaveCard(true)
    } else {
      onShouldSaveCard(false)
    }
  }

  const onSubmit = () => {
    const selected = data?.cards?.find((item: any) => value === item?.id)
    if (selected) {
      onConfirm({
        mask: selected?.cardMask,
        id: selected?.id,
      })
    } else if (value === 'none') {
      onConfirm({
        mask: '',
        id: '',
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      {isLoading && (
        <ModalContent>
          <ModalBody>
            <Center>
              <Spinner size="xl" />
            </Center>
          </ModalBody>
        </ModalContent>
      )}
      {!isLoading &&
        (data?.cards?.length > 0 ? (
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>{t('select_card')}</ModalHeader>
            <ModalBody p={4} pt={1}>
              {error?.message ? (
                <Alert status="error" mt={5} borderRadius="lg">
                  <AlertIcon />
                  <AlertDescription>{error?.message}</AlertDescription>
                </Alert>
              ) : (
                data?.cards?.length > 0 && (
                  <PaymentTypes
                    onChange={onPaymentTypeChange}
                    value={value}
                    cards={data?.cards}
                  />
                )
              )}
              {value === 'none' && (
                <Checkbox
                  size="lg"
                  colorScheme="primary"
                  onChange={(e) => onShouldSaveCard(e.target.checked)}
                  isChecked={isShouldCardSave}
                >
                  <Text fontSize="sm">{t('save_new_card_after_payment')}</Text>
                </Checkbox>
              )}
            </ModalBody>
            <ModalFooter gap={2}>
              <Button onClick={onCancel}>{t('cancel')}</Button>
              {!error?.message && (
                <Button
                  variant="primary"
                  onClick={onSubmit}
                  isDisabled={!value}
                >
                  {t('select')}
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader textAlign="center">{t('no_card_linked')}</ModalHeader>
            <ModalFooter gap={2} pt={0}>
              <Button onClick={onClose} flex={1}>
                {t('no')}
              </Button>
              <Button
                variant="primary"
                flex={1}
                onClick={() => {
                  onShouldSaveCard(true)
                  onClose()
                }}
              >
                {t('yes')}
              </Button>
            </ModalFooter>
          </ModalContent>
        ))}
    </Modal>
  )
}

function PaymentTypes({ value, onChange, cards }: any) {
  const t = useI18n()

  const options = useMemo(
    () =>
      cards?.map((item: any) => ({
        label: item?.cardMask,
        value: item?.id,
        image: (
          <Center bg="#fff" borderRadius="lg" w={10} h={10}>
            {getPaymentIcon(getCardType(item?.cardMask))}
          </Center>
        ),
      })),
    [cards]
  )

  const otherOption = {
    label: t('pay_with_another_card'),
    value: 'none',
  }

  return (
    <CRadioGroup
      unstyled={true}
      name="payment_type"
      value={value}
      options={[...options, otherOption]}
      onChange={(e) => onChange(e)}
    />
  )
}

export default EpayModal
