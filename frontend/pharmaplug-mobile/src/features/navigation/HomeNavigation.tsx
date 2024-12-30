import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../home/screens/Dashboard'
import Notifications from '../home/screens/Notifications'

const HomeStack = createStackNavigator()
const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="Dashboard" component={Dashboard} />
      <HomeStack.Screen name="Notifications" component={Notifications} />
    </HomeStack.Navigator>
  )
}
export default HomeNavigator
