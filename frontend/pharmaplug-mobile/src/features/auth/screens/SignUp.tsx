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
import {
  validateEmail,
  validateName,
  validatePhoneNumber,
  validatePassword,
} from '../../../infrastructure/utils/validation'
import { usePostAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
// uncomment when using development or production build
// import { GoogleSignin, GoogleSigninButton, isSuccessResponse, SignInSuccessResponse } from '@react-native-google-signin/google-signin'
import { Modal, Portal, Provider } from 'react-native-paper'
import { LoaderContext } from '../../../contexts/LoaderContext'

const SignUp = () => {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const authContext = useContext(AuthContext)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')

  const [authToken, setAuthToken] = useState<string | null>('')
  const [showAltModal, setShowAltModal] = useState(false)
  const styles = getStyles(themeContext.theme)
  const navigateToLogin = () => {
    navigation.navigate('Login')
  }
  const hideModal = () => {
    setShowAltModal(false)
  }
  const submitForm = () => {
    const loaderContext = useContext(LoaderContext)
    const fullNameValidation = validateName(fullName, 'Full name')
    const emailValidation = validateEmail(email)
    const phoneNumberValidation = validatePhoneNumber(phoneNumber)
    const passwordValidation = validatePassword(password)
    for (const validator of [
      fullNameValidation,
      emailValidation,
      phoneNumberValidation,
      passwordValidation,
    ]) {
      if (!validator.status) {
        Alert.alert('Validation Error', validator.errorText)
        return
      }
    }
    const [firstName, lastName] = fullName.split(' ', 2)
    const data = {
      first_name: firstName,
      last_name: lastName ?? '',
      email: email,
      phone_number: phoneNumber,
      password: password,
    }
    sendRequest(data)
  }
  const onSuccessCallback = (data: UserType) => {
    authContext.logUserIn(data)
  }
  // Uncomment when using development build or production build
  // const googleSignIn = async ()=>{
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const response = await GoogleSignin.signIn();
  //     if(isSuccessResponse(response)){
  //       triggerAltModal(response)
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
  // const triggerAltModal = (response: SignInSuccessResponse) =>{
  //   setAuthToken(response.data.idToken)
  //   setShowAltModal(true)
  // }
  const submitGoogleSignUptoBackend = () => {
    if (!authToken || !phoneNumber) {
      Alert.alert('Validation Error', 'Fill all additional info')
      return
    }
    googleSigninApi.sendRequest({
      auth_token: authToken,
      phone_number: phoneNumber,
    })
    hideModal()
  }
  const onGoogleSignIn = (data: UserType) => {
    authContext.logUserIn(data)
    Alert.alert('Success', 'User account created')
  }
  const onErrorCallback = (err: any) => {
    // uncomment when using development build or production build
    // googleSignOut()
  }
  const googleSigninApi = usePostAPI(
    endpoints.googleSignUp,
    null,
    onGoogleSignIn,
    onErrorCallback,
  )
  const { sendRequest, loading } = usePostAPI(
    endpoints.register,
    null,
    onSuccessCallback,
  )
  return (
    <Provider>
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
              <Text style={styles.headerText}>Create an Account</Text>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Text style={styles.normalText}>Already have an account?</Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text
                    style={[
                      styles.normalText,
                      styles.underLinedText,
                      styles.altText,
                    ]}
                  >
                    {' '}
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View style={{ marginBottom: 10 }}>
                <NormalInput
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter Full Name"
                  placeholderTextColor={'#D9DDE7'}
                />
              </View>
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
                  label="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  inputMode="tel"
                  placeholder="Enter Phone number"
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
              <Text style={styles.normalText}>
                Passwords must contain at least 8 characters.
              </Text>
              <View style={{ marginVertical: 15 }}>
                <NormalButtton onPress={submitForm}>Sign Up</NormalButtton>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Text style={styles.smallText}>
                  By signing up you are agreeing to our
                </Text>
                <TouchableOpacity>
                  <Text
                    style={[
                      styles.smallText,
                      styles.underLinedText,
                      styles.altText,
                    ]}
                  >
                    {' '}
                    Terms of Service.{' '}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.smallText}>View our</Text>
                <TouchableOpacity>
                  <Text
                    style={[
                      styles.smallText,
                      styles.underLinedText,
                      styles.altText,
                    ]}
                  >
                    {' '}
                    Privacy Policy.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text>or</Text>
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
      <Portal>
        <Modal
          visible={showAltModal}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ marginBottom: 20 }}>Add additional information!</Text>
          <View style={{ marginBottom: 10 }}>
            <NormalInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              inputMode="tel"
              placeholder="Enter Phone number"
              placeholderTextColor={'#D9DDE7'}
            />
          </View>
          <View style={{ marginVertical: 15 }}>
            <NormalButtton onPress={submitGoogleSignUptoBackend}>
              Sign Up with Google
            </NormalButtton>
          </View>
        </Modal>
      </Portal>
    </Provider>
  )
}

export default SignUp

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
