import { createStackNavigator } from '@react-navigation/stack'
import Cart from '../cart/screens/Cart'
import Checkout from '../cart/screens/Checkout'

const CartStack = createStackNavigator()
const CartNavigator = () => {
  return (
    <CartStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CartStack.Screen name="CartMain" component={Cart} />
      <CartStack.Screen name="Checkout" component={Checkout} />
    </CartStack.Navigator>
  )
}
export default CartNavigator
