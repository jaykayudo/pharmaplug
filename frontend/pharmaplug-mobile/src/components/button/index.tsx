import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
  TouchableOpacityProps,
} from 'react-native'
import { GetStylesType, ThemeType } from '../../../types'
import React, { useContext, ReactNode } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { AppText } from '../text'

interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode
  onPress: () => void
}

export const NormalButtton: React.FC<ButtonProps> = ({
  children,
  style,
  ...props
}) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  )
}

export const SmallButton: React.FC<ButtonProps> = ({
  children,
  style,
  ...props
}) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  return (
    <TouchableOpacity style={[styles.smallButton, style]} {...props}>
      <AppText style={{ fontSize: 13 }}>{children}</AppText>
    </TouchableOpacity>
  )
}

const getStyles = (theme: ThemeType, mode: 'light' | 'dark' = 'light') =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.color[mode].ui.button,
      padding: theme.size.spacing.sm,
      borderRadius: theme.size.radius.xxlarge,
    },
    buttonText: {
      color: theme.color[mode].text.button,
      fontSize: theme.font.size.body,
      textAlign: 'center',
    },
    smallButton: {
      backgroundColor: '#F0F2F5',
      width: 'auto',
      padding: 10,
      borderRadius: 20,
    },
  })
