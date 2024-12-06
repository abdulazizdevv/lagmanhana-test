'use client'

import React, { useRef } from 'react'
import CatalogBar from '@/_components/Catalogbar'
import FixedMenu from '@/_components/FixedMenu'
import { Box } from '@chakra-ui/react'

function Catalog({ products, categories }: any) {
  const catalogRef = useRef<any>()
  return (
    <>
      <FixedMenu
        data={categories}
        products={products}
        instanceRef={catalogRef}
      />
      <Box ref={catalogRef}>
        <CatalogBar data={categories} />
      </Box>
    </>
  )
}

export default Catalog
