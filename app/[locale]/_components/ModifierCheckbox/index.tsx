import { memo } from 'react'
import Counter from '../Counter'
import classNames from 'classnames'
import NumberToPrice from '../NumberToPrice'
import { Box, Checkbox, Flex, FormLabel, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import defaultImage from '@/_assets/illustration/no_photo.svg'
import Image from 'next/image'

interface IProps {
  data: any
  checked: boolean
  quantity: number
  single?: boolean
  label: string
  outPrice: number
  increase: () => void
  decrease: () => void
  isCompulsory?: boolean
  onChange: (e: any) => void
}

function ModifierCheckbox({
  data,
  checked,
  quantity,
  single = false,
  label,
  outPrice,
  increase,
  decrease,
  isCompulsory = false,
  onChange,
}: IProps) {
  const checkboxIcon = checked ? (
    <Icon
      icon='iconamoon:check-duotone'
      color='#000'
      width='1.2em'
      height='1.2em'
    />
  ) : undefined

  return (
    <label>
      <Flex
        py={{ base: 2, md: '14px' }}
        px={{ base: 2, md: 3 }}
        display='flex'
        bgColor='paper.light.100'
        _dark={{ bgColor: 'paper.dark.400' }}
        borderRadius='lg'
        align='center'
        justify='space-between'
        fontSize='sm'
        cursor={'pointer'}
      >
        <Flex
          gap={2}
          // flexDir={{ base: 'column', md: 'row' }}
          alignItems={'center'}
        >
          {data?.image && (
            <Image
              src={
                data?.image ? process.env.BASE_URL + data.image : defaultImage
              }
              alt='modifier'
              width={40}
              height={40}
              style={{
                borderRadius: '4px',
                objectFit: 'cover',
              }}
            />
          )}
          <Flex
            gap={{ base: 0, md: 1 }}
            // flexDir={{ base: 'column', md: 'row' }}
            alignItems={'center'}
          >
            <Text fontSize='sm' maxW={label?.length > 50 ? '230px' : 'auto'}>
              {label}
            </Text>
            {/* {quantity > 0 && checked && (
      <div className={styles.counter}>
        <Counter
          variable={quantity}
          onIncrease={increase}
          onDecrease={decrease}
          size="tiny"
        />
      </div>
      )} */}
            <Flex color={'#A5A5A5'}>
              +{' '}
              <NumberToPrice
                value={outPrice ? outPrice : 0}
                textProps={{ as: 'span' }}
              />
            </Flex>
          </Flex>
        </Flex>
        <Checkbox
          size='lg'
          onChange={onChange}
          variant='outline'
          borderRadius={'4px'}
          icon={checkboxIcon}
          isChecked={
            checked
              ? true
              : !checked
              ? false
              : isCompulsory
              ? isCompulsory
              : false
          }
          sx={{
            '& .chakra-checkbox__control': {
              borderColor: '#D0D5DD',
              borderRadius: '4px',
              _checked: {
                bg: 'transparent',
                borderColor: 'primary.500',
                _hover: {
                  bg: 'white',
                },
              },
            },
            '& .chakra-checkbox__icon': {
              color: 'white',
            },
          }}
          _focus={{
            boxShadow: 'none',
          }}
        ></Checkbox>
      </Flex>
    </label>
  )
}

export default memo(ModifierCheckbox)
