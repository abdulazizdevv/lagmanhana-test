import { useCurrentLocale } from '@/_locales/client'
import { IProduct } from '@/_types'
import { Box, Button } from '@chakra-ui/react'
import classNames from 'classnames'
import React, { useState } from 'react'
import styles from '../../style.module.scss'

function Description({ data }: { data: IProduct }) {
  const [showMore, setShowMore] = useState(false)
  const currentLocale = useCurrentLocale()

  return (
    data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale]?.trim()
      ?.length > 0 && (
      <>
        <Box
          mb={2}
          fontSize='xs'
          position='relative'
          className={classNames(styles.description, {
            [styles.loading]: !data,
          })}
        >
          <pre
            style={{
              font: 'inherit',
              whiteSpace: 'pre-wrap',
              opacity: 0.6,
            }}
          >
            {showMore
              ? data?.description?.[
                  currentLocale === 'kz' ? 'uz' : currentLocale
                ]
              : data?.description?.[
                  currentLocale === 'kz' ? 'uz' : currentLocale
                ]?.substring(0, 140)}
          </pre>
          {data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale]
            ?.length > 140 && (
            <Box
              position='absolute'
              top={0}
              left={0}
              w='full'
              h='full'
              maxH={showMore ? 0 : 'auto'}
              opacity={showMore ? 0 : 1}
              transition='150ms ease-in-out'
              // background='linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, #1A1A1A 100%)'
            ></Box>
          )}
        </Box>
        {data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale]
          ?.length > 140 && (
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
      </>
    )
  )
}

export default Description
