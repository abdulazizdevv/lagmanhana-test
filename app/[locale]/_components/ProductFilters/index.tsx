import React, { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
// import FilterIcon from '@/_assets/icons/FilterIcon'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Tags from './components/Tags'
import { Icon } from '@iconify/react/dist/iconify.js'
import Sorted from './components/Filters'
import { useI18n } from '@/_locales/client'
import { useTagsList } from '@/_services/tags'

function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const tags = searchParams.get('tag_ids')
  const sort_value = searchParams.get('sort')
  const [isLargerThanMd] = useMediaQuery('(max-width: 768px)')
  const t = useI18n()
  const [valueSorted, setValueSorted] = useState('0')
  const [sort, setSort] = useState<string>('')

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filterOptions = [
    {
      id: '1',
      label: t('filter_for_title'),
      value: 'title.ru|asc',
    },
    {
      id: '2',
      label: t('filter_for_rate'),
      value: 'rate|asc',
    },
    {
      id: '3',
      label: t('filter_for_out_price_asc'),
      value: 'out_price|asc',
    },
    {
      id: '4',
      label: t('filter_for_out_price_desc'),
      value: 'out_price|desc',
    },
  ]

  const handleFiltered = () => {
    let newPath = pathname
    let queryParams = new URLSearchParams()

    if (selectedTags.length > 0) {
      queryParams.append('tag_ids', selectedTags.join(','))
    }

    if (parseInt(valueSorted) > 0) {
      queryParams.append('sort', sort)
    }

    newPath += `?${queryParams.toString()}`

    router.push(newPath, { scroll: false })

    onClose()
  }

  const handleClearFilter = () => {
    setSelectedTags([])
    setValueSorted('0')

    router.push(pathname, { scroll: false })
    onClose()
  }

  const onChangeTags = (value: string[]) => {
    setSelectedTags(value)
  }
  const onChangeSorted = (id: string, value?: any) => {
    setSort(value?.value)
    setValueSorted(id)
  }

  const getIdByValue = (value: string) => {
    const option = filterOptions.find((option) => option.value === value)
    return option ? option.id : '0'
  }

  const isFilterActive = selectedTags?.length > 0 || parseInt(valueSorted) > 0

  useEffect(() => {
    if (tags && tags?.length > 0) {
      const tagsArr = tags?.split(',')
      setSelectedTags(tagsArr)
    }
    if (sort_value && +getIdByValue(sort_value) > 0) {
      setValueSorted(getIdByValue(sort_value) || '0')
    }
  }, [tags, sort_value])

  const { data } = useTagsList({
    params: { page: 1, limit: 10 },
  })

  return (
    <>
      <Popover
        placement='bottom-start'
        isOpen={isOpen && !isLargerThanMd}
        onClose={onClose}
        isLazy={true}
      >
        <PopoverTrigger>
          {isLargerThanMd ? (
            <Button
              variant='brand.400'
              bg={isFilterActive ? 'brand.400' : '#fff'}
              onClick={onOpen}
              // leftIcon={<Icon icon='ion:filter' width='1.2em' height='1.2em' />}
              p={'14px'}
              h={'48px '}
              borderRadius={'8px'}
              color={'paper.dark.800'}
              fontSize={16}
              fontWeight={400}
            >
              <Flex alignItems={'center'} gap={1}>
                <Icon icon='ion:filter' width='1.2em' height='1.2em' />
                {isFilterActive && (
                  <Badge
                    colorScheme='#000'
                    rounded='full'
                    fontSize='inherit'
                    minW={6}
                    border='1px solid'
                    borderColor='#fff'
                    bg={'#fff'}
                    fontWeight={400}
                  >
                    {parseInt(valueSorted) > 0
                      ? selectedTags?.length + 1
                      : selectedTags?.length}
                  </Badge>
                )}
              </Flex>
            </Button>
          ) : (
            <Button
              variant='brand.400'
              bg={isFilterActive ? 'brand.400' : '#fff'}
              borderRadius={'8px'}
              onClick={onOpen}
              color={'paper.dark.800'}
              leftIcon={<Icon icon='ion:filter' width='1.2em' height='1.2em' />}
              fontSize={16}
              fontWeight={400}
            >
              <Flex gap={2}>
                {isFilterActive && (
                  <Badge
                    colorScheme='#000'
                    rounded='full'
                    fontSize='inherit'
                    color={'paper.dark.800'}
                    minW={6}
                    border='1px solid'
                    borderColor='#fff'
                    bg={'#fff'}
                    fontWeight={400}
                  >
                    {parseInt(valueSorted) > 0
                      ? selectedTags?.length + 1
                      : selectedTags?.length}
                  </Badge>
                )}
                {t('filter')}
              </Flex>
            </Button>
          )}
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            borderRadius={'8px'}
            boxShadow={'0px 0px 12px 0px #45474529'}
            p={2}
          >
            <Box mb={2}>
              <Flex
                alignItems='center'
                justifyContent='space-between'
                px={2}
                mb={2}
              >
                <Text fontWeight={400} color={'gray.500'}>
                  {t('filter')}
                </Text>
                <Button
                  size='sm'
                  variant='link'
                  fontWeight={400}
                  color={'primary.500'}
                  onClick={handleClearFilter}
                >
                  {t('reset')}
                </Button>
              </Flex>
              <Sorted
                options={filterOptions}
                value={valueSorted}
                onchangeSorted={onChangeSorted}
              />
            </Box>

            {data?.tags && (
              <>
                <Flex
                  alignItems='center'
                  justifyContent='space-between'
                  px={2}
                  mb={2}
                >
                  <Text fontWeight={400} color={'gray.500'}>
                    {t('tags')}
                  </Text>
                </Flex>
                <Tags
                  data={data}
                  values={selectedTags}
                  onChange={onChangeTags}
                />
              </>
            )}
            <Button
              bg={'primary.500'}
              color={'paper.dark.800'}
              variant={'contained'}
              width={'100%'}
              mt={2}
              fontSize={'14px'}
              fontWeight={500}
              onClick={() => handleFiltered()}
            >
              {t('filter_tag_sort')}
            </Button>
          </PopoverContent>
        </Portal>
      </Popover>

      <Modal isOpen={isOpen && isLargerThanMd} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius='8px' maxW='90vw' p={0}>
          <ModalBody p={2}>
            <Box mb={2}>
              <Flex
                alignItems='center'
                justifyContent='space-between'
                px={2}
                mb={2}
              >
                <Text fontWeight={400} color={'gray.500'}>
                  {t('filter')}
                </Text>
                <Button
                  size='sm'
                  variant='link'
                  fontWeight={400}
                  color={'primary.500'}
                  onClick={handleClearFilter}
                >
                  {t('reset')}
                </Button>
              </Flex>
              <Sorted
                options={filterOptions}
                value={valueSorted}
                onchangeSorted={onChangeSorted}
              />
            </Box>

            {data?.tags && (
              <>
                <Flex
                  alignItems='center'
                  justifyContent='space-between'
                  px={2}
                  mb={2}
                >
                  <Text fontWeight={400} color={'gray.500'}>
                    {t('tags')}
                  </Text>
                </Flex>
                <Tags
                  data={data}
                  values={selectedTags}
                  onChange={onChangeTags}
                />
              </>
            )}
            <Button
              bg={'primary.500'}
              variant={'contained'}
              width={'100%'}
              mt={2}
              fontSize={'14px'}
              fontWeight={500}
              onClick={() => handleFiltered()}
            >
              {t('filter_tag_sort')}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProductFilters
