'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
// Style
import styles from './style.module.scss';
import { useEffect, useState } from 'react';
import { useCurrentLocale, useI18n } from '@/_locales/client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import orderService from '@/_services/orderService';
import reviewService from '@/_services/reviewService';
import StatusBar from '../StatusBar';
import numToPrice from '@/_utils/numToPrice';
import { IDiscount, IOrderStepsProduct } from '@/_types';
import {
  getStatusDescr,
  getStatusName,
  getTrackingStatus,
} from '@/_utils/getStatus';
import { Icon } from '@iconify/react/dist/iconify.js';
import MsgQuestionIcon from '@/_assets/icons/MsgQuestion';
import ProductCard from './components/ProductCard';
import { Rating, RoundedStar } from '@smastrom/react-rating';
import KaspiCard from '@/_components/KaspiCard';
import NumberToPrice from '@/_components/NumberToPrice';
import OrderDetail from './components/OrderDetail';
import InputComponent from '@/_components/Input';
import BreadCrumb from '@/_components/Breadcrumb';
import BackIcon from '@/_assets/icons/BackIcon';
import { useRouter } from 'next/navigation';
import QRCard from '../../Kaspi/components/QRCard';

import('dayjs/locale/ru');

// const currentLocale = 'ru'

export default function Preview({ id }: { id: string }) {
  const [rate, setRate] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [sent, setSent] = useState(false);
  const currentLocale = useCurrentLocale();
  const [showMore, setShowMore] = useState(true);
  const router = useRouter();
  const t = useI18n();

  const {
    data: order,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['order-by-id', id],
    queryFn: () => orderService.getById(id).then((res) => res.data),
    enabled: Boolean(id),
    retry: 1,
  });

  useEffect(() => setSent(false), []);

  const onSubmitReview = () => {
    const data = {
      lang: currentLocale,
      branch_id: order?.steps?.[0]?.branch_id,
      branch_name: order?.steps?.[0]?.branch_name,
      client_id: order?.client_id,
      client_mail: userEmail,
      client_name: order?.client_name,
      client_phone: order?.client_phone_number,
      courier_id: order?.courier_id,
      courier_name: `${order?.courier?.first_name} ${order?.courier?.last_name}`,
      delivery_time: order?.delivery_time,
      operator_id: order?.shipper_user?.id,
      operator_name: order?.shipper_user?.name,
      order_id: order?.id,
      order_num: order?.external_order_id,
      rating: rate,
      related_subject: 'meal', // actually, 'order' (misnamed)
      review_message: reviewMsg,
      type: rate > 3 ? 'like' : 'dislike',
    };
    reviewService
      .create(data)
      .then(() => setSent(true))
      .catch(console.log);
  };

  const BreadCrumpOrders = [
    {
      item: t('home'),
      link: '/',
    },
    {
      item: t('my_order'),
      link: '/orders',
    },
    {
      item: `Заказ №${order?.external_order_id}`,
      link: '',
    },
  ];

  if (isLoading) return <Spinner />;

  if (isError)
    return (
      <Alert status='error'>
        <AlertIcon />
        <AlertTitle>Internal Server Error!</AlertTitle>
        {/* <AlertDescription>It is not you, {"it's"} us</AlertDescription> */}
      </Alert>
    );

  return (
    <>
      <Box display={{ base: 'block', md: 'none' }}>
        <BreadCrumb items={BreadCrumpOrders} />
        <HStack align='center' mb={{ base: 4, md: 8 }}>
          {id && (
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              aria-label='Back to orders'
              icon={<BackIcon color='#000' />}
              variant={'transparent'}
              onClick={() => router.back()}
            />
          )}
          <Heading size='lg'>
            {t('order_no')}
            {order?.external_order_id}
          </Heading>
        </HStack>
      </Box>
      <Stack spacing={4}>
        <Card shadow={'none'} borderRadius='2xl' p={4}>
          <HStack justify='space-between' alignItems={'end'} mb={4}>
            <Flex
              fontWeight={700}
              gap={1}
              color={'paper.dark.800'}
              fontSize={'18px'}
            >
              <Text>{t('an_order')}</Text>
              <Text> №{order?.external_order_id}</Text>
            </Flex>
            <Text mt={2} textAlign='center' color='gray.500'>
              {dayjs(order?.created_at).format('DD.MM.YYYY')}
            </Text>
          </HStack>
          <StatusBar
            statusId={order?.status_id}
            paymentLink={order?.payment_link}
            isSelfPickup={order?.delivery_type == 'self-pickup' ? true : false}
            complex={false}
          />
          <Text mt={2} fontSize='xs' textAlign='center' color='#A5A5A5'>
            {/* {t('created')}: {dayjs(order?.created_at).format('DD.MM.YYYY')} */}
            {t(`order.${getStatusName(order?.status_id)}`)}
          </Text>
          <Divider my={4} h={1} color=' #22222212' />
          <SimpleGrid
            columns={
              2 +
              Number(Boolean(order?.payment_link)) +
              Number(Boolean(order?.courier?.phone))
            }
            gap={2}
          >
            {order?.payment_link && (
              <Link href={order?.payment_link}>
                <Button
                  variant={'ghost'}
                  bg={'paper.light.200'}
                  height='48px'
                  w='full'
                  fontSize='12px'
                  fontWeight={400}
                >
                  <Stack align='center' gap={1}>
                    <Icon
                      icon='ic:round-launch'
                      width={'20px'}
                      height={'20px'}
                    />
                    <Text>{t('go_to_the_payment')}</Text>
                  </Stack>
                </Button>
              </Link>
            )}
            {order?.courier?.phone && (
              <Link href={'tel:' + order?.courier?.phone}>
                <Button
                  variant={'ghost'}
                  bg={'paper.light.200'}
                  height='48px'
                  w='full'
                  fontSize='12px'
                  fontWeight={400}
                >
                  <Stack align='center' gap={1}>
                    <Icon
                      icon='mingcute:phone-call-line'
                      width={'20px'}
                      height={'20px'}
                    />
                    <Text fontSize='12px'>{t('call_the_courier')}</Text>
                  </Stack>
                </Button>
              </Link>
            )}
            <Link href={'/contacts'}>
              <Button
                variant={'ghost'}
                bg={'paper.light.200'}
                height='48px'
                w='full'
                fontSize='12px'
                fontWeight={400}
              >
                <Stack align='center' gap={1}>
                  <MsgQuestionIcon />
                  <Text fontSize='12px'>{t('support')}</Text>
                </Stack>
              </Button>
            </Link>
            <Link href={`/checkout?repeat=true&oid=${id}`}>
              <Button
                variant={'ghost'}
                bg={'paper.light.200'}
                height='48px'
                w='full'
                fontSize='12px'
                fontWeight={400}
              >
                <Stack align='center' gap={1}>
                  <Icon
                    icon='iconoir:refresh-circle'
                    width={'20px'}
                    height={'20px'}
                  />
                  <Text fontSize='xs'>{t('repeat')}</Text>
                </Stack>
              </Button>
            </Link>
          </SimpleGrid>
        </Card>
        {/* <Card> */}
        {/* {order?.payment_type_obj?.integration === 'kaspi' && (
          <QRCard
            link={'https://pay.kaspi.kz/pay/nipohqem'}
            price={
              (order?.delivery_price || 0) + (order?.order_amount || 0) || 0
            }
          />
        )} */}
        {/* </Card> */}
        <Card shadow={'none'} borderRadius='24px' p={4}>
          <OrderDetail order={order} />
        </Card>
        {order?.is_preorder && (
          <Card shadow={'none'} borderRadius='2xl' p={3}>
            <Text fontSize='lg' fontWeight={700} mb={4}>
              {t(
                order?.delivery_type == 'self-pickup'
                  ? 'pickup_time'
                  : 'delivery_time'
              )}
            </Text>
            <Text>
              {dayjs(order?.future_time).locale('ru').format('DD MMMM - HH:mm')}
            </Text>
          </Card>
        )}
        <Card shadow={'none'} borderRadius='2xl' p={3}>
          <Text fontSize='lg' fontWeight={700} mb={4}>
            {t('order_list')}
          </Text>
          <Stack divider={<StackDivider borderColor='#FFFFFF12' />} spacing={2}>
            {order?.steps?.[0].products.map((product: IOrderStepsProduct) => (
              <ProductCard
                key={product.id}
                product={product}
                orderData={order}
                refetch={refetch}
              />
            ))}
          </Stack>
        </Card>
        <Card shadow={'none'} borderRadius='2xl' p={3}>
          <Text fontSize='lg' fontWeight={700} mb={4}>
            {t('payment_and_delivery')}
            {/* Тип оплаты */}
          </Text>
          <Stack divider={<StackDivider borderColor='#FFFFFF12' />} spacing={2}>
            <HStack justify='space-between'>
              <Text>{t('payment_type')}</Text>
              {/* <NumberToPrice
              textProps={{
                fontWeight: 500,
                color: '#222222',
              }}
              spanProps={{
                fontWeight: 500,
                fontSize: 16,
                color: '#222222',
              }}
              value={order?.payment_type}
            /> */}
              <Text fontWeight={500}>
                {t(order?.payment_type_obj?.name[currentLocale], {})}
              </Text>
            </HStack>
            <HStack justify='space-between'>
              <Text>{t('cost_of_goods')}</Text>
              <NumberToPrice
                textProps={{
                  fontWeight: 500,
                  color: '#222222',
                }}
                spanProps={{
                  fontWeight: 500,
                  fontSize: 16,
                  color: '#222222',
                }}
                value={order?.steps?.[0]?.step_amount}
              />
            </HStack>
            <HStack justify='space-between'>
              <Stack gap={1}>
                <Text>{t('cost_of_delivery')}</Text>
                {/* <Text fontSize='sm' color='#A5A5A5' lineHeight={1}>
                {order?.delivery_type == 'delivery'
                  ? order?.to_address
                    ? order?.to_address
                    : t('unknown')
                  : order?.steps[0]?.address
                  ? order?.steps[0]?.address
                  : t('unknown')}
              </Text> */}
              </Stack>
              <NumberToPrice
                textProps={{
                  fontWeight: 500,
                  color: '#222222',
                }}
                spanProps={{
                  fontWeight: 500,
                  fontSize: 16,
                  color: '#222222',
                }}
                value={order?.delivery_price}
              />
            </HStack>
            {order?.discounts?.length > 0 &&
              order?.discounts?.map((discount: IDiscount) => (
                <HStack justify='space-between' key={discount.id}>
                  <Text>
                    {t(
                      discount?.type || discount?.promo_code
                        ? 'promo_code'
                        : 'discount'
                    )}
                  </Text>

                  <Text>
                    {discount?.type === 'promo_code' ? (
                      <pre style={{ display: 'inline' }}>
                        {discount?.promo_code}
                      </pre>
                    ) : (
                      discount.name?.[
                        currentLocale === 'kz' ? 'uz' : currentLocale
                      ]
                    )}
                  </Text>
                </HStack>
              ))}
            {order?.payment?.length > 1 &&
              order?.payment?.map((item: any) => (
                <HStack justify='space-between' key={item?.id}>
                  <Text>{item?.payment_type_obj?.name[currentLocale]}</Text>
                  <NumberToPrice
                    textProps={{
                      fontWeight: 500,
                      color: '#222222',
                    }}
                    spanProps={{
                      fontWeight: 500,
                      fontSize: 16,
                      color: '#222222',
                    }}
                    value={item?.paid_amount}
                  />
                </HStack>
              ))}
            <HStack justify='space-between'>
              <Text fontWeight={700} fontSize='lg'>
                {t('total')}
              </Text>
              <Text fontWeight={700} fontSize='lg'>
                {order?.discounts?.length > 0 &&
                  order?.delivery_price + order?.order_amount !==
                    order?.delivery_price + order?.steps?.[0]?.step_amount && (
                    <Text
                      as='span'
                      fontSize='sm'
                      color='#A5A5A5'
                      fontWeight={400}
                      textDecoration='line-through'
                    >
                      {numToPrice(
                        order?.delivery_price + order?.steps?.[0]?.step_amount
                      )}
                    </Text>
                  )}
                <NumberToPrice
                  textProps={{
                    fontWeight: 500,
                    color: '#222222',
                  }}
                  spanProps={{
                    fontWeight: 500,
                    fontSize: 16,
                    color: '#222222',
                  }}
                  value={order?.delivery_price + order?.order_amount || 0}
                />
              </Text>
            </HStack>
          </Stack>
        </Card>
        {/* <Card borderRadius="2xl" p={3}>
        {order?.delivery_type === 'delivery' ? (
          <div className={classNames(styles.courier, 'mt-3')}>
            <p>{t('courier_contacts')}</p>
            {order?.courier?.first_name && order?.courier?.phone ? (
              <>
                <a
                  href={`tel:+${order?.courier?.phone}`}
                  className={styles.flexbox_align_center}
                >
                  {order?.courier?.phone}
                </a>
              </>
            ) : (
              <p>{t('courier_not_assigned_yet')}</p>
            )}
          </div>
        ) : (
          order?.steps[0]?.phone_number && (
            <div className={classNames(styles.courier, 'mt-3')}>
              <p>{t('phone_number')}</p>
              <a
                href={`tel:${order?.steps[0]?.phone_number}`}
                className={styles.flexbox_align_center}
              >
                {order?.steps[0]?.phone_number}
              </a>
            </div>
          )
        )}
      </Card> */}
        {!order?.paid && order?.payment_type === 'kaspi' && (
          <KaspiCard
            link={order?.payment_link}
            price={order?.delivery_price + order?.order_amount || 0}
          />
        )}
        {sent ? (
          <Alert status='success'>{t('successfully_sent')}</Alert>
        ) : (
          getTrackingStatus(order?.status_id) === 'delivered' && (
            <Card shadow={'none'} borderRadius='2xl' p={3}>
              <HStack
                align='center'
                justify='space-between'
                mb={!order?.review ? 3 : 0}
              >
                <Text fontSize='lg' fontWeight={700}>
                  Оценка
                </Text>
                {!order?.review && (
                  <Rating
                    readOnly={Boolean(order?.review_id)}
                    style={{ maxWidth: 100 }}
                    value={!order?.review_id ? rate : order?.rating}
                    itemStyles={{
                      itemShapes: RoundedStar,
                      activeFillColor: '#FFC500',
                      inactiveFillColor: '#E0E8F1',
                    }}
                    onChange={(newValue: number) => {
                      setRate(newValue);
                    }}
                  />
                )}
              </HStack>
              <Stack spacing={2}>
                {!order?.review_id ? (
                  <>
                    <FormControl>
                      <FormLabel>{t('email')}</FormLabel>
                      <InputComponent
                        type='email'
                        placeholder='example@gmail.com'
                        value={userEmail}
                        onChange={(e) => setUserEmail(e)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>{t('your_feedback')}</FormLabel>
                      <Textarea
                        value={reviewMsg}
                        className={styles.button}
                        placeholder={t('describe_your_impressions')}
                        onChange={(e) => setReviewMsg(e.target.value)}
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
                        boxShadow='0px 1px 2px 0px #1018280D'
                        border='1px solid #D0D5DD'
                      />
                    </FormControl>
                    <Button
                      mt={4}
                      onClick={onSubmitReview}
                      variant={'primary'}
                      isDisabled={rate < 1}
                    >
                      {t('send')}
                    </Button>
                  </>
                ) : (
                  // <Text>{order?.review}</Text>
                  <Stack p={2} mt={2} borderRadius={8} bg={'#F9FAFB'}>
                    <Flex>
                      <Text fontSize={14}>{t('your_feedback')}</Text>
                    </Flex>
                    <Box>
                      {/* <Text>{product?.review?.rating}</Text> */}
                      <Rating
                        readOnly={Boolean(order?.review)}
                        style={{ maxWidth: 100 }}
                        value={!order?.review_id ? rate : order?.rating}
                        itemStyles={{
                          itemShapes: RoundedStar,
                          activeFillColor: '#FFC500',
                          inactiveFillColor: '#E0E8F1',
                        }}
                      />
                      <Text mt={'2px'} fontSize={12} lineHeight={'17px'}>
                        {showMore
                          ? order?.review
                          : order?.review?.substring(0, 140) + '...'}
                      </Text>
                      {order?.review?.length > 140 && (
                        <Button
                          w='fit-content'
                          color={'primary.500'}
                          fontSize='xs'
                          variant='link'
                          fontWeight={400}
                          transform={`translateY(${showMore ? 0 : -5}px)`}
                          onClick={() => setShowMore((prev) => !prev)}
                        >
                          {showMore ? 'Показать меньше' : 'Показать больше'}
                        </Button>
                      )}
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Card>
          )
        )}
      </Stack>
    </>
  );
}
