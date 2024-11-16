import { createStackNavigator } from '@react-navigation/stack'

const AccountStack = createStackNavigator()
const AccountNavigator = () => {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <></>
    </AccountStack.Navigator>
  )
}
export default AccountNavigator
