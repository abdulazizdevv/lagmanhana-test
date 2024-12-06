import { useCurrentLocale } from '@/_locales/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type PostTextProps = {
  data: {
    description: {
      en: string
      ru: string
      uz: string
    }
  }
}

function PostText({ data }: PostTextProps) {
  const router = useRouter()
  const currentLocale = useCurrentLocale()

  const [isLink, setIsLink] = useState(false)
  const [textArr, setTextArr] = useState<string[]>([])

  useEffect(() => {
    const txt =
      data?.description?.[currentLocale === 'kz' ? 'uz' : currentLocale] || ''
    if (txt && txt.includes('http')) {
      setIsLink(true)
      const firstIndex = txt.indexOf('http')
      const linkEnd = txt.indexOf('', firstIndex)
      const firstTextSection = txt.slice(0, firstIndex)
      const linkSection = txt.slice(firstIndex, linkEnd)
      const secondSection = txt.slice(linkEnd)
      setTextArr([firstTextSection, linkSection, secondSection])
    } else {
      setTextArr([txt])
      setIsLink(false)
    }
  }, [data, router])

  return (
    <pre
      style={{
        font: 'inherit',
        whiteSpace: 'pre-wrap',
        color: '#475467',
        // fontSize: '18px',
      }}
    >
      {textArr[0]}
      {isLink && (
        <Link
          style={{ color: '#fff' }}
          href={textArr[2]}
          target='_blank'
          rel='noreferrer'
        >
          {textArr[2]}
        </Link>
      )}
      {/* {textArr[2]} */}
    </pre>
  )
}

export default PostText
