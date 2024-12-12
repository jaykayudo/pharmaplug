import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native'
import SafeArea from '../../../components/safearea'
import { ThemeType } from '../../../../types'
import { NormalInput } from '../../../components/input'
import { NormalButtton } from '../../../components/button'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useNavigation, useRoute } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { usePostAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { AppText } from '../../../components/text'

const ResetPassword = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const user = route.params?.item?.user
  const code = route.params?.item?.code
  if (!user || !code) {
    return (
      <View>
        <AppText>Improper Configuration</AppText>
      </View>
    )
  }
  const themeContext = useContext(ThemeContext)
  const styles = getStyles(themeContext.theme)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVerify, setPasswordVerify] = useState({
    length: false,
    caps: false,
    num: false,
  })
  const onPassChange = (text: string) => {
    setPassword(text)
    if (text.length >= 8) {
      setPasswordVerify((prevState) => ({ ...prevState, length: true }))
    } else {
      setPasswordVerify((prevState) => ({ ...prevState, length: false }))
    }
    if (/[A-Z]/.test(text)) {
      setPasswordVerify((prevState) => ({ ...prevState, caps: true }))
    } else {
      setPasswordVerify((prevState) => ({ ...prevState, caps: false }))
    }
    if (/\d/.test(text)) {
      setPasswordVerify((prevState) => ({ ...prevState, num: true }))
    } else {
      setPasswordVerify((prevState) => ({ ...prevState, num: false }))
    }
  }
  const navigateToLogin = () => {}
  const submitForm = () => {
    if (!Object.values(passwordVerify).every((value) => value === true)) {
      Alert.alert('Validation Error', 'Password not matching rules')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match')
      return
    }
    sendRequest({
      password: password,
      user: user,
      code: code,
    })
  }
  const onSuccessCallback = (data) => {
    Alert.alert('Success', 'Password reset successfully')
    navigation.popToTop()
  }
  const { sendRequest } = usePostAPI(
    endpoints.resetPassword,
    null,
    onSuccessCallback,
  )
  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Create Password</Text>
            <Text style={styles.smallText}>Enter your new password</Text>
          </View>
          <View>
            <View style={{ marginBottom: 10 }}>
              <NormalInput
                label="Enter new password"
                secureTextEntry
                placeholder="Enter Password"
                placeholderTextColor={'#D9DDE7'}
                value={password}
                onChangeText={onPassChange}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 5,
                }}
              >
                <AntDesign
                  name="checkcircleo"
                  size={18}
                  color={passwordVerify.caps ? '#2DAA5F' : '#1E1E1E'}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: passwordVerify.caps ? '#2DAA5F' : '#1E1E1E',
                  }}
                >
                  At least one uppercase letter
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 5,
                }}
              >
                <AntDesign
                  name="checkcircleo"
                  size={18}
                  color={passwordVerify.length ? '#2DAA5F' : '#1E1E1E'}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: passwordVerify.length ? '#2DAA5F' : '#1E1E1E',
                  }}
                >
                  Minimum of 8 characters
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 5,
                }}
              >
                <AntDesign
                  name="checkcircleo"
                  size={18}
                  color={passwordVerify.num ? '#2DAA5F' : '#1E1E1E'}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: passwordVerify.num ? '#2DAA5F' : '#1E1E1E',
                  }}
                >
                  At least one number
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: 10 }}>
              <NormalInput
                label="Confirm password"
                secureTextEntry
                placeholder="Enter Password"
                placeholderTextColor={'#D9DDE7'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            <View style={{ marginVertical: 15 }}>
              <NormalButtton onPress={submitForm}>Reset password</NormalButtton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  )
}

export default ResetPassword

const getStyles = (theme: ThemeType, mode: 'light' | 'dark' = 'light') =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.size.spacing.xl,
      paddingVertical: theme.size.spacing.md,
      backgroundColor: '#FFFFFF',
    },
    headerContainer: {
      marginBottom: 15,
    },
    headerText: {
      color: theme.color[mode].text.main,
      fontWeight: 800,
      fontSize: theme.font.size.header1,
      marginBottom: 5,
    },
    normalText: {
      color: theme.color[mode].text.main,
      fontWeight: 400,
      fontSize: theme.font.size.body,
      marginBottom: 5,
    },
    altText: {
      color: '#145B7A',
    },
    smallText: {
      color: theme.color[mode].text.main,
      fontWeight: 400,
      fontSize: theme.font.size.small,
      marginBottom: 5,
    },
    underLinedText: {
      textDecorationLine: 'underline',
    },
  })
