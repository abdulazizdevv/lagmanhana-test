import { Box, Card, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import styles from './styles.module.scss'

interface IProps {
  results: any[]
  onSelect: (e: any, type: string) => void
}

export default function AddressDropdown({ results = [], onSelect }: IProps) {
  const bgColor = useColorModeValue('white', 'paper.dark.500')

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
      {results?.map(
        (item) =>
          item?.label && (
            <Option
              data={item}
              onSelect={() => onSelect(item, 'suggest')}
              key={item?.distance + item?.description + item?.label + 'suggest'}
            />
          )
      )}
    </Card>
  )
}

interface IOptionProps {
  data: { label: string; description: string; distance: string }
  onSelect: (data: any) => void
}

const Option = ({ data, onSelect }: IOptionProps) => {
  const bgColor = useColorModeValue('paper.light.300', 'paper.dark.300')
  return (
    <Flex
      align='center'
      _hover={{
        bg: bgColor,
      }}
      className={styles.search_address_option}
      onClick={() => onSelect(data)}
    >
      <Box>
        <Icon icon='ion:location-outline' fontSize='16px' />
      </Box>
      <Box py={3}>
        <Text mb={0.5} fontWeight={500}>
          {data?.label}
        </Text>
        <Text fontSize='small' color='#9AA6AC' lineHeight={1.2}>
          {data?.description}
          {/* {data?.description && data?.distance ? '-' : ''}{' '}
          {data?.distance} */}
        </Text>
      </Box>
    </Flex>
  )
}
