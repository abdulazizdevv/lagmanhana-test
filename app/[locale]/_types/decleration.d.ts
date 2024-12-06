declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

declare module '*.svg'
declare module '*.jpg'
declare module '*.png'

declare module '@splidejs/react-splide' {
  export { Options } from '@splidejs/splide'
  export { Splide, SplideSlide } from '@splidejs/react-splide'
}
