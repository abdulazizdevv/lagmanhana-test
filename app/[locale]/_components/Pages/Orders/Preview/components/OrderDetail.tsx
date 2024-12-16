import { useI18n } from '@/_locales/client';
import { IOrder } from '@/_types';
import { Box, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';

const OrderDetail = ({ order }: { order: IOrder }) => {
  const t = useI18n();
  return (
    <Box>
      <Text fontSize={18} fontWeight={700}>
        {t('order_details')}
      </Text>
      <Stack spacing={{ base: 2, md: 4 }} divider={<Divider />} mt={4}>
        {order?.delivery_type === 'delivery' && (
          <Flex
            flexDir={{ base: 'column', md: 'row' }}
            justifyContent={'space-between'}
          >
            <Text color={'#222222'}>{t('address')}</Text>
            <Text
              textAlign={{ base: 'left', md: 'right' }}
              fontWeight={500}
              maxW={'350px'}
            >
              {order?.delivery_type == 'delivery'
                ? order?.to_address
                  ? order?.to_address
                  : t('unknown')
                : order?.steps[0]?.address
                ? order?.steps[0]?.address
                : t('unknown')}
            </Text>
          </Flex>
        )}
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          justifyContent={'space-between'}
        >
          <Text color={'#222222'}>{t('restaurant')}</Text>
          <Text fontWeight={500}>{order?.steps[0]?.branch_name}</Text>
        </Flex>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          justifyContent={'space-between'}
        >
          <Text color={'#222222'}>{t('order_type')}</Text>
          <Text fontWeight={500}>
            {order?.delivery_type === 'delivery'
              ? t('delivery')
              : t('takeaway')}
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
};

export default OrderDetail;
