import useDebounce from '@/_hooks/useDebounce'
import { useBranchList } from '@/_services/branches'
import { useProductList } from '@/_services/products'
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import Card from '../Card'
import SkletonCard from '../Skleton/Card'
import notProduct from '@/_assets/icons/search.svg'
import Image from 'next/image'
import { parseCookies } from 'nookies'
import ProductFilters from '../ProductFilters'
import { useI18n } from '@/_locales/client'
import CartBottom from '../CartBottom'

const SearchProduct = ({ currentLocale }: any) => {
  const [search, setSearch] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bgColor = useColorModeValue('paper.light.200', 'paper.dark.800')
  const [isLargerThan600] = useMediaQuery('(max-width: 600px)')
  const debouncedSearchTerm = useDebounce(search, 100)
  const { menu_id } = parseCookies()
  const t = useI18n()

  const { data } = useProductList({
    params: {
      page: 1,
      limit: 100,
      search: debouncedSearchTerm,
      fields: 'slug,image,categories,description,google_category',
      product_types: 'simple,combo,origin',
      menu_id: menu_id,
    },
    props: {
      enabled: true,
    },
  })

  return (
    <Box display={{ base: 'block', md: 'none' }} mb={2}>
      <Flex alignItems={'center'} gap={2}>
        <Flex
          bg={'#fff'}
          w={'100%'}
          alignItems={'center'}
          p={1}
          ps={3}
          borderRadius={'12px'}
        >
          <Icon icon='ep:search' width='1.2em' height='1.2em' color='#667085' />
          <Input
            focusBorderColor='transparent'
            outline={'none'}
            ps={1}
            border={'none'}
            placeholder={t('search')}
            onClick={onOpen}
          />
        </Flex>
        {/* <Box bg={'#fff'} p={'14px'} borderRadius={'12px'}> */}
        {/* <Filters currentLocale={currentLocale} /> */}
        <ProductFilters />

        {/* <Icon icon='ion:filter' width='1.2em' height='1.2em' /> */}
        {/* </Box> */}
      </Flex>
      <Modal onClose={onClose} size={'full'} isOpen={isOpen && isLargerThan600}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>
            <Flex alignItems={'center'} gap={2}>
              <Box
                onClick={onClose}
                cursor={'pointer'}
                _hover={{ bg: '#eee' }}
                p={3}
                borderRadius={'16px'}
              >
                <Icon icon='eva:arrow-back-fill' width='1.2em' height='1.2em' />
              </Box>
              <InputGroup
                w={'100%'}
                alignItems={'center'}
                display={'flex'}
                borderRadius={'12px'}
                bg={'#fff'} // Uncommented and added background color for clarity
              >
                <InputLeftElement
                  w={'55px'}
                  h={'100%'} // Ensures the icon is vertically centered
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Icon
                    icon='ep:search'
                    width='1.2em'
                    height='1.2em'
                    color='#667085'
                  />
                </InputLeftElement>

                <Input
                  // _focus={{
                  //   outline: '#7E5FA6',
                  //   borderColor: '#7E5FA6',
                  //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
                  // }}
                  // _active={{
                  //   outline: '#7E5FA6',
                  //   borderColor: '#7E5FA6',
                  //   boxShadow: '0px 0px 0px 4px #7E5FA60F',
                  // }}
                  // boxShadow={'0px 1px 2px 0px #1018280D'}
                  border={'1px solid #D0D5DD'}
                  // focusBorderColor='transparent'
                  fontWeight={500}
                  height={'48px'}
                  placeholder={t('search')}
                  borderRadius={'12px'}
                  onClick={onOpen}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Flex>
          </ModalHeader>
          <ModalBody>
            {data?.products ? (
              <SimpleGrid
                spacing={{ base: 2, lg: 4 }}
                columns={{ base: 2, md: 3, lg: 4 }}
              >
                {+data?.count > 0 ? (
                  data?.products?.map((product: any, idx: number) => (
                    <Card
                      h1={t('seo.h1_main')}
                      index={idx + 1}
                      product={product}
                      key={product.id}
                    />
                  ))
                ) : (
                  <SkletonCard />
                )}
              </SimpleGrid>
            ) : (
              <Flex
                flexDir='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                gap={4}
                height='80vh'
              >
                <Image
                  width={139}
                  height={113}
                  src={notProduct}
                  objectFit='cover'
                  alt={'no product'}
                />
                <Flex flexDir={'column'} gap={2}>
                  <Text fontSize={18} fontWeight={500}>
                    {t('not_found')}
                  </Text>
                  <Text color={'gray.500'} fontSize={12}>
                    {t('search_not_found_text')}
                  </Text>
                </Flex>
              </Flex>
            )}
          </ModalBody>
          <CartBottom />
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default SearchProduct
