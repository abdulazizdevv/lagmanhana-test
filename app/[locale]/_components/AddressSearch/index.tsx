import { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useMediaQuery,
} from '@chakra-ui/react'
import AddressDropdown from './AddressDropdown'
import useDebounce from '@/_hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import { yandexService } from '@/_services/yandexService'
import { Icon } from '@iconify/react'
interface IProps {
  value: string
  placeholder: string
  onSelect: (e: any) => void
  name: string
  noDirectFocus?: boolean
  userLocation: number[] | undefined
  region: [number, number] | undefined
  onFocus?: () => void
}

interface ISuggest {
  title: { text: string }
  subtitle: { text: string }
  distance: { text: string }
  uri: string
}

function AddressSearch({
  value,
  placeholder,
  onSelect,
  name,
  userLocation,
  region = [71.392727, 42.899664],
  noDirectFocus,
  onFocus = () => {},
  ...props
}: IProps) {
  const [isFocus, setFocus] = useState(false)
  const [searchValue, onChange] = useState('')
  const [lg] = useMediaQuery('(max-width: 960px)')
  const debouncedSearch = useDebounce(searchValue, 600)

  const [placeKey, geocoderKey, suggestKey] = [
    '041412dc-b9d8-45de-8e66-484bb231e048',
    'a511ae71-c417-4b6e-93a5-a90ef35656f0',
    '76f08c5c-9b1d-40a4-b7f2-9fea4fba2f04',
  ]

  const { data: results } = useQuery({
    queryKey: ['suggest', debouncedSearch],
    queryFn: () =>
      fetchSuggest(
        {
          text: debouncedSearch,
          ull: userLocation ? String(region) : undefined,
        },
        String(region),
        suggestKey
      ),
    select: (res) => {
      return res?.data?.results?.map((item: ISuggest) => ({
        label: item?.title?.text,
        description: item?.subtitle?.text,
        distance: item?.distance?.text,
        uri: item?.uri,
      }))
    },
    retry: 1,
    enabled: Boolean(debouncedSearch && isFocus),
  })

  useEffect(() => {
    if (value) {
      onChange(value)
    }
  }, [value])

  const getLocationByUri = async (uri: string) => {
    await fetchGeocode({ uri }, geocoderKey).then((res) => {
      const result =
        res?.data?.response?.GeoObjectCollection?.featureMember?.[0]
      if (result) {
        const location = result?.GeoObject?.Point?.pos?.split(' ')
        let city = ''
        if (
          result?.GeoObject?.metaDataProperty?.GeocoderMetaData?.Address
            ?.Components
        ) {
          for (const item of result?.GeoObject?.metaDataProperty
            ?.GeocoderMetaData?.Address?.Components) {
            if (item.kind === 'locality') {
              city = item.name
            }
          }
        }
        onSelect({
          address: result?.GeoObject?.name,
          city,
          location: [Number(location[1]), Number(location[0])],
        })
      }
    })
  }

  const onLocationSelect = (val: any, type: string) => {
    // if (type === 'suggest') {
    getLocationByUri(val.uri)
    // }
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
      <InputGroup display={'flex'}>
        <InputLeftElement pointerEvents='none' height='100%' fontSize={24}>
          <Icon icon='material-symbols:search-rounded' color='#A5A5A5' />
        </InputLeftElement>
        <Input
          name={name}
          variant={'outline'}
          boxShadow={'0px 1px 2px 0px #1018280D'}
          border={'1px solid #D0D5DD'}
          placeholder={placeholder}
          h={lg ? '48px' : '40px'}
          value={searchValue}
          onChange={onInputChange}
          borderRadius={'8px'}
          onFocus={() => (noDirectFocus ? onFocus() : setFocus(true))}
          autoComplete='off'
          autoCorrect='off'
          {...props}
        />
        <InputRightElement top={lg ? 1 : 0}>
          <IconButton
            size='sm'
            variant='ghost'
            onClick={() => setFocus((prev) => !prev)}
            aria-label='toggle map search'
            icon={
              <Icon
                icon='lucide:chevron-down'
                color='#667085'
                vFlip={isFocus}
              />
            }
          />
        </InputRightElement>
      </InputGroup>
      {debouncedSearch && isFocus && (
        <AddressDropdown
          results={results}
          onSelect={onLocationSelect}
          // region={[mapGeometry[1], mapGeometry[0]]}
        />
      )}
    </Box>
  )
}

const fetchGeocode = async (params: any, apikey: string) => {
  if (apikey) {
    const response = await yandexService
      .getGeocode(params, apikey)
      .catch((err) => onError(err, apikey))

    return response
  }
  return null
}

const fetchSuggest = async (
  text: { text: string; ull: string | undefined },
  region: string,
  apikey: string
) => {
  if (apikey) {
    const response = await yandexService
      .getSuggest(text, region, apikey)
      .catch((err) => onError(err, apikey))

    return response
  }
  return null
}

const onError = (err: any, type: string) => {
  if (
    err.response.data.message === 'Invalid key' ||
    err.response.data.message === 'Limit is exceeded'
  ) {
    console.log('APIKEY: ', err.response.data.message)
  }
}

export default AddressSearch
