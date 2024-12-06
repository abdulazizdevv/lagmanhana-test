'use client'

import { createI18nClient } from 'next-international/client'
import kz from './kz'

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient({
  ru: () => import('./ru'),
  uz: () => import('./uz'),
  kz: () => import('./kz'),
  en: () => import('./en'),
})
