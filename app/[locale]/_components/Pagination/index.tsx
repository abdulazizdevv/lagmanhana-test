import React, { useState } from 'react'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css' // Import default styles
import './paginationStyles.scss' // Import custom styles
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'

// Define props interface
interface PaginationComponentProps {
  totalItems: number // Total number of items
  itemsPerPage: number // Number of items per page
  current: any
  setCurrent: any
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalItems,
  itemsPerPage,
  current,
  setCurrent,
}) => {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const handlePageChange = (page: number) => {
    setCurrent(page)
    const queryParams = new URLSearchParams(searchParams.toString())
    queryParams.set('page', page.toString())
    const updatedUrl = `${pathName}?${queryParams.toString()}`
    router.push(`${updatedUrl}`)
  }

  return (
    <div className='pagination-container'>
      <Pagination
        current={current}
        total={totalItems}
        pageSize={itemsPerPage}
        onChange={handlePageChange}
        showSizeChanger={false} // Hide page size changer if not needed
        className='pagination'
        showTitle={false}
        prevIcon={
          <div className='custom-arrow'>
            <Icon
              icon='solar:alt-arrow-left-linear'
              width='18px'
              height='18px'
              style={{ color: 'black' }}
            />
          </div>
        }
        nextIcon={
          <div className='custom-arrow'>
            <Icon
              icon='solar:alt-arrow-right-line-duotone'
              width='18px'
              height='18px'
              style={{ color: 'black' }}
            />
          </div>
        }
      />
    </div>
  )
}

export default PaginationComponent
