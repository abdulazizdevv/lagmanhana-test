export const isLightColor = (color: string): boolean => {
  const colorMappings: { [key: string]: string } = {
    red: '#FF0000',
    blue: '#0000FF',
    yellow: '#FFFF00',
    green: '#008000',
  }

  const hexColor = colorMappings[color.toLowerCase()] || color

  if (
    hexColor.toUpperCase() === '#FF0000' ||
    hexColor.toLowerCase() === 'red' ||
    hexColor.toUpperCase() === '#0000FF' ||
    hexColor.toLowerCase() === 'blue' ||
    hexColor.toUpperCase() === '#FFFF00' ||
    hexColor.toLowerCase() === 'yellow' ||
    hexColor.toUpperCase() === '#008000' ||
    hexColor.toLowerCase() === 'green'
  ) {
    return false
  }

  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.7
}
