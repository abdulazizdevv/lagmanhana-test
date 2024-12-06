// app/fonts.ts
import localFont from 'next/font/local'

const GTWalsheimPro = localFont({
  src: [
    {
      path: './_assets/fonts/GTWalsheimPro/GTWalsheimPro-Thin.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './_assets/fonts/GTWalsheimPro/GTWalsheimPro-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './_assets/fonts/GTWalsheimPro/GTWalsheimPro-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './_assets/fonts/GTWalsheimPro/GTWalsheimPro-Bold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
})

export const fonts = {
  GTWalsheimPro,
}
