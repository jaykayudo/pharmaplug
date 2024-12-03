import React, { ReactNode } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar as ReactStatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native'

const isAndroid = Platform.OS !== 'ios'
interface SafeAreaType {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

const SafeArea: React.FC<SafeAreaType> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.safearea, style]}>{children}</SafeAreaView>
  )
}

export default SafeArea

const styles = StyleSheet.create({
  safearea: {
    marginTop: isAndroid ? ReactStatusBar.currentHeight : 0,
    flex: 1,
  },
})
