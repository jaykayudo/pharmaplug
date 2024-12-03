import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../home/screens/Dashboard'

const HomeStack = createStackNavigator()
const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="Dashboard" component={Dashboard} />
    </HomeStack.Navigator>
  )
}
export default HomeNavigator
