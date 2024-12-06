'use client'

import React, { memo, useRef, useState } from 'react'
import Counter from '../Counter'
import { Button } from '@chakra-ui/react'
// import useSound from 'use-sound'

interface IProps {
  quantity: number
  isOrdered: boolean
  onClick: () => void
  setQuantity: (e: number) => void
  onRemove: () => void
  children: React.ReactNode
  padding: any
  rounded: any
  isDisabled?: boolean
}

function AddToCart({
  onClick,
  quantity,
  setQuantity,
  onRemove,
  isOrdered,
  children,
  padding,
  isDisabled = false,
  rounded,
}: IProps) {
  // const [play] = useSound('../../../../public/sounds/audio.mp3')
  const [count, setCount] = useState(quantity || 1)

  const debounce = useRef(setTimeout(() => {}, 300))

  const onIncreaseDebounce = () => {
    setCount((prev) => ++prev)
    clearTimeout(debounce.current)

    debounce.current = setTimeout(() => {
      setQuantity(count)
    }, 300)
  }
  const onDecreaseDebounce = () => {
    if (count > 1) {
      setCount((prev) => --prev)
      clearTimeout(debounce.current)

      debounce.current = setTimeout(() => {
        setQuantity(count)
      }, 300)
    } else {
      onRemove()
      setCount(1)
    }
  }

  var onClickCardHandler = () => {
    // play()
    onClick()
  }

  return isOrdered ? (
    <Counter
      rounded={rounded}
      padding={padding}
      variable={count}
      onIncrease={onIncreaseDebounce}
      onDecrease={onDecreaseDebounce}
      width={{ base: 'full', md: 'full' }}
      bg='paper.light.400'
      color={'paper.dark.900'}
    />
  ) : (
    <Button
      borderRadius={'12px'}
      variant={'solid'}
      onClick={onClickCardHandler}
      w={'full'}
      bg='paper.light.400'
      color={'paper.dark.900'}
      // _hover={{
      //   bg: ' #EEE3FB',
      //   // color: '#fff',
      // }}
      // _focus={{
      //   bg: '#EADFF7',
      // }}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  )
}

export default memo(AddToCart)
