import { fontFamily, fontSizes, fontWeight } from './fonts'
import { dark, light } from './colors'
import { spacing, radius, width } from './sizes'
const theme = {
  font: {
    family: fontFamily,
    size: fontSizes,
    weight: fontWeight,
  },
  color: {
    dark,
    light
  },
  size: {
    spacing,
    radius,
    width,
  },
  currentTheme: 'dark',
}

export default theme
