import { ReactNode, useContext } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'
import { ThemeType } from '../../../types'
import { ThemeContext } from '../../contexts/ThemeContext'

type Props = {
  children: ReactNode
} & TextProps
export const AppText = ({ children, style, ...props }: Props) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  return (
    <Text style={[styles.appText, style]} {...props}>
      {children}
    </Text>
  )
}

export const AltAppText = ({ children, style, ...props }: Props) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  return (
    <Text style={[styles.altAppText, style]} {...props}>
      {children}
    </Text>
  )
}

const getStyles = (theme: ThemeType, mode: 'light' | 'dark' = 'light') =>
  StyleSheet.create({
    appText: {
      fontFamily: theme.font.family.normal,
      fontSize: theme.font.size.body,
      fontWeight: 500,
      color: theme.color[mode].text.main,
    },
    altAppText: {
      fontFamily: theme.font.family.normal,
      fontSize: theme.font.size.body,
      fontWeight: 500,
      color: theme.color[mode].text.white,
    },
  })
