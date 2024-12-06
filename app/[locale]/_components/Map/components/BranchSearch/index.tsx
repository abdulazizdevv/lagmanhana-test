import useDebounce from '@/_hooks/useDebounce'
import React, { useState } from 'react'
import Dropdown from './components/Dropdown'
import { useBranchList } from '@/_services/branches'
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
import { useI18n } from '@/_locales/client'
import ChevronDown from '@/_assets/icons/ChevronDown'
import { IBranch } from '@/_types'
import { Icon } from '@iconify/react/dist/iconify.js'

function BranchSearch({
  selected,
  onResultSelect = () => {},
}: {
  selected: IBranch | null
  onResultSelect: (e: any) => void
}) {
  const [isFocus, setFocus] = useState(false)
  const [searchValue, onChange] = useState('')

  const t = useI18n()
  const debouncedSearch = useDebounce(searchValue, 600)

  const { data: results, isLoading } = useBranchList({
    params: { page: 1, limit: 100, search: selected ? '' : debouncedSearch },
    props: {
      retry: 1,
      enabled: Boolean(isFocus),
    },
  })

  const onBranchSelect = (val: any) => {
    onResultSelect(val)
    onChange(val?.name)
    setFocus(false)
  }

  const onInputChange = (e: any) => {
    onChange(e.target.value)
    if (selected) {
      onResultSelect(null)
    }
    if (!isFocus) {
      setFocus(true)
    }
  }

  return (
    <Box position='relative'>
      <InputGroup>
        <InputLeftElement pointerEvents='none' height='100%' fontSize={24}>
          {/* <SearchIcon /> */}
          <Icon icon='circum:search' style={{ color: '6C6C6C' }} />
        </InputLeftElement>
        <Input
          variant='outline'
          placeholder={t('search_by_name')}
          value={searchValue}
          onChange={onInputChange}
          onFocus={() => setFocus(true)}
          autoComplete='off'
          autoCorrect='off'
        />
        <InputRightElement>
          <IconButton
            size='sm'
            variant='ghost'
            onClick={() => setFocus((prev) => !prev)}
            aria-label='toggle map search'
            icon={<ChevronDown />}
            transform={isFocus ? 'rotate(180deg)' : ''}
          />
        </InputRightElement>
      </InputGroup>
      {isFocus && !isLoading && (
        <Dropdown
          results={results?.branches}
          onSelect={onBranchSelect}
          // region={[mapGeometry[1], mapGeometry[0]]}
        />
      )}
    </Box>
  )
}

export default BranchSearch
