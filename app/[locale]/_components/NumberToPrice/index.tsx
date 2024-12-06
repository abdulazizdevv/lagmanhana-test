"use client"

import { Flex, Text, TextProps } from "@chakra-ui/react"
import numToPrice from "@/_utils/numToPrice"
import { useSelector } from "react-redux"
import { IRedux } from "@/_types"
import { useI18n } from "@/_locales/client"
import React from "react"

interface IProps {
  value: any
  product?: any
  totalDiscountPrice?: any
  display?: any
  unstyled?: boolean
  hideCurrency?: boolean
  isFreeTextVisible?: boolean
  textProps?: TextProps
  spanProps?: TextProps
}

const NumberToPrice: React.FC<IProps> = ({
  display,
  value = 0,
  unstyled = false,
  hideCurrency = false,
  isFreeTextVisible = false,
  textProps,
  spanProps,
  product,
  totalDiscountPrice,
}) => {
  const { country } = useSelector((state: IRedux) => state.settings)
  const t = useI18n()
  return (
    <Flex align="center" gap={1} display={display}>
      {value === 0 && isFreeTextVisible ? (
        <Text {...textProps}>{t("free")}</Text>
      ) : (
        <>
          {product && product?.type === "origin" ? (
            <>
              <Text {...textProps}>
                {t("origin_from_product_price", {
                  price:
                    numToPrice(value) +
                    "" +
                    (hideCurrency ? "" : country?.currency),
                })}
              </Text>
              {/* <Text
                as="span"
                fontSize={unstyled ? "inherit" : "sm"}
                color={unstyled ? "inherit" : "#A5A5A5"}
                fontWeight={unstyled ? "inherit" : 400}
                {...spanProps}
              >
                {t("origin_from_product_price", {
                  price: value + "" + (hideCurrency ? "" : country?.currency),
                })}

                {/* {hideCurrency ? "" : country?.currency} */}
            </>
          ) : (
            <>
              <Text {...textProps}>{numToPrice(value)}</Text>
              <Text
                as="span"
                fontSize={unstyled ? "inherit" : "sm"}
                color={unstyled ? "inherit" : "#A5A5A5"}
                fontWeight={unstyled ? "inherit" : 400}
                {...spanProps}
              >
                {hideCurrency ? "" : country?.currency}
              </Text>
            </>
          )}
        </>
      )}
    </Flex>
  )
}

export default NumberToPrice
