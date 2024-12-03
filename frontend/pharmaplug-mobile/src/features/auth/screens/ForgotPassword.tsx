import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native'
import SafeArea from '../../../components/safearea'
import { ThemeType } from '../../../../types'
import { NormalInput } from '../../../components/input'
import { NormalButtton } from '../../../components/button'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useNavigation } from '@react-navigation/native'
import { usePostAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'

const ForgotPassword = () => {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)

  const [email, setEmail] = useState('')
  const styles = getStyles(themeContext.theme)
  const submitForm = () => {
    sendRequest({
      email,
    })
  }
  const onSuccessCallback = (data) => {
    navigation.navigate('ForgotPasswordVerify', { item: data })
  }
  const { sendRequest, loading } = usePostAPI(
    endpoints.forgotPassword,
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
            <Text style={styles.headerText}>Forgot Password</Text>
            <Text style={styles.smallText}>
              Enter your email address and we will send you a link to reset
              password
            </Text>
          </View>
          <View>
            <View style={{ marginBottom: 10 }}>
              <NormalInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                inputMode="email"
                placeholder="Enter Email"
                placeholderTextColor={'#D9DDE7'}
              />
            </View>
            <View style={{ marginVertical: 15 }}>
              <NormalButtton onPress={submitForm}>Submit</NormalButtton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  )
}

export default ForgotPassword

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
    throughText: {
      textAlign: 'center',
      textDecorationLine: 'line-through',
    },
  })
