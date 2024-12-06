import { Avatar, CheckboxGroup, HStack, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Checkbox from './components/Checkbox'
import { useCurrentLocale } from '@/_locales/client'

interface IRadioGroup {
  values: string[]
  onChange: (e: string[]) => void
  data: any
}

const Tags = ({ values, onChange, data }: IRadioGroup) => {
  const currentLocale = useCurrentLocale()

  return (
    <CheckboxGroup value={values} onChange={onChange}>
      <Stack>
        {data?.tags?.map((item: any) => (
          <Checkbox key={item.id} value={item.id}>
            <HStack>
              <Avatar
                size='sm'
                key={item.id}
                name={
                  item?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]
                }
                src={item.icon ? process.env.BASE_URL + item.icon : ''}
              />
              <Text fontSize='md' fontWeight={400}>
                {item.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
              </Text>
            </HStack>
          </Checkbox>
        ))}
      </Stack>
    </CheckboxGroup>
  )
}

export default Tags
