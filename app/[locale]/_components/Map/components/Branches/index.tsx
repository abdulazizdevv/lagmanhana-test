import { useBranchList } from '@/_services/branches'
import { IBranch } from '@/_types'
import { Stack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Card from './components/Card'
import BranchSearch from './components/BranchSearch'
import useDebounce from '@/_hooks/useDebounce'
import { useI18n } from '@/_locales/client'

interface IProps {
  selectedBranch: IBranch | null
  onBranchSelect: (e: IBranch) => void
}

function Branches({ selectedBranch, onBranchSelect }: IProps) {
  const [search, setSearch] = useState('')

  const t = useI18n()
  const branchWrapperRef = useRef<any>(null)
  const debouncedSearchTerm = useDebounce(search, 700)

  const { data } = useBranchList({
    params: { page: 1, limit: 100, search: debouncedSearchTerm },
    props: {
      enabled: true,
    },
  })

  // Active Branch scroll animation
  useEffect(() => {
    if (branchWrapperRef.current) {
      branchWrapperRef.current?.childNodes?.forEach((child: any) => {
        if (child.id == selectedBranch?.id) {
          branchWrapperRef.current.scrollTo({
            top: child.offsetTop - child.parentElement.offsetTop - 8,
            left: 0,
            behavior: 'smooth',
          })
        }
      })
    }
  }, [selectedBranch])

  return (
    <>
      <BranchSearch
        value={search}
        onChange={setSearch}
        placeholder={t('search_by_name_or_branch_address')}
      />
      <Stack
        mt={5}
        px={1}
        h='full'
        maxHeight={280}
        minHeight={280}
        overflowY='auto'
        ref={branchWrapperRef}
      >
        {data?.branches?.map((branch) => (
          <Card
            key={branch.id}
            id={branch.id}
            data={branch}
            active={selectedBranch?.id === branch.id}
            onClick={() => onBranchSelect(branch)}
          />
        ))}
      </Stack>
    </>
  )
}

export default Branches
