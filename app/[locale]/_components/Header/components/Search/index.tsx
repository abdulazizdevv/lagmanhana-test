import useDebounce from '@/_hooks/useDebounce'
import { useProductList } from '@/_services/products'
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  useOutsideClick,
  Flex,
  Text,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import React, { useState, useRef, useEffect } from 'react'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import Link from 'next/link'
import notProduct from '@/_assets/icons/search.svg'

const Search = () => {
  const [isActiveInput, setIsActiveInput] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLDivElement>(null)
  const currentLocale = useCurrentLocale()
  const t = useI18n()

  const debouncedSearchTerm = useDebounce(search, 500)

  useOutsideClick({
    ref: inputRef,
    handler: () => {
      setIsActiveInput(false)
      setSearch('')
    },
  })

  useEffect(() => {
    if (isActiveInput) {
      inputRef.current?.querySelector('input')?.focus()
    }
  }, [isActiveInput])

  const handleSearch = (val: string) => {
    setSearch(val)
  }

  const { data } = useProductList({
    params: {
      page: 1,
      limit: 5,
      search: debouncedSearchTerm,
      fields: 'slug,image,categories,description,google_category',
      product_types: 'simple,combo,origin',
    },
    props: {
      enabled: true,
    },
  })

  return (
    <Box display='flex' alignItems='center' position='relative' ref={inputRef}>
      <Box
        transition='opacity 0.3s ease-in-out, max-height 0.3s ease-in-out, width 0.3s ease-in-out'
        opacity={isActiveInput ? 1 : 0}
        // maxHeight={isActiveInput ? '40px' : '0px'}
        overflow='hidden'
        width={isActiveInput ? '200px' : '0'}
        onTransitionEnd={() => {
          if (!isActiveInput) {
            setIsActiveInput(false)
          }
        }}
      >
        <Flex flexDir={'column'}>
          <InputGroup ms={2}>
            <InputLeftElement pointerEvents='none' height='100%' fontSize={24}>
              <Icon icon='ep:search' color='#6C6C6C' />
            </InputLeftElement>
            <Input
              position={'relative'}
              variant='filled'
              _focus={{
                borderColor: 'transparent',
                boxShadow: '0px 0px 0px 4px #7E5FA60F',
                bgColor: 'gray.300',
              }}
              _active={{
                borderColor: 'transparent',
                boxShadow: '0px 0px 0px 4px #7E5FA60F',
                bgColor: 'gray.300',
              }}
              boxShadow='0px 1px 2px 0px #1018280D'
              border='1px solid #D0D5DD'
              placeholder={t('search')}
              maxW='200px'
              borderRadius='12px'
              autoComplete='off'
              autoCorrect='off'
              transition='all 0.3s ease-in-out'
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputGroup>
          {data?.products?.length > 0 && search ? (
            <Box
              minW={'272px'}
              w={'100%'}
              bg='#fff'
              zIndex={5}
              p={2}
              position={'absolute'}
              top={'45px'}
              borderRadius='12px'
              boxShadow={'0px 0px 12px 0px #45474529'}
            >
              {data?.products?.map((el, idx) => (
                <Link
                  key={el.id}
                  href={'/product/' + (el.slug ? el.slug : el.id)}
                >
                  <Flex
                    p={2}
                    gap={2}
                    cursor={'pointer'}
                    _hover={{
                      bgColor: 'paper.light.300',
                    }}
                    borderRadius={'8px'}
                    onClick={() => {
                      setIsActiveInput(false)
                      setSearch('')
                    }}
                  >
                    <Image
                      src={
                        el.image
                          ? process.env.BASE_URL + el.image
                          : defaultImage
                      }
                      alt={
                        el.title?.[
                          currentLocale === 'kz' ? 'uz' : currentLocale
                        ]
                      }
                      width={42}
                      height={28}
                      style={{ objectFit: 'contain', borderRadius: '4px' }}
                    />
                    <Text>
                      {
                        el.title?.[
                          currentLocale === 'kz' ? 'uz' : currentLocale
                        ]
                      }
                    </Text>
                  </Flex>
                </Link>
              ))}
            </Box>
          ) : (
            search && (
              <Box
                minW={'272px'}
                w={'100%'}
                bg='#fff'
                zIndex={5}
                p={2}
                position={'absolute'}
                top={'45px'}
                borderRadius='12px'
                boxShadow={'0px 0px 12px 0px #45474529'}
              >
                <Flex
                  flexDir={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  mt={2}
                  gap={2}
                >
                  <Image
                    src={notProduct}
                    alt={'search'}
                    width={75}
                    height={38}
                    style={{ objectFit: 'contain', borderRadius: '4px' }}
                  />
                  <Flex flexDir={'column'} gap={2}>
                    <Text color={'gray.500'} textAlign={'center'} fontSize={14}>
                      {t('search_not_found_text')}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            )
          )}
        </Flex>
      </Box>
      <Button
        onClick={() => setIsActiveInput(true)}
        variant='ghost'
        bg='gray.300'
        borderRadius='12px'
        transition='all 0.3s ease-in-out'
        _focus={{
          outline: 'none',
        }}
        _active={{
          bg: 'gray.300',
        }}
        display='flex'
        alignItems='center'
        position='absolute'
        right={0}
        style={{
          transform: isActiveInput ? 'translateX(-161px)' : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Icon icon='ep:search' width='1.2em' height='1.2em' />
      </Button>
    </Box>
  )
}

export default Search
