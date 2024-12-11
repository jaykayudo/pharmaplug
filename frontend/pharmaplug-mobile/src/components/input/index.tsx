import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
  Pressable,
} from 'react-native'

import { ThemeMode, ThemeType } from '../../../types'
import React, { useContext, ReactNode, useState, useRef } from 'react'
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

const CODE_LENGTH = 4
type CodeInputProps = {
  code: string
  setCode: (val: string) => void
  extraStyle?: object
  code_length?: number
}

export const CodeInput = ({
  code,
  setCode,
  extraStyle = {},
  code_length = CODE_LENGTH,
}: CodeInputProps) => {
  const [containerIsFocused, setContainerIsFocused] = useState(false)
  const themecontext = useContext(ThemeContext)
  const ref = useRef<TextInput>(null)

  const style = getCodeStyle(
    themecontext.theme,
    themecontext.currentMode,
    code_length,
  )
  const codeDigitsArray = new Array(code_length).fill(0)

  const handleOnPress = () => {
    setContainerIsFocused(true)
    ref?.current?.focus()
  }

  const handleOnBlur = () => {
    setContainerIsFocused(false)
  }

  const toDigitInput = (_value: number, idx: number) => {
    const emptyInputChar = ' '
    const digit = code[idx] || emptyInputChar

    const isCurrentDigit = idx === code.length
    const isLastDigit = idx === code_length - 1
    const isCodeFull = code.length === code_length

    const isFocused = isCurrentDigit || (isLastDigit && isCodeFull)

    const containerStyle =
      containerIsFocused && isFocused
        ? { ...style.inputContainer, ...style.inputContainerFocused }
        : style.inputContainer

    return (
      <View key={idx} style={[containerStyle, extraStyle]}>
        <Text style={style.inputText}>{digit}</Text>
      </View>
    )
  }

  return (
    <>
      <Pressable style={style.inputsContainer} onPress={handleOnPress}>
        {codeDigitsArray.map(toDigitInput)}
      </Pressable>
      <TextInput
        ref={ref}
        value={code}
        onChangeText={setCode}
        onSubmitEditing={handleOnBlur}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        maxLength={CODE_LENGTH}
        style={style.hiddenCodeInput}
      />
    </>
  )
}

const getCodeStyle = (
  theme: ThemeType,
  mode: ThemeMode,
  codeLength: number = 4,
) =>
  StyleSheet.create({
    inputsContainer: {
      width: theme.size.width.w100,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputContainer: {
      backgroundColor: theme.color[mode].bg.main,
      borderColor: theme.color[mode].ui.border,
      borderWidth: 2,
      borderRadius: theme.size.radius.small,
      width: `${100 / codeLength - 3}%`,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainerFocused: {
      borderColor: theme.color[mode].ui.border,
      marginRight: 10,
    },
    inputText: {
      fontSize: theme.font.size.button2,
      fontFamily: theme.font.family.normal,
      color: theme.color[mode].text.main,
    },
    hiddenCodeInput: {
      position: 'absolute',
      height: 0,
      width: 0,
      opacity: 0,
    },
  })

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
