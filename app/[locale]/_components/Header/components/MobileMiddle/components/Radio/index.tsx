import {
  HStack,
  Stack,
  StackDivider,
  Text,
  useRadioGroup,
} from '@chakra-ui/react'
import React from 'react'
import CRadio from './CRadio'
import { fonts } from '@/fonts'
import { useI18n } from '@/_locales/client'

interface IRadioGroup {
  name: string
  value?: string
  defaultValue?: string
  options: { label: string; value: string; image?: any }[]
  onChange: (e: string) => void
}

export default function CRadioGroupDeliveryType({
  name,
  value,
  defaultValue,
  options = [],
  onChange,
}: IRadioGroup) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value,
    defaultValue,
    onChange,
  })
  const t = useI18n()
  const group = getRootProps()
  return (
    <Stack
      divider={<StackDivider borderColor='#22222212' h={1} />}
      display={'flex'}
      gap={0}
      {...group}
    >
      {options.map((item) => {
        const radio = getRadioProps({ value: item.value })
        return (
          <CRadio
            value={item.value} // Corrected value prop
            name={name}
            key={item.value}
            isChecked={value === item.value} // Added isChecked prop
            onChange={onChange} // Ensure onChange is passed
            {...radio}
          >
            <HStack>
              {item.image}
              <Text fontSize={12} fontWeight={500}>
                {item.value === 'self-pickup' ? t('takeaway') : t('delivery')}
              </Text>
            </HStack>
          </CRadio>
        )
      })}
    </Stack>
  )
}
