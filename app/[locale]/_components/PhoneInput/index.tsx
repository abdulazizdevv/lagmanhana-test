import Input from 'react-phone-number-input/input'
import styles from './styles.module.scss'
import { forwardRef } from 'react'
import { useI18n } from '@/_locales/client'
import { useSelector } from 'react-redux'
import { IRedux } from '@/_types'

interface Props {
  autoFocus: boolean
  copyable: boolean
  placeholder: string
  value: string
  onChange: (e: string) => void
}

const PhoneInput = forwardRef<HTMLButtonElement, Props>(
  (
    {
      onChange,
      value,
      placeholder = 'phone_number',
      autoFocus = false,
      copyable,
      ...props
    },
    ref
  ) => {
    const { country } = useSelector((state: IRedux) => state.settings)

    return (
      <Input
        ref={ref}
        // initialValueFormat="national"
        international
        withCountryCallingCode
        country={country?.iso_code ? country?.iso_code : 'KZ'}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e)}
        autoFocus={autoFocus}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput
