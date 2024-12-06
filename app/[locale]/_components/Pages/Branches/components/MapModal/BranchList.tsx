import useDebounce from '@/_hooks/useDebounce'
import React, { useState } from 'react'
import { useBranchList } from '@/_services/branches'
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useMediaQuery,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useI18n } from '@/_locales/client'
import { fonts } from '@/fonts'
import Dropdown from '@/_components/Map/components/BranchSearch/components/Dropdown'
// import Dropdown from '@/_components/Header/components/OrderTypes/components/Takeaway/components/BranchSearch/components/Dropdown'

function BranchList({
  onResultSelect = () => {},
  tabIndex,
}: {
  onResultSelect: (e: any) => void
  tabIndex?: number
}) {
  const [isFocus, setFocus] = useState(false)
  const [searchValue, onChange] = useState('')
  const [isActiveBranch, setIsActiveBranch] = useState('')
  const [lg] = useMediaQuery('(max-width: 960px)')
  const t = useI18n()
  const debouncedSearch = useDebounce(searchValue, 600)

  const { data: results } = useBranchList({
    params: { page: 1, limit: 100, search: debouncedSearch },
    props: {
      retry: 1,
      enabled: Boolean(isFocus),
    },
  })

  const onBranchSelect = (val: any) => {
    onResultSelect(val)
    onChange(val?.name)
    setIsActiveBranch(val?.id)
    setFocus(false)
  }

  const onInputChange = (e: any) => {
    onChange(e.target.value)
    if (!isFocus) {
      setFocus(true)
    }
  }

  return (
    <Box position='relative'>
      <InputGroup>
        <InputLeftElement pointerEvents='none' height='100%' fontSize={24}>
          <Icon icon='material-symbols:search-rounded' color='#A5A5A5' />
        </InputLeftElement>
        <Input
          // variant='outline'
          placeholder={t('name_branch')}
          value={searchValue}
          onChange={onInputChange}
          // onFocus={() => setFocus(true)}
          autoComplete='off'
          autoCorrect='off'
          borderRadius={12}
          height={'48px'}
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
          boxShadow={'0px 1px 2px 0px #1018280D'}
          border={'1px solid #D0D5DD'}
        />
        <InputRightElement mt={1}>
          <IconButton
            size='sm'
            variant='ghost'
            onClick={() => setFocus((prev) => !prev)}
            aria-label='toggle map search'
            icon={<Icon icon='lucide:chevron-down' vFlip={isFocus} />}
          />
        </InputRightElement>
      </InputGroup>
      {isFocus && (
        <Dropdown
          results={results?.branches}
          onSelect={onBranchSelect}
          // region={[mapGeometry[1], mapGeometry[0]]}
        />
      )}
    </Box>
  )
}

export default BranchList
