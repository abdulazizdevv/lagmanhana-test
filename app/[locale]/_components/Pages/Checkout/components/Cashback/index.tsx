import { useI18n } from '@/_locales/client'
import { getIikoCustomerInfo } from '@/_services/customerService'
import { IRedux } from '@/_types'
import numToPrice from '@/_utils/numToPrice'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface IProps {
  onAccumulate: (e: number) => void
  totalPrice: number
}

export default function Cashback({ onAccumulate, totalPrice }: IProps) {
  const [isError, setError] = useState('')
  const [balance, setBalance] = useState(0)
  const [isSaved, setSaved] = useState(false)
  const [cashbackAmount, setCashback] = useState('')

  const { user } = useSelector((state: IRedux) => state.auth)
  const country = useSelector((state: IRedux) => state.settings?.country)

  useEffect(() => {
    if (!balance)
      getIikoCustomerInfo({ phone: user?.phone })
        .then((res) => setBalance(res?.data.balance || 0))
        .catch((err) => console.log(err))
  }, [user?.phone, balance])

  const t = useI18n()

  const handleChange = (val: string) => {
    const amount = Number(val)
    setCashback(val)

    if (balance >= totalPrice) {
      if (amount > balance) {
        setError(t("You don't have that money"))
      } else if (amount > totalPrice) {
        setError(t("You entered more than order's price"))
      } else {
        setError('')
      }
    } else {
      if (amount > balance) {
        setError(t("You don't have that money"))
      } else if (amount > totalPrice) {
        setError(t("You entered more than order's price"))
      } else {
        setError('')
      }
    }
  }

  const onSave = () => {
    if (!isError) {
      onAccumulate(parseInt(cashbackAmount))
      setSaved(true)
    }
  }

  const onRemoveCashback = () => {
    onAccumulate(0)
    setCashback('')
    setSaved(false)
  }

  return (
    // <CreditCard amount={numToPrice(balance)} />
    <FormControl isInvalid={Boolean(isError)}>
      <FormLabel>
        {t('cashback')} ({numToPrice(balance)} {country?.currency})
      </FormLabel>
      <InputGroup size='md' borderRadius={'8px'}>
        <Input
          isDisabled={isSaved}
          value={cashbackAmount}
          placeholder={t('enter_payment_amount')}
          // boxShadow='0px 1px 2px 0px #1018280D'
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
          onChange={(e) => handleChange(e.target.value)}
          borderRadius='8px'
          type='number'
        />
        {isSaved ? (
          <InputRightElement width='15%'>
            <Icon
              icon='ci:close-md'
              width='1.2em'
              height='1.2em'
              cursor='pointer'
              onClick={() => setSaved(false)}
            />
          </InputRightElement>
        ) : (
          <InputRightElement width='auto' p={0} bg='transparent' border='none'>
            <Button
              borderRadius='0 8px 8px 0'
              fontSize={14}
              fontWeight={500}
              bg='#fff'
              cursor='pointer'
              minW='130px'
              variant='#fff'
              onClick={onSave}
              border='1px solid #D0D5DD'
              isDisabled={Boolean(
                // (cashbackAmount && 100 > Number(cashbackAmount)) ||
                !cashbackAmount
              )}
            >
              {t('apply')}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage>{isError}</FormErrorMessage>
    </FormControl>
  )
}
