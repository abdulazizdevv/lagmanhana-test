import { getStatus, getStatusName } from "@/_utils/getStatus"
import styles from "./style.module.scss"
import { IOrder } from "@/_types"
import { useI18n } from "@/_locales/client"
import { Card } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import NumberToPrice from "@/_components/NumberToPrice"
import { Tag, useMediaQuery } from "@chakra-ui/react"
import { useSearchParams } from "next/navigation"

export default function OrderCard({ order }: { order: IOrder }) {
  const t = useI18n()
  const [lg] = useMediaQuery("(min-width: 960px)")
  const getColor = (color: string) => {
    switch (color) {
      case "preorder":
        return "orange"
      case "cancelled":
        return "red"
      case "active":
        return "blue"
      case "finished":
        return "green"
      case "active":
        return "blue"

      default:
        return "black"
    }
  }
  const query = useSearchParams()
  const id = query?.get("id")

  return (
    <Card
      borderRadius={"24px"}
      borderWidth={2}
      py={"26px"}
      px={"16px"}
      borderStyle="solid"
      shadow={"none"}
      borderColor={order?.id === id ? "primary.500" : "transparent"}
      className={`${styles.card} ${
        order.status_id ? styles[getStatus(order.status_id)] : ""
      }`}
    >
      <div>
        <Text fontSize={24} fontWeight={700}>
          {lg ? t("order_no") : "№"}
          {order.external_order_id}
        </Text>
        <NumberToPrice
          textProps={{
            fontWeight: 700,
            fontSize: "18px",
            color: "#222222",
          }}
          spanProps={{
            fontWeight: 700,
            fontSize: "18px",
            color: "#222222",
          }}
          value={(order?.order_amount || 0) + (order?.delivery_price || 0)}
        />
      </div>
      <div>
        <Text fontSize={15} fontWeight={500} color="gray.500">
          {order.created_at &&
            new Date(order.created_at).toLocaleDateString("ru-RU")}
        </Text>
        <p className={styles.status}>
          <Tag
            borderRadius={"12px"}
            fontSize={14}
            fontWeight={500}
            colorScheme={
              order.status_id ? getColor(getStatus(order.status_id)) : ""
            }
          >
            {order?.status_id && t(`order.${getStatusName(order?.status_id)}`)}
          </Tag>
        </p>
      </div>
    </Card>
  )
}
