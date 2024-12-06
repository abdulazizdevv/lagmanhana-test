import { useTagsList } from '@/_services/tags'
import {
  Avatar,
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useCurrentLocale } from '@/_locales/client'
import SortedRadio from './components/Radio'

interface IRadioGroup {
  options: any[]
  value: string
  onchangeSorted: any
}

const SortedRadioGroup = ({ options, value, onchangeSorted }: IRadioGroup) => {
  const currentLocale = useCurrentLocale()

  return (
    <RadioGroup
      value={value}
      onChange={(e) => {
        onchangeSorted(e)
      }}
    >
      <Stack>
        {options?.map((item) => (
          <label key={item.id}>
            <Flex
              p={2}
              rounded={8}
              _hover={{
                bg: 'paper.light.300',
              }}
              cursor={'pointer'}
              justifyContent={'space-between'}
            >
              <HStack>
                <Text fontSize='md' fontWeight={400}>
                  {item.label}
                </Text>
              </HStack>
              <SortedRadio onchangeSorted={onchangeSorted} value={item} />
            </Flex>
          </label>
        ))}
      </Stack>
    </RadioGroup>
  )
}

export default SortedRadioGroup
