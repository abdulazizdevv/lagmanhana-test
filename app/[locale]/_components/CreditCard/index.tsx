import Image from "next/image"
import cardbg from "@/_assets/illustration/cashback_bg.svg"
import { Flex, Text } from "@chakra-ui/react"
import NumberToPrice from "../NumberToPrice"

export default function CreditCard({ amount = 0 }) {
  return (
    <Flex
      height={14}
      position="relative"
      borderRadius={8}
      overflow="hidden"
      align="center"
      px={6}
    >
      <Image src={cardbg} alt="patterns" style={{ objectFit: "cover" }} fill />
      <Text fontSize="2xl" fontWeight={700} color="white" zIndex={2}>
        <NumberToPrice value={amount} unstyled={true} />
      </Text>
    </Flex>
  )
}
