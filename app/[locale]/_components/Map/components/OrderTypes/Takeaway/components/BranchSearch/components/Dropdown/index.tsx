import {
  Box,
  Card,
  Center,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { IBranch, IRedux } from '@/_types'
import { useSelector } from 'react-redux'
import { fonts } from '@/fonts'
import Image from 'next/image'
import noResults from '@/_assets/icons/search.svg'
import { useI18n } from '@/_locales/client'

interface IProps {
  results: IBranch[]
  onSelect: (e: any) => void
}

export default function Dropdown({ results = [], onSelect }: IProps) {
  const bgColor = useColorModeValue('white', 'paper.dark.500')
  const t = useI18n()
  return (
    <Card
      p={2}
      position='absolute'
      top='calc(100% + 4px)'
      left={0}
      w='full'
      zIndex={20}
      maxH={363}
      bg={bgColor}
      borderRadius='lg'
      overflowY='auto'
      boxShadow='0px 4px 6px 0px #00000033, 0px 4px 6px 0px #0000000A'
      border='1px solid rgba(255, 255, 255, 0.07)'
    >
      {results?.length > 0 ? (
        results?.map((item) => (
          <Option data={item} onSelect={() => onSelect(item)} key={item?.id} />
        ))
      ) : (
        <Center flexDir='column' textAlign='center' gap={2}>
          <Image src={noResults} alt={'no result'} width={72} height={58} />
          <Text fontWeight={500} fontSize='sm' color='gray.600'>
            Не нашли такой адрес, попробуйте ещё раз
          </Text>
        </Center>
      )}
    </Card>
  )
}

interface IOptionProps {
  data: IBranch
  onSelect: (data: IBranch) => void
}

const Option = ({ data, onSelect }: IOptionProps) => {
  const bgColor = useColorModeValue('paper.light.300', 'paper.dark.300')
  const common = useSelector((state: IRedux) => state.common)

  return (
    <Flex
      align='center'
      _hover={{
        bg: bgColor,
      }}
      bg={data?.id === common?.branch?.id ? bgColor : ''}
      position='relative'
      height='fit-content'
      fontSize='sm'
      cursor='pointer'
      borderRadius='lg'
      px={2}
      gap={2}
      onClick={() => onSelect(data)}
    >
      <Box>
        <Icon icon='ion:location-outline' fontSize='16px' />
      </Box>
      <Box py={3} className={fonts.GTWalsheimPro.className}>
        <Text mb={0.5} fontWeight={500}>
          {data?.name}
        </Text>
        <Text fontSize='small' color='#9AA6AC' lineHeight={1.2}>
          {data?.address}
          {/* {data?.description && data?.distance ? '-' : ''}{' '}
          {data?.distance} */}
        </Text>
      </Box>
    </Flex>
  )
}
