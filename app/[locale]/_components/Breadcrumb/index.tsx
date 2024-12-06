'use client'

import React, { useEffect, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'

interface BreadCrumbProps {
  items: { item: string; link: string }[]
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items }) => {
  const separator = useBreakpointValue({
    base: (
      <Icon
        icon='icon-park-outline:right'
        width='1.2em'
        height='1.2em'
        style={{ color: '#667085' }}
      />
    ),
    md: '/',
  })

  // const [breadCrumbJson, setBreadCrumbJson] = useState('')

  // useEffect(() => {
  //   const breadCrumbListMicrodata = {
  //     '@context': 'https://schema.org',
  //     '@type': 'BreadcrumbList',
  //     itemListElement: items.map((item, index) => {
  //       return (
  //         item?.item && {
  //           '@type': 'ListItem',
  //           position: index + 1,
  //           item: {
  //             '@id': `${process.env.NEXT_PUBLIC_DOMAIN}${item.link}`,
  //             name: item.item,
  //           },
  //         }
  //       )
  //     }),
  //   }
  //   setBreadCrumbJson(JSON.stringify(breadCrumbListMicrodata))
  // }, [items])

  return (
    <>
      <Breadcrumb
        height={'40px'}
        display={'flex'}
        separator={
          <BreadcrumbSeparator color='#667085'>{separator}</BreadcrumbSeparator>
        }
      >
        {items?.map(
          (el, index) =>
            el.item !== '' && (
              <BreadcrumbItem key={el.item}>
                {index !== items.length - 1 ? (
                  <BreadcrumbLink
                    href={`${el.link}`}
                    color={'#667085'}
                    fontSize={{ base: '14px', md: '12px' }}
                  >
                    {el.item}
                  </BreadcrumbLink>
                ) : (
                  <Text fontSize={{ base: '14px', md: '12px' }}>{el.item}</Text>
                )}
              </BreadcrumbItem>
            )
        )}
      </Breadcrumb>
      {/* <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: breadCrumbJson }}
      /> */}
    </>
  )
}

export default BreadCrumb
