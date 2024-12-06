import Card from '@/_components/Card'
import { useI18n } from '@/_locales/client'
import { Box, SimpleGrid } from '@chakra-ui/react'

function Subcategory({ data, active }: any) {
  const t = useI18n()
  return (
    <Box id={data?.slug} mt={{ base: 2, lg: 4 }}>
      <SimpleGrid
        spacing={{ base: 2, lg: 4 }}
        columns={{ base: 2, md: 3, lg: 4 }}
      >
        {data?.products &&
          data?.products?.map((product: any, idx: number) => (
            <Card
              h1={t('seo.h1_main')}
              index={idx + 1}
              key={product.id}
              product={product}
            />
          ))}
      </SimpleGrid>
    </Box>
  )
}

export default Subcategory
