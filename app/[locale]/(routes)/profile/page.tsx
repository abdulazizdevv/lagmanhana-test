import Profile from '@/_components/Pages/Profile'
import React from 'react'

import type { Metadata } from 'next'
import { getI18n } from '@/_locales/server'

// export async function generateMetadata({ params }: any): Promise<Metadata> {
//   try {
//     const t = await getI18n()

//     const title = t('seo.title_seo', {
//       title: t('profile'),
//     })

//     return {
//       title,
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${params?.locale}/profile`,
//         languages: {
//           en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/profile`,
//           ru: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/profile`,
//           uz: `${process.env.NEXT_PUBLIC_DOMAIN}/profile`,
//         },
//       },
//     }
//   } catch (error) {
//     return {
//       title: 'Chicago',
//       description: 'Description',
//     }
//   }
// }

const ProfilePage = () => {
  return (
    <>
      <Profile />
    </>
  )
}

export default ProfilePage
