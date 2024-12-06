import { Splide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

import styles from './style.module.scss'

interface ICarousel {
  options?: object
  children?: React.ReactNode
}

function MultipleSlide({ options, children }: ICarousel) {
  const defaultOptions = {
    perPage: 4,
    classes: {
      prev: styles.slidePrevBtn,
      next: styles.slideNextBtn,
    },
  }

  return (
    <Splide
      options={{
        ...defaultOptions,
        pagination: false,
        // padding: { bottom: '1rem' },
        breakpoints: {
          1000: {
            arrows: false,
            perPage: 4,
            gap: '16px',
          },
          880: {
            arrows: false,
            perPage: 3,
            gap: '8px',
          },
          700: {
            arrows: false,
            perPage: 2,
            gap: '8px',
          },
          640: {
            arrows: false,
            perPage: 2,
            gap: '8px',
          },
        },
        ...options,
      }}
    >
      {children}
    </Splide>
  )
}

export default MultipleSlide
