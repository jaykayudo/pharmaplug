import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
} from 'react-native'
import { ThemeType } from '../../../types'
import React, { useContext, ReactNode } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'
import Feather from '@expo/vector-icons/Feather'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  alt?: boolean
}

export const NormalInput: React.FC<InputProps> = ({
  label,
  error,
  ...props
}) => {
  const themeContext = useContext(ThemeContext)
  const theme = themeContext.theme
  const styles = getStyles(theme)
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.normalInput]} {...props} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

export const SearchInput: React.FC<InputProps> = ({
  label,
  alt,
  error,
  ...props
}) => {
  const themeContext = useContext(ThemeContext)
  const theme = themeContext.theme
  const styles = getStyles(theme)
  return (
    <View>
      <View
        style={[
          styles.searchContainer,
          alt
            ? { backgroundColor: theme.color[themeContext.currentMode].bg.tet }
            : {},
        ]}
      >
        <View style={styles.searchIconContainer}>
          <Feather name="search" size={24} color="black" />
        </View>
        <TextInput
          style={[styles.searchInput]}
          placeholder={label}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const getStyles = (theme: ThemeType, mode: 'light' | 'dark' = 'light') =>
  StyleSheet.create({
    normalInput: {
      borderRadius: theme.size.radius.large,
      backgroundColor: theme.color[mode].ui.input,
      borderColor: theme.color[mode].ui.border,
      borderWidth: 1,
      borderStyle: 'solid',
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    label: {
      marginBottom: 10,
      fontWeight: 500,
      color: theme.color[mode].text.black,
    },
    errorText: {
      color: 'red',
    },
    searchContainer: {
      backgroundColor: theme.color[mode].ui.light,
      borderRadius: 40,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      paddingHorizontal: theme.size.spacing.sm,
    },
    searchIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchInput: {
      marginLeft: 5,
      flexGrow: 1,
      paddingVertical: theme.size.spacing.md,
    },
  })
