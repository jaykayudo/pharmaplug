import { createStackNavigator } from '@react-navigation/stack'

const LoginStack = createStackNavigator()
const LoginNavigator = () => {
  return (
    <LoginStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <></>
    </LoginStack.Navigator>
  )
}

export default LoginNavigator
