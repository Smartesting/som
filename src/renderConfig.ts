import { Color } from './types'

export function buildRenderConfig(bestPosition: { top: number; left: number }) {
  const color = getRandomColor()
  return {
    labelAbsolutePosition: bestPosition,
    backgroundColor: color,
    textColor: getFontColorByLuminance(color)
  }
}

function getRandomColor(): Color {
  return { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) }
}

function getLuminance(color: Color): number {
  const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
    const normalizedChannel = channel / 255
    if (normalizedChannel <= 0.03928) {
      return normalizedChannel / 12.92
    }
    return Math.pow((normalizedChannel + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getFontColorByLuminance(color: Color): 'black' | 'white' {
  return getLuminance(color) > 0.5 ? 'black' : 'white'
}
