export default function numToPrice(num = 0, isFreeTextVisible = true) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
