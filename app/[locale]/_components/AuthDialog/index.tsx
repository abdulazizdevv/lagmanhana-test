import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// Components
import Countdown from '../Countdown'
// Style
import {
  Button,
  Center,
  Input,
  ModalBody,
  FormControl,
  ModalFooter,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  FormErrorMessage,
  FormLabel,
  useToast,
  Stack,
} from '@chakra-ui/react'
import { authActions } from '@/_store/auth/auth.slice'
import { useRef } from 'react'
import PhoneInput from '../PhoneInput'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import customerService from '@/_services/customerService'
import { request } from '@/_services/http-client'
import { useI18n } from '@/_locales/client'
import { IRedux } from '@/_types'
import logo from '@/_assets/logo.svg'
import Image from 'next/image'
import Link from 'next/link'

function AuthDialog({
  isOpen = false,
  onClose,
  onLastConfirm = () => {},
}: {
  isOpen: boolean
  onClose: () => void
  onLastConfirm?: () => void
}) {
  // const [activeWindow, setActiveWindow] = useState('login')
  const [privacyPolicy, setPrivacyPolicy] = useState(false)
  const [otpDialog, setOTPDialog] = useState(false)
  const [otp, setOTP] = useState('')
  const [name, setName] = useState('')
  const [isCountdown, setCountdown] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState(false)
  const [OTPError, setOTPError] = useState(false)
  const [birthday, setBirthday] = useState('')

  const { activeWindow } = useSelector((state: IRedux) => state.auth)

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const t = useI18n()
  const toast = useToast()
  const dispatch = useDispatch()

  const { user } = useSelector((state: IRedux) => state.auth)
  const country = useSelector((state: IRedux) => state.settings?.country)

  const clear = () => {
    setOTP('')
    setName('')
    setPhoneNumber('')
    setOTPDialog(false)
    // setNameDialog(false)
  }

  useEffect(() => {
    if (otpDialog) {
      setTimeout(() => {
        setCountdown(false)
      }, 60000)
    }

    return () => {
      setCountdown(true)
    }
  }, [otpDialog])

  const onTelChange = (val: string) => {
    setPhoneError(false)
    setPhoneNumber(val)
  }

  const onLogin = (e: any) => {
    e.preventDefault()

    if (isPossiblePhoneNumber(phoneNumber, country.iso_code || 'UZ')) {
      getUserByPhone({ phone: phoneNumber })
    } else setPhoneError(true)
  }

  const onOTPSubmit = (e: any) => {
    e.preventDefault()

    if (otp.length === 6) {
      customerService
        .verifyOTP({ code: otp, phone: phoneNumber })
        .then((res) => {
          // dataLayerComponent({
          //   event: 'Authorization_successful',
          // })
          dispatch(authActions.setUser(res?.data))
          onClose()
          onLastConfirm()
        })
        .catch(() => setOTPError(true))
    } else {
      setOTPError(true)
    }
  }

  const onRegisterConfirm = (e: any) => {
    e.preventDefault()

    if (otp.length === 6) {
      customerService
        .registerConfirm({ code: otp, phone: phoneNumber })
        .then((res) => {
          // dataLayerComponent({
          //   event: 'Authorization_successful',
          // })
          dispatch(authActions.setUser(res?.data))
          dispatch(authActions.setActiveWindow('registration'))
        })
        .catch(() => setOTPError(true))
    }
  }

  const onRegister = (e: any) => {
    e.preventDefault()

    if (name.length > 0) {
      const data = {
        name: name,
        phone: user?.phone,
        date_of_birth:
          user?.date_of_birth == 'invalid date' || !user?.date_of_birth
            ? birthday
              ? birthday
              : null
            : user?.date_of_birth,
      }

      customerService.update(user?.id, data).then((res) => {
        dispatch(authActions.updateUser({ name }))
        clear()
        onClose()
        onLastConfirm()
      })
    }
  }

  const login = async (userData: any) => {
    await customerService
      .login(userData)
      .then(() => {
        dispatch(authActions.setActiveWindow('login-confirmation'))
      })
      .catch((err) => console.log(err))
  }

  // Get user by phone
  const getUserByPhone = async (userData: any) => {
    await request
      .post('/v1/customers/phone', userData)
      .then((res) => {
        login(userData)
      })
      .catch((err) => {
        if (err.response.status) {
          customerService
            .register({
              name: 'user',
              phone: phoneNumber,
              registration_source: 'website',
            })
            .then((res) => {
              dispatch(authActions.setActiveWindow('register-confirmation'))
              // dispatch(authActions.setUser(res?.data))
              // clear()
              // onClose()
              // onLastConfirm()
            })
            .catch((err) =>
              toast({
                title: err?.response?.data?.Error?.code,
                description: err?.response?.data?.Error?.message,
                status: 'error',
                duration: 4000,
                isClosable: true,
              })
            )
        }
      })
  }

  const onCountReset = () => {
    setCountdown(true)
    login({ phone: phoneNumber })
    setTimeout(() => {
      setCountdown(false)
    }, 60000)
  }

  return (
    <Modal
      isOpen={isOpen}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      onClose={() => {
        onClose()
        clear()
        dispatch(authActions.setActiveWindow('login'))
      }}
      isCentered
      size='md'
    >
      <ModalOverlay />
      <ModalContent py={2} mx={{ base: 4, md: 0 }}>
        <ModalCloseButton />
        <form
          onSubmit={(e) =>
            activeWindow === 'login'
              ? onLogin(e)
              : activeWindow === 'registration'
              ? onRegister(e)
              : activeWindow === 'register-confirmation'
              ? onRegisterConfirm(e)
              : onOTPSubmit(e)
          }
        >
          {activeWindow === 'login' ? (
            <>
              <ModalHeader>
                <Stack spacing={2}>
                  <Image
                    src={logo}
                    alt={'logo'}
                    priority={true}
                    width={64}
                    height={40}
                    style={{ width: '64px', height: '60px' }}
                  />
                  <Text>{t('sign_in')}</Text>
                </Stack>
              </ModalHeader>
              <ModalBody pt={1}>
                <FormControl isInvalid={phoneError} mb={4}>
                  <FormLabel>{t('phone_number')}</FormLabel>
                  <Input
                    ref={initialRef}
                    value={phoneNumber}
                    placeholder={t('phone_number')}
                    onChange={(e: any) => onTelChange(e)}
                    as={PhoneInput}
                    boxShadow={'0px 1px 2px 0px #1018280D'}
                  />
                  {phoneError && (
                    <FormErrorMessage>
                      {t('incorrect_phone_number')}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {/* <Checkbox
                  display={'flex'}
                  alignItems={'stretch'}
                  onChange={(e) => {
                    setPrivacyPolicy(e.target.checked)
                  }}
                  colorScheme='primary'
                  color='#000'
                >
                </Checkbox> */}
                <Text fontSize='sm' fontWeight={400} lineHeight={'20px'}>
                  {t('accept_privacy')} <br />
                  <Button
                    fontSize='inherit'
                    colorScheme='primary'
                    color='blue'
                    variant='link'
                    href='/rules'
                    as={Link}
                    fontWeight={400}
                    onClick={onClose}
                  >
                    {t('terms_of_use')}
                  </Button>
                </Text>
              </ModalBody>
              <ModalFooter flexDirection='column' gap={3}>
                <Button
                  size='lg'
                  width='100%'
                  type='submit'
                  variant='primary'
                  fontSize='md'
                  // isDisabled={!privacyPolicy}
                  fontWeight={500}
                >
                  {t('send_code')}
                </Button>
              </ModalFooter>
            </>
          ) : activeWindow === 'registration' ? (
            <>
              <ModalHeader>
                <Stack spacing={4}>
                  <Image
                    src={logo}
                    alt={'logo'}
                    priority={true}
                    width={183}
                    height={60}
                    style={{ width: '183px', height: '60px' }}
                  />
                  <div>
                    <Text>{t('sign_up')}</Text>
                    <Text
                      fontSize='sm'
                      color='gray.500'
                      fontWeight={400}
                      mt={1}
                    >
                      {t('sign_new_feature')}
                    </Text>
                  </div>
                </Stack>
              </ModalHeader>
              <ModalBody>
                <FormControl mb={3}>
                  <FormLabel>{t('name')}</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder={t('enter_your_name')}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>{t('birthday')}</FormLabel>
                  <Input
                    type='date'
                    placeholder={t('birthday')}
                    onChange={(e: any) => setBirthday(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter flexDirection='column' gap={3} px={4}>
                <Button
                  size='lg'
                  width='100%'
                  type='submit'
                  variant='primary'
                  fontSize='md'
                  fontWeight={500}
                >
                  {t('confirm')}
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>
                <Stack spacing={4}>
                  <Image
                    src={logo}
                    alt={'logo'}
                    priority={true}
                    width={64}
                    height={60}
                    style={{ width: '64px', height: '60px' }}
                  />
                  <div>
                    <Text>{t('enter_sms_code')}</Text>
                    <Text
                      fontSize='sm'
                      color='gray.500'
                      fontWeight={400}
                      mt={1}
                    >
                      {t('code_sent_to_number', { phoneNumber })}{' '}
                      <Button
                        onClick={() => {
                          dispatch(authActions.setActiveWindow('login'))
                          setPrivacyPolicy(false)
                        }}
                        colorScheme='primary'
                        fontWeight={500}
                        variant='link'
                        fontSize='sm'
                        display='block'
                      >
                        {t('change_number')}
                      </Button>
                    </Text>
                  </div>
                </Stack>
              </ModalHeader>
              <ModalBody mt={1}>
                <Center flexDirection='column'>
                  <FormControl isInvalid={Boolean(OTPError)} mb={8}>
                    <FormLabel>{t('code_confirmation')}</FormLabel>
                    <Input
                      ref={initialRef}
                      value={otp}
                      onChange={(e: any) => setOTP(e.target.value)}
                      type='number'
                    />
                    <FormErrorMessage>
                      {t('invalid_code_entered')}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    gap={1}
                    w='full'
                    variant='link'
                    color='gray.600'
                    fontWeight={500}
                    onClick={() => !isCountdown && onCountReset()}
                  >
                    {isCountdown ? (
                      <>
                        {t('send_another_code')}{' '}
                        <Countdown
                          value={60}
                          onTimeout={() => setCountdown(false)}
                        />
                      </>
                    ) : (
                      t('resend')
                    )}
                  </Button>
                </Center>
              </ModalBody>
              <ModalFooter flexDirection='column' gap={3} px={4} pt={1}>
                <Button
                  size='lg'
                  width='100%'
                  type='submit'
                  variant='primary'
                  fontSize='md'
                  fontWeight={500}
                >
                  {t('confirm')}
                </Button>
              </ModalFooter>
            </>
          )}
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AuthDialog
