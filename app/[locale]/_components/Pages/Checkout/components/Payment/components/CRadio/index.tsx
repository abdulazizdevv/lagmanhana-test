import {
  Divider,
  HStack,
  Stack,
  StackDivider,
  Text,
  useRadioGroup,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import RadioCard from './radio'

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
    <>
      <Stack
        divider={<StackDivider bg={'#22222212'} borderColor='#FFFFFF12' />}
        {...group}
      >
        {options.map((item) => {
          const radio = getRadioProps({ value: item.value })
          return (
            <RadioCard
              key={item.value}
              value={item.value} // Correct value prop
              name={name}
              unstyled={unstyled}
              // isChecked={value === item.value} // Added isChecked prop
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
      <Divider p={0} h={'1px'} bg={'#22222212'} borderColor='#FFFFFF12' />
    </>
  )
}
