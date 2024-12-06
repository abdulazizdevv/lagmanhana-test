import React from 'react'
import styles from './styles.module.scss'
import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { IDeliveryZone } from '@/_types'
import NumberToPrice from '@/_components/NumberToPrice'

function Marker({
  zoneData,
  hover,
  isLoading,
}: {
  zoneData?: IDeliveryZone | null
  hover: boolean
  isLoading: boolean
}) {
  return (
    <Popover placement='bottom' isOpen={Boolean(zoneData)}>
      <PopoverTrigger>
        <Box
          className={`${styles.marker} ${hover ? styles.hover : ''}`}
          transform={`translate(-50%, calc(-50% - 35px ))`}
        >
          <Center className={styles.head} bgColor={'#EC5962'}>
            <Spinner color='white' opacity={isLoading ? 1 : 0} />
          </Center>
          <div className={styles.stick} />
          <div className={styles.shadow} />
        </Box>
      </PopoverTrigger>
      {/* <PopoverContent bg='#333333' color='white' w={'fit-content'}>
        <PopoverBody>
          <Box key={zoneData?.id} fontSize={'12px'} fontWeight={400}>
            {(zoneData?.min_order_amount || 0) > 0 && (
              <Flex gap={2}>
                <Text>Минимальная сумма заказа:</Text>
                <NumberToPrice
                  value={zoneData?.min_order_amount || 0}
                  unstyled={true}
                />
              </Flex>
            )}
            <Flex gap={2}>
              <Text>Бесплатная доставка от</Text>
              <NumberToPrice
                value={zoneData?.free_delivery_order_amount || 0}
                unstyled={true}
              />
            </Flex>
          </Box>
        </PopoverBody>
      </PopoverContent> */}
    </Popover>
  )
}

export default Marker
