import { createStackNavigator } from '@react-navigation/stack'
import SignUp from '../auth/screens/SignUp'

const RegisterStack = createStackNavigator()
const RegisterNavigator = () => {
  return (
    <RegisterStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RegisterStack.Screen name="Register" component={SignUp} />
    </RegisterStack.Navigator>
  )
}

export default RegisterNavigator
