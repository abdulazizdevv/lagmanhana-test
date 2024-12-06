import { Button, Card, CardBody, Spinner, Stack, Text } from "@chakra-ui/react"
import Image from "next/image"
import React from "react"
import logo_qr from "@/_assets/payment/kaspi_qr.svg"
import kaspi_gold from "@/_assets/payment/kaspi_gold.svg"
import { QRCodeCanvas } from "qrcode.react"
import NumberToPrice from "@/_components/NumberToPrice"
import { useI18n } from "@/_locales/client"
import { useRouter } from "next/navigation"

function QRCard({ price }: { price: number }) {
  const t = useI18n()
  const router = useRouter()

  return (
    <Card borderRadius="2xl" w="full">
      <CardBody>
        <Stack
          bg="white"
          borderRadius="2xl"
          // p={10}
          color="#000000"
          gap={2}
          align="center"
        >
          <Image src={logo_qr} alt="KASPI QR" width={200} height={52} />
          <Text>Сканируйте и платите</Text>
          <Text fontSize="46px" fontWeight={700} mb={4}>
            <NumberToPrice value={price} unstyled={true} />
          </Text>
          <QRCodeCanvas
            value={"https://pay.kaspi.kz/pay/nipohqem"}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"M"}
            includeMargin={false}
            imageSettings={{
              src: "/kaspi_rec.svg",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />

          <Text fontSize="sm" mb={2}>
            {t("payment_method_2")}
          </Text>
          <Image src={kaspi_gold} alt="Kaspi Gold" width={56} height={44} />
        </Stack>
      </CardBody>
    </Card>
  )
}

export default QRCard
