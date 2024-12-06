import { Box } from "@chakra-ui/react"
import React from "react"
import styles from "../../style.module.scss"
import classNames from "classnames"
import Image from "next/image"
import { useCurrentLocale } from "@/_locales/client"
import Tags from "./components/Tags"
import defaultImage from "@/_assets/illustration/no_photo.svg"
import Rating from "./components/Rating"

function Gallery({ data }: { data: any }) {
  const currentLocale = useCurrentLocale()
  return (
    <Box className={styles.gallery}>
      <div
        className={classNames(styles.img, {
          [styles.loading]: !data,
        })}
      >
        <Rating data={data} />
        <Tags data={data?.tags} />
        <Image
          src={data?.image ? process.env.BASE_URL + data?.image : defaultImage}
          // alt={data?.title?.[currentLocale === 'kz' ? 'uz' : currentLocale]}
          alt={
            data?.title?.[currentLocale === "kz" ? "uz" : currentLocale] +
            ` - photo 1`
          }
          priority={true}
          style={{ objectFit: "cover", zIndex: 1 }}
          fill
        />
      </div>
    </Box>
  )
}

export default Gallery
