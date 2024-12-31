import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  RefreshControl,
} from 'react-native'
import { ReactNode, useContext } from 'react'
import { ThemeType } from '../../../types'
import { ThemeContext } from '../../contexts/ThemeContext'
import { AppText } from '../text'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { SearchInput } from '../input'
import SafeArea from '../safearea'
import { useNavigation } from '@react-navigation/native'

const { height } = Dimensions.get('window')

type Props = {
  user: {
    name: string
    image?: string
  }
  refreshing?: boolean
  onRefresh?: () => void
  searchValue?: string
  onSearchChangeText?: (val: any) => void
  onNotificationPress?: () => void
  children: ReactNode
}
export const DashboardContainer = ({
  user,
  children,
  refreshing = false,
  searchValue,
  onSearchChangeText,
  onRefresh,
  onNotificationPress,
}: Props) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  return (
    <KeyboardAvoidingView
      style={styles.cover}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.dashboardHeader}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <Image></Image>
            <View style={{ marginLeft: 20 }}>
              <AppText style={{ fontWeight: 700, fontSize: 18 }}>
                HI {user.name}
              </AppText>
              <AppText>Good day</AppText>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.notificationIconBox}
              onPress={onNotificationPress}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="black"
                style={styles.notificationIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <SearchInput label="Search" value={searchValue} onChangeText={onSearchChangeText} />
        </View>
      </View>
      <ScrollView
        style={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

type MainContainerProps = {
  title: string
  children: ReactNode
  refreshing?: boolean
  onRefresh?: () => void
  back?: boolean
}

export const MainContainer = ({
  children,
  title,
  back,
  refreshing = false,
  onRefresh,
}: MainContainerProps) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const navigation = useNavigation()
  const onBack = () => {
    navigation.goBack()
  }
  return (
    <SafeArea
      style={{
        backgroundColor:
          themeContext.theme.color[themeContext.currentMode].bg.main,
      }}
    >
      <StatusBar barStyle={'dark-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={styles.mainCover}
      >
        <View style={styles.mainHeader}>
          {back && (
            <TouchableOpacity onPress={onBack} style={styles.backContainer}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          )}
          <AppText style={styles.headerText}>{title}</AppText>
        </View>
        <ScrollView
          style={styles.mainContentContainer}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  )
}

export const MainContainerScrolless = ({
  children,
  title,
  back,
  refreshing = false,
  onRefresh,
}: MainContainerProps) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const navigation = useNavigation()
  const onBack = () => {
    navigation.goBack()
  }
  return (
    <SafeArea
      style={{
        backgroundColor:
          themeContext.theme.color[themeContext.currentMode].bg.main,
      }}
    >
      <StatusBar barStyle={'dark-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={styles.mainCover}
      >
        <View style={styles.mainHeader}>
          {back && (
            <TouchableOpacity onPress={onBack} style={styles.backContainer}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          )}
          <AppText style={styles.headerText}>{title}</AppText>
        </View>
        <View style={styles.mainContentContainer}>{children}</View>
      </KeyboardAvoidingView>
    </SafeArea>
  )
}

type ContainerProps = {
  children: ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  return <View style={styles.container}>{children}</View>
}

const getStyles = (theme: ThemeType, mode: 'light' | 'dark' = 'light') =>
  StyleSheet.create({
    cover: {
      backgroundColor: theme.color[mode].bg.main,
      minHeight: height / 1.1,
      marginBottom: 20,
    },
    dashboardHeader: {
      paddingTop: 80,
      paddingHorizontal: theme.size.spacing.md,
      paddingBottom: theme.size.spacing.md,
      backgroundColor: theme.color[mode].bg.tet,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
    },
    notificationIconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.color[mode].ui.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationIcon: {
      textAlign: 'center',
      color: theme.color[mode].text.main,
    },
    contentContainer: {
      padding: theme.size.spacing.md,
      minHeight: height / 1.6,
    },
    mainCover: {
      backgroundColor: theme.color[mode].bg.main,
      minHeight: height / 1.1,
    },
    mainHeader: {
      padding: theme.size.spacing.md,
      flexDirection: 'row',
      shadowColor: '#000000',
      shadowOffset: {
        width: -2,
        height: 4,
      },
      shadowRadius: 5,
      //   elevation: 10,
    },
    mainContentContainer: {
      minHeight: height / 1.6,
      backgroundColor: theme.color[mode].bg.main,
      marginBottom: 80,
    },
    backContainer: {},
    headerText: {
      flexGrow: 1,
      textAlign: 'center',
      fontWeight: 700,
      fontSize: 18,
    },
    container: {
      padding: theme.size.spacing.md,
    },
  })
