import { Box, Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'
import styles from './style.module.scss'
import { useCurrentLocale } from '@/_locales/client'
import { Icon } from '@iconify/react/dist/iconify.js'

function OriginOptions({
  originProps,
  activeOptions,
  productVariants,
  onOptionChange,
}: any) {
  const currentLocale = useCurrentLocale()

  return (
    originProps?.length > 0 && (
      <Stack gap={6} my={2}>
        {originProps?.map((property: any, idx: number) => (
          <div key={property.id}>
            <Flex direction='column' gap={0}>
              <Text fontSize='sm' fontWeight={600} mb={2}>
                {
                  property.title?.[
                    currentLocale === 'kz' ? 'uz' : currentLocale
                  ]
                }
              </Text>
              <RadioGroup
                aria-labelledby={property.title.en}
                value={activeOptions[idx]}
                onChange={(e) => onOptionChange(e, idx)}
              >
                <Stack>
                  {property?.options?.map((option: any) =>
                    idx !== 0
                      ? Object.keys(productVariants).some((item) =>
                          item.includes(
                            idx == 1
                              ? activeOptions[0] + '_' + option.id
                              : idx == 2
                              ? activeOptions[0] +
                                '_' +
                                activeOptions[1] +
                                '_' +
                                option.id
                              : activeOptions[0] +
                                '_' +
                                activeOptions[1] +
                                '_' +
                                activeOptions[2] +
                                '_' +
                                option.id
                          )
                        ) && (
                          <Flex
                            as={'label'}
                            htmlFor={option.id}
                            py={'14px'}
                            px={3}
                            fontSize='sm'
                            cursor='pointer'
                            borderRadius='lg'
                            bgColor='paper.light.100'
                            _dark={{
                              bgColor: 'paper.dark.400',
                            }}
                          >
                            <Text flex={1} fontSize='sm'>
                              {
                                option.title?.[
                                  currentLocale === 'kz' ? 'uz' : currentLocale
                                ]
                              }
                            </Text>
                            {option.id !== activeOptions[idx] ? (
                              <Box
                                w={'20px'}
                                h={'20px'}
                                borderRadius={'full'}
                                border={'1px solid gray'}
                              ></Box>
                            ) : (
                              <Icon
                                color='#000'
                                icon='radix-icons:radiobutton'
                                width='20px'
                                height='20px'
                              />
                            )}
                            <Radio
                              size='lg'
                              colorScheme='primary'
                              id={option.id}
                              key={option.id}
                              value={option.id}
                              display='none'
                            />
                          </Flex>
                        )
                      : idx == 0 &&
                        Object.keys(productVariants).some((item) =>
                          item.split('_').includes(option.id)
                        ) && (
                          <Flex
                            as={'label'}
                            htmlFor={option.id}
                            bgColor='paper.light.100'
                            py={'14px'}
                            px={3}
                            fontSize='sm'
                            cursor='pointer'
                            borderRadius='lg'
                            _dark={{
                              bgColor: 'paper.dark.400',
                            }}
                          >
                            <Text flex={1} fontSize='sm'>
                              {
                                option.title?.[
                                  currentLocale === 'kz' ? 'uz' : currentLocale
                                ]
                              }
                            </Text>
                            {option.id !== activeOptions[idx] ? (
                              <Box
                                w={'20px'}
                                h={'20px'}
                                borderRadius={'full'}
                                border={'1px solid gray'}
                              ></Box>
                            ) : (
                              <Icon
                                color='#000'
                                icon='radix-icons:radiobutton'
                                width='23px'
                                height='23px'
                              />
                            )}
                            <Radio
                              size='lg'
                              colorScheme='primary'
                              id={option.id}
                              key={option.id}
                              value={option.id}
                              display='none'
                            />
                          </Flex>
                        )
                  )}
                </Stack>
              </RadioGroup>
            </Flex>
          </div>
        ))}
      </Stack>
    )
  )
}

export default OriginOptions
