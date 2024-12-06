import { createI18nServer } from 'next-international/server'
import kz from './kz'
// import ru from './en'
// import uz from './uz'

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
  createI18nServer(
    {
      ru: () => import('./ru'),
      uz: () => import('./uz'),
      en: () => import('./en'),
      kz: () => import('./kz'),
    },
    {
      segmentName: 'locale',
      fallbackLocale: kz,
    }
  )
