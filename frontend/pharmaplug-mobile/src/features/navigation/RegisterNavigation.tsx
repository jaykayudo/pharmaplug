import { createStackNavigator } from '@react-navigation/stack'

const RegisterStack = createStackNavigator()
const RegisterNavigator = () => {
  return (
    <RegisterStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <></>
    </RegisterStack.Navigator>
  )
}

export default RegisterNavigator
