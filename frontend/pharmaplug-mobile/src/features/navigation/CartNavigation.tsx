import { createStackNavigator } from '@react-navigation/stack'

const CartStack = createStackNavigator()
const CartNavigator = () => {
  return (
    <CartStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <></>
    </CartStack.Navigator>
  )
}
export default CartNavigator
