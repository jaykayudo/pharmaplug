import { createStackNavigator } from '@react-navigation/stack'


const HomeStack = createStackNavigator()
const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <></>
    </HomeStack.Navigator>
  )
}
export default HomeNavigator
