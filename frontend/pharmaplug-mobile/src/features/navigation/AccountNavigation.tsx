import { createStackNavigator } from '@react-navigation/stack'
import Account from '../account/screens/Account'
import Profile from '../account/screens/Profile'
import History from '../account/screens/HIstory'

const AccountStack = createStackNavigator()
const AccountNavigator = () => {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AccountStack.Screen name="AccountMain" component={Account} />
      <AccountStack.Screen name="Profile" component={Profile} />
      <AccountStack.Screen name="History" component={History} />
    </AccountStack.Navigator>
  )
}
export default AccountNavigator
