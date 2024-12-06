import {
  HStack,
  Stack,
  StackDivider,
  Text,
  useRadioGroup,
} from '@chakra-ui/react'
import RadioCard from './components/RadioCard'
import React from 'react'

interface IRadioGroup {
  name: string
  unstyled?: boolean
  value?: string
  defaultValue?: string
  options: { label: string; value: string; image?: any }[]
  onChange: (e: string) => void
}

export default function CRadioGroup({
  name,
  unstyled,
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

  const group = getRootProps()
  return (
    <Stack
      divider={unstyled ? <StackDivider borderColor='#FFFFFF12' /> : undefined}
      {...group}
      display={'flex'}
      // flexDir={'column'}
      gap={0}
    >
      {options.map((item) => {
        const radio = getRadioProps({ value: item.value })
        return (
          <RadioCard
            value={item.value} // Corrected value prop
            name={name}
            key={item.value}
            unstyled={unstyled}
            isChecked={value === item.value} // Added isChecked prop
            onChange={onChange} // Ensure onChange is passed
            {...radio}
          >
            <HStack>
              {item.image}
              <Text>{item.label}</Text>
            </HStack>
          </RadioCard>
        )
      })}
    </Stack>
  )
}
