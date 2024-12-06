'use client'

import React, { useMemo } from 'react'
import {
  TabList,
  Tabs,
  Tab,
  TabIndicator,
  useColorModeValue,
} from '@chakra-ui/react'

interface ITabs {
  index?: number
  size?: 'sm' | 'md' | 'lg'
  tabs: { label: string; value: string }[]
  panels?: React.ReactNode
  defaultValue?: string
  isSwitchVisible?: boolean
  style?: { [key: string]: string | number }
  onChange: (e: string) => void
}

function CTabs({
  index,
  size = 'md',
  tabs,
  defaultValue,
  isSwitchVisible = true,
  panels,
  style,
  onChange,
}: ITabs) {
  const defaultIndex = useMemo(
    () => tabs.findIndex((item) => item.value === defaultValue),
    [defaultValue, tabs]
  )

  const onChangeHandler = (i: number) => {
    const selected: string = tabs[i].value
    onChange(selected)
  }

  return (
    <Tabs
      style={style}
      zIndex={1}
      size={size}
      index={index}
      variant='unstyled'
      onChange={onChangeHandler}
      defaultIndex={defaultIndex}
    >
      {isSwitchVisible && (
        <TabList
          p={{ base: 1 }}
          rounded='full'
          position='relative'
          bgColor='paper.light.100'
          _dark={{
            bgColor: 'paper.dark.100',
          }}
          zIndex={1}
        >
          {tabs.map((item) => (
            <Tab
              key={item.value}
              flex={1}
              fontWeight={500}
              py={{ base: 1.5, md: 2 }}
              fontSize={{ base: 'sm', md: 'md' }}
              lineHeight='20px'
              whiteSpace='nowrap'
              _selected={{ color: 'white' }}
            >
              {item.label}
            </Tab>
          ))}
          <TabIndicator
            height={{ base: 8, md: 9 }}
            bgColor='primary.400'
            rounded='full'
            top={{ base: 1 }}
            zIndex={-1}
          />
        </TabList>
      )}

      {panels}
    </Tabs>
  )
}

export default CTabs
