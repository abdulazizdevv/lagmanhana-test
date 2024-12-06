import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { IBranch, IRedux } from '@/_types'
import { useSelector } from 'react-redux'
import { fonts } from '@/fonts'
import { useI18n } from '@/_locales/client'
interface IProps {
  isActiveBranch: string | undefined
  onChange: any
  results: IBranch[]
  onSelect: (e: any) => void
}

export default function Branches({
  isActiveBranch,
  results = [],
  onSelect,
  onChange,
}: IProps) {
  const bgColor = useColorModeValue('white', 'paper.dark.500')

  return (
    <Box
      p={2}
      pb={4}
      bg={bgColor}
      maxH="calc(100vh - 270px)"
      overflowY="auto"
      borderRadius="lg"
      border="1px solid rgba(255, 255, 255, 0.07)"
    >
      {results?.map((item) => (
        <Option
          data={item}
          onChange={onChange}
          onSelect={() => onSelect(item)}
          isActiveBranch={isActiveBranch}
          key={item?.id}
        />
      ))}
    </Box>
  )
}

interface IOptionProps {
  isActiveBranch: any
  data: IBranch
  onChange: any
  onSelect: (data: IBranch) => void
}
const Option = ({ isActiveBranch, data, onSelect, onChange }: IOptionProps) => {
  const bgColor = useColorModeValue('paper.light.300', 'paper.dark.300')
  const common = useSelector((state: IRedux) => state.common)
  const t = useI18n()

  return (
    <Box
      cursor="pointer"
      my={2}
      p={3}
      fontSize="sm"
      bgColor={bgColor}
      _dark={{ bgColor: 'paper.dark.400' }}
      borderRadius="xl"
      transition="100ms ease-in-out"
      onClick={() => {
        onChange(data)
        onSelect(data)
      }}
      maxW="100%"
      overflow="hidden"
    >
      <Flex justifyContent="space-between">
        <Flex align="start" gap={1.5}>
          <Icon icon="ion:location-outline" color="black" fontSize="16px" />
          <Box className={fonts.GTWalsheimPro.className}>
            <Text fontWeight={500} fontSize="14px">
              {t('delivery_from_nearest_branch', {
                nearestBranch: data?.name,
              })}
            </Text>
            <Text color="#6C737F">{data?.address}</Text>
            <Text color="gray.500" fontSize="xs">
              <Text color="primary.500" as="span">
                {t('working_hours')}
              </Text>
              : {data?.work_hour_start} - {data?.work_hour_end}
            </Text>
          </Box>
        </Flex>
        {(isActiveBranch
          ? data?.id === isActiveBranch
          : data?.id === common?.branch?.id) && (
          <Box color="primary.500" fontSize="20px">
            <Icon icon="lets-icons:check-fill" width="20px" height="20px" />{' '}
          </Box>
        )}
      </Flex>
    </Box>
  )
}
