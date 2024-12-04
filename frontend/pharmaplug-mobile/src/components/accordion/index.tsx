import { ReactNode, useContext, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { AppText } from '../text'
import { ThemeContext } from '../../contexts/ThemeContext'
import { ThemeMode, ThemeType } from '../../../types'
import AntDesign from '@expo/vector-icons/AntDesign'

type AccordionProps = {
  title: string
  children: ReactNode
  initialState?: boolean
}

export const Accordion = ({
  children,
  initialState = true,
  title,
}: AccordionProps) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const [showContent, setShowContent] = useState(initialState)
  const toggleCaret = () => {
    setShowContent((prevState) => !prevState)
  }
  return (
    <View>
      <View style={styles.accordionHeader}>
        <AppText style={{ color: '#1E1E1EB2', fontSize: 18, fontWeight: 500 }}>
          {title}
        </AppText>
        <TouchableOpacity onPress={toggleCaret}>
          {showContent ? (
            <AntDesign name="up" size={18} color="#1E1E1EB2" />
          ) : (
            <AntDesign name="down" size={18} color="#1E1E1EB2" />
          )}
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.accordionContent,
          showContent
            ? { height: 'auto', padding: themeContext.theme.size.spacing.md }
            : { height: 0 },
        ]}
      >
        {children}
      </View>
    </View>
  )
}

type MiniAccordionProps = {
  title: string
  children: ReactNode
  initialState?: boolean
  onCartShow?: () => void
}
export const MiniAccordion = ({
  title,
  children,
  onCartShow,
  initialState = false,
}: MiniAccordionProps) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const [showContent, setShowContent] = useState(initialState)
  const toggleCaret = () => {
    if (!showContent) {
      if (onCartShow) {
        onCartShow()
      }
    }
    setShowContent((prevState) => !prevState)
  }
  return (
    <View>
      <View style={styles.miniAccordionHeader}>
        <AppText style={{ color: '#1E1E1EB2', fontSize: 12, fontWeight: 500 }}>
          {title}
        </AppText>
        <TouchableOpacity onPress={toggleCaret}>
          {showContent ? (
            <AntDesign name="up" size={12} color="#1E1E1EB2" />
          ) : (
            <AntDesign name="down" size={12} color="#1E1E1EB2" />
          )}
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.miniAccordionContent,
          showContent
            ? { height: 'auto', padding: themeContext.theme.size.spacing.sm }
            : {},
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    miniAccordionCover: {},
    miniAccordionHeader: {
      backgroundColor: '#F5F7F8B2',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.size.spacing.sm,
    },
    miniAccordionContent: {
      height: 0,
      overflow: 'hidden',
    },
    accordionHeader: {
      backgroundColor: '#F5F7F8',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.size.spacing.md,
      borderRadius: 10,
    },
    accordionContent: {
      height: 'auto',
      overflow: 'hidden',
    },
  })
