import { createStackNavigator } from '@react-navigation/stack'

const StoreStack = createStackNavigator()
const StoreNavigator = () => {
  return (
    <StoreStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <></>
    </StoreStack.Navigator>
  )
}
export default StoreNavigator
