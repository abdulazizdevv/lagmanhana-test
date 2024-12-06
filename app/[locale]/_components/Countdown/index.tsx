import { useEffect, useState } from 'react'
import { Text } from '@chakra-ui/react'

export default function Countdown({ value = 0, onTimeout = () => {} }) {
  const [minute, setMinute] = useState(value / 60)
  const [second, setSecond] = useState(value % 60)

  useEffect(() => {
    let interval = setInterval(() => {
      if (second > 0) {
        setSecond(second - 1)
      }
      if (second === 0) {
        if (minute === 0) {
          onTimeout()
          clearInterval(interval)
        } else {
          setMinute(minute - 1)
          setSecond(59)
        }
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })

  return (
    <span>
      {minute > 9 ? minute : <>0{minute}</>}:
      {second > 9 ? second : <>0{second}</>}
    </span>
  )
}
