import { useCurrentLocale } from '@/_locales/client'
import { ITag } from '@/_types'
import { Avatar, AvatarGroup } from '@chakra-ui/react'

const Tags = ({ data }: { data: ITag[] }) => {
  const currentLocale = useCurrentLocale()

  if (data?.length > 0) {
    return (
      <AvatarGroup
        size='sm'
        top={'20px'}
        left={0}
        px={1.5}
        py={0.5}
        zIndex={2}
        bgColor='white'
        position='absolute'
        borderRightRadius='full'
      >
        {data?.map((tag, index) => (
          <Avatar
            key={tag.slug}
            name={tag?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
            src={tag.icon ? process.env.BASE_URL + tag.icon : ''}
            zIndex={index}
          />
        ))}
      </AvatarGroup>
    )
  }
}

export default Tags
