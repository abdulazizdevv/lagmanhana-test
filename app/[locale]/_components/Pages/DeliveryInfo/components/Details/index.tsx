import {
  Box,
  Center,
  Heading,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import boxTime from '@/_assets/icons/box_time.svg'
import truckTick from '@/_assets/icons/truck_tick.svg'
import wallet from '@/_assets/icons/wallet.svg'
import Image from 'next/image'
import Pattern from '@/_assets/illustration/Pattern'

function Details() {
  return (
    <Box
      bg='primary.400'
      borderRadius='24px'
      p={{ base: 4, md: '60px' }}
      color='white'
      position='relative'
      zIndex={1}
      overflow='hidden'
    >
      <Heading mb={2} textAlign='center'>
        Условия доставки в Lagmanhana
      </Heading>
      <Text mb={8} textAlign='center'>
        Доставка на дом: Как это работает и что важно знать
      </Text>
      <Wrap spacing={{ base: 6, md: 10 }}>
        <WrapItem flex={1}>
          <Card
            title='От 350 000 сум'
            subtitle='Бесплатно'
            text='Доставка от 350 000 сум абсолютно бесплатно'
            icon={wallet}
          />
        </WrapItem>
        <WrapItem flex={1}>
          <Card
            title='Доставка'
            subtitle='6 000 сум'
            text='Доставка до 350 000 Сум стоит 6 000 сум'
            icon={truckTick}
          />
        </WrapItem>
        <WrapItem flex={1}>
          <Card
            title='Доставка еды'
            subtitle='10.00-21.00. Без выходных'
            text='Если расчетное время доставки заказа превышает 22:00 - мы не можем принять заказ'
            icon={boxTime}
          />
        </WrapItem>
      </Wrap>
      <Pattern style={{ position: 'absolute', bottom: 0, left: 0 }} />
    </Box>
  )
}

function Card({
  title,
  subtitle,
  text,
  icon,
}: {
  title: string
  subtitle: string
  text: string
  icon: any
}) {
  return (
    <Stack
      bg='white'
      color='black'
      width='full'
      minW={{ sm: '200px' }}
      borderRadius='xl'
      minH='240px'
      p={4}
    >
      <Center width='44px' height='44px' rounded='full' bg='#FFD300' mb={2}>
        <Image src={icon} alt='wallet' width={24} height={24} />
      </Center>
      <Text fontSize='2xl' fontWeight={500}>
        {title}
      </Text>
      <Text fontSize='xl' fontWeight={400} color='primary.400'>
        {subtitle}
      </Text>
      <Text fontWeight={500} letterSpacing='1%'>
        {text}
      </Text>
    </Stack>
  )
}

export default Details
