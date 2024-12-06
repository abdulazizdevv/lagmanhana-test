import {
  Button,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react'
import Comment from './Comment'
import { useI18n } from '@/_locales/client'
import { Icon } from '@iconify/react/dist/iconify.js'
import NoReview from '@/_assets/illustration/NoReview'
import { IReview } from '@/_types'
import BackIcon from '@/_assets/icons/BackIcon'

interface IProps {
  isOpen: boolean
  reviews: IReview[]
  handleClose: () => void
}

function Comments({ isOpen, reviews, handleClose }: IProps) {
  const t = useI18n()

  return (
    <Drawer isOpen={isOpen} placement='right' size='md' onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          p={4}
          gap={2}
          display='flex'
          flexDir={{ base: 'row-reverse', md: 'row' }}
          justifyContent={{ base: 'flex-end', md: 'space-between' }}
        >
          {t('reviews')}
          <IconButton
            size='sm'
            variant={'outline'}
            display={{ base: 'none', md: 'flex' }}
            border={'none'}
            fontSize={20}
            onClick={handleClose}
            aria-label='close reviews'
            icon={<Icon icon='material-symbols:close-rounded' />}
          />
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            size='sm'
            border={'none'}
            variant={'outline'}
            fontSize={20}
            onClick={handleClose}
            aria-label='close reviews'
            icon={<BackIcon color='#000' />}
          />
        </DrawerHeader>
        <Divider />
        <Text px={4} fontSize={12} py={4}>
          {reviews?.length > 0 && reviews?.length + ' отзывов'}
        </Text>
        <DrawerBody p={4}>
          {reviews?.length > 0 ? (
            <Stack display={'flex'} gap={'10px'}>
              {reviews?.map((item: any) => {
                return <Comment key={item.id} data={item} />
              })}
            </Stack>
          ) : (
            <Center h='100%' flexDir='column'>
              <NoReview />
              <Heading fontSize='24px' fontWeight={500} mb={2} mt={6}>
                {t('no_reviews_yet')}
              </Heading>
              <Text color='#A5A5A5' mb={4} textAlign='center' maxW='300px'>
                {t('share_your_opinion_and_help_make_company_better')}
              </Text>
              {/* <Button variant="primary">Оставить отзыв</Button> */}
            </Center>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default Comments
