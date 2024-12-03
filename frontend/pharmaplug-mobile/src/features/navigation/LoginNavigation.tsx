import { createStackNavigator } from '@react-navigation/stack'
import Login from '../auth/screens/Login'
import ForgotPassword from '../auth/screens/ForgotPassword'
import ForgotPasswordVerify from '../auth/screens/ForgotPasswordVerify'
import ResetPassword from '../auth/screens/ResetPassword'

const LoginStack = createStackNavigator()
const LoginNavigator = () => {
  return (
    <LoginStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <LoginStack.Screen name="SignIn" component={Login} />
      <LoginStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <LoginStack.Screen
        name="ForgotPasswordVerify"
        component={ForgotPasswordVerify}
      />
      <LoginStack.Screen name="ResetPassword" component={ResetPassword} />
    </LoginStack.Navigator>
  )
}

export default LoginNavigator
