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
import { ThemeType, UserType } from '../../../../types'
import { NormalInput } from '../../../components/input'
import { NormalButtton } from '../../../components/button'
import { useContext } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { AuthContext } from '../../../contexts/AuthContext'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { validateEmail } from '../../../infrastructure/utils/validation'
import { usePostAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
// Uncomment when using development build or production build
// import { GoogleSigninButton, GoogleSignin, SignInSuccessResponse, isSuccessResponse } from '@react-native-google-signin/google-signin'
const Login = () => {
  const themeContext = useContext(ThemeContext)
  const authContext = useContext(AuthContext)
  const styles = getStyles(themeContext.theme)
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigateToSignUp = () => {
    navigation.navigate('SignUp')
  }
  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword')
  }
  const submitForm = () => {
    if (!email || !password) return
    const emailValidation = validateEmail(email)
    if (!emailValidation.status) {
      Alert.alert('Validation Error', emailValidation.errorText)
      return
    }
    const data = {
      email,
      password,
    }
    sendRequest(data)
  }
  // Uncomment when using development build or production build
  // const googleSignIn = async ()=>{
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const response = await GoogleSignin.signIn();
  //     if(isSuccessResponse(response)){
  //       submitGoogleSignUptoBackend(response)
  //     }
  //     else{
  //       Alert.alert('Error',"Authentication Error")
  //     }
  //   } catch (error) {
  //     Alert.alert('Error',"Authentication Error")
  //   }
  // }
  // const googleSignOut = async () => {
  //   try {
  //     await GoogleSignin.signOut();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const onSuccessCallback = (data: UserType) => {
    authContext.logUserIn(data)
  }
  // Uncomment when using development build or production build
  // const submitGoogleSignUptoBackend = (response: SignInSuccessResponse) => {
  //   const authToken = response.data.idToken
  //   googleSigninApi.sendRequest({
  //     auth_token: authToken,
  //   })
  // }
  const onGoogleSignIn = (data: UserType) => {
    authContext.logUserIn(data)
    Alert.alert("Success","Login Successful")
    
  }
  const onErrorCallback = (err: any) => {
    // Uncomment when using development build or production build
    // googleSignOut()
  }
  const googleSigninApi = usePostAPI(
    endpoints.googleSignIn,
    null,
    onGoogleSignIn,
    onErrorCallback,
  )
  const { sendRequest, loading } = usePostAPI(
    endpoints.login,
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
            <Text style={styles.headerText}>Welcome to PharmaPlug</Text>
            <View style={{ flexDirection: 'row', alignContent: 'center' }}>
              <Text style={styles.normalText}>Don't have an account?</Text>
              <TouchableOpacity onPress={navigateToSignUp}>
                <Text
                  style={[
                    styles.normalText,
                    styles.underLinedText,
                    styles.altText,
                  ]}
                >
                  {' '}
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
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
            <View style={{ marginBottom: 10 }}>
              <NormalInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter Password"
                placeholderTextColor={'#D9DDE7'}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={navigateToForgotPassword}>
                <Text style={styles.altText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 15 }}>
              <NormalButtton onPress={submitForm}>Login</NormalButtton>
            </View>
          </View>
          <Text style={styles.throughText}>or</Text>
          <View>
          {/* <GoogleSigninButton
            onPress={googleSignIn}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
          /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  )
}

export default Login

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
