'use client'
import BreadCrumb from '@/_components/Breadcrumb'
import { useCurrentLocale, useI18n } from '@/_locales/client'
import { IBranch } from '@/_types'
import {
  Box,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import BranchCard from './components/BranchCard'

import { Icon } from '@iconify/react/dist/iconify.js'
import ScheduleStatus from './components/ScheduleStatus'
import Link from 'next/link'
import CMap from './components/Map'
import { usePathname, useRouter } from 'next/navigation'
import MapModal from './components/MapModal'

interface IProps {
  data: IBranch[]
  count: number
}

const Branches = ({ data, count }: IProps) => {
  const [branchData, setBranchData] = useState<IBranch | null>(null)
  const router = useRouter()
  const pathName = usePathname()
  const mapRef = useRef<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const t = useI18n()

  const BreadCrumbBranches = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('branch'),
      link: '/restaurants',
    },
  ]

  const handleSearchQuery = (val: string) => {
    router.push(`${pathName}/?search=${val}`)
  }

  const handleSelectBranch = (branch: IBranch) => {
    if (mapRef.current) {
      mapRef.current?.setCenter(
        [branch.location.lat, branch.location.long],
        18,
        {
          duration: 300,
        }
      )
    }
    setBranchData(branch)
  }

  return (
    <>
      <Container>
        <Box>
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems={{ base: '', md: 'center' }}
            justifyContent={'space-between'}
            mb={5}
          >
            <Box>
              <Box mt={{ base: 0, md: 6 }}>
                <BreadCrumb items={BreadCrumbBranches} />
              </Box>
              <Flex alignItems={'end'} justifyContent={'space-between'}>
                <Heading as={'h1'} lineHeight={1} fontSize='28px'>
                  {t('branch')}
                </Heading>
                <Text
                  cursor={'pointer'}
                  display={{ base: 'block', lg: 'none' }}
                  textDecor={'underline'}
                  color={'#1570EF'}
                  _hover={{
                    color: '#0a5ccf',
                  }}
                  onClick={onOpen}
                >
                  {t('show_map')}
                </Text>
              </Flex>
            </Box>
          </Flex>
          <Box shadow={'none'} bg={'#fff'} p={4} borderRadius={16}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={3}>
              <Box bg={'#fff'}>
                <InputGroup mb={3}>
                  <InputLeftElement
                    pointerEvents='none'
                    height='100%'
                    fontSize={24}
                  >
                    <Icon
                      icon='fluent:search-16-regular'
                      width='1.2em'
                      height='1.2em'
                      color='gray.200'
                    />
                  </InputLeftElement>
                  <Input
                    border='1px solid #D0D5DD'
                    placeholder={t('search')}
                    borderRadius='8px'
                    autoComplete='off'
                    autoCorrect='off'
                    transition='all 0.3s ease-in-out'
                    onChange={(e) => handleSearchQuery(e.target.value)}
                  />
                </InputGroup>

                <Flex
                  h={'600px'}
                  overflowY={'auto'}
                  flexDirection={'column'}
                  gap={'12px'}
                >
                  {data?.map((item) => (
                    <BranchCard
                      key={item.id}
                      data={item}
                      branchData={branchData}
                      onBranchSelect={(e) => handleSelectBranch(e)}
                    />
                  ))}
                </Flex>
              </Box>
              <Box
                overflow='hidden'
                display={{ base: 'none', lg: 'block' }}
                borderRadius={{ base: 'none', md: '16px' }}
                position={'relative'}
              >
                <CMap
                  mapRef={mapRef}
                  data={data}
                  onBranchSelect={(e) => handleSelectBranch(e)}
                />
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
      </Container>
      <MapModal
        mapRef={mapRef}
        branchData={branchData}
        data={data}
        handleSelectBranch={handleSelectBranch}
        onClose={onClose}
        isOpen={isOpen}
        onOpen={onOpen}
      />
    </>
  )
}

export default Branches
