import { memo } from 'react'
import styles from './style.module.scss'
import classNames from 'classnames'
import Image from 'next/image'
import { Box, Text } from '@chakra-ui/react'
import { useI18n } from '@/_locales/client'
import NumberToPrice from '../NumberToPrice'
import { Icon } from '@iconify/react/dist/iconify.js'
import defaultImage from '@/_assets/illustration/no_photo.svg'

function CheckboxModifier({
  title = '',
  name = '',
  img = '',
  price = 0,
  checked = false,
  onChange,
  ...props
}: {
  title: string
  name: string
  img: string
  price: number
  checked: boolean
  onChange: (...args: any) => void
}) {
  const t = useI18n()
  return (
    <label
      htmlFor={name}
      className={classNames(styles.checkbox, { [styles.active]: checked })}
      {...props}
    >
      <div className={styles.img}>
        <Image
          src={img ? process.env.BASE_URL + img : defaultImage}
          alt={title + ` - photo 1`}
          style={{ objectFit: 'cover' }}
          sizes='(max-width: 768px) 100vw, (min-width: 769px) 50vw'
          fill
        />
      </div>
      <Box
        pt={checked ? 2 : 3}
        pb={3}
        className={styles.details}
        textAlign='center'
      >
        <Text fontWeight={600} mb={1}>
          {title}
        </Text>
        <p className={styles.price}>
          {price > 0 ? (
            <NumberToPrice value={price} textProps={{ as: 'span' }} />
          ) : (
            t('required')
          )}
        </p>
      </Box>
      <Icon
        icon='material-symbols:check-circle-rounded'
        className={styles.check}
      />
      <input
        type='checkbox'
        id={name}
        style={{ display: 'none' }}
        onChange={onChange}
        checked={checked}
      />
    </label>
  )
}

export default memo(CheckboxModifier)
