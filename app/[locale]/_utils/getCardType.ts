export function getCardType(number: string) {
  // visa
  var re = new RegExp('^4')
  if (number.match(re) != null) return 'visa'

  // Mastercard
  // Updated for Mastercard 2017 BINs expansion
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      number
    )
  )
    return 'mastercard'

  // Visa Electron
  re = new RegExp('^(4026|417500|4508|4844|491(3|7))')
  if (number.match(re) != null) return 'visa'
  //   if (number.match(re) != null) return 'Visa Electron'

  return ''
}
