import { useContext } from 'react'
import { Image, View } from 'react-native'
import { CartCard } from '../../../components/card'
import { Container, MainContainer } from '../../../components/container'
import { CartContext } from '../../../contexts/CartContext'
import { NormalButtton } from '../../../components/button'
import assets from '../../../../assets'
import { AppText } from '../../../components/text'
import { useNavigation } from '@react-navigation/native'

const Cart = () => {
  const cartContext = useContext(CartContext)
  const navigation = useNavigation()
  const { cart } = cartContext
  const addToCart = (id: string) => {
    cartContext.addToCart(id)
  }
  const deleteCartObject = (id: string) => {
    cartContext.removeFromCart([id])
  }
  const increaseQuantity = (id: string) => {
    cartContext.increaseQuantity(id)
  }
  const decreaseQuantity = (id: string) => {
    cartContext.decreaseQuantity(id)
  }
  const refreshCart = () => {
    cartContext.refreshCart()
  }
  const navigateToCheckout = () => {
    navigation.navigate('Checkout')
  }
  return (
    <MainContainer title="Cart" onRefresh={refreshCart}>
      <Container>
        {cart.cart_items?.map((value, idx) => (
          <View key={idx} style={{ marginBottom: 10 }}>
            <CartCard
              name={value.product.name}
              quantity={value.quantity}
              image={value.product.image}
              price={value.product.price}
              onDelete={() => deleteCartObject(value.id)}
              onQuantityIncrease={() => increaseQuantity(value.id)}
              onQuantityDecrease={() => decreaseQuantity(value.id)}
            />
          </View>
        ))}
        {cart.cart_items.length > 0 && (
          <View style={{ marginVertical: 15 }}>
            <NormalButtton onPress={navigateToCheckout}>
              Proceed to Checkout
            </NormalButtton>
          </View>
        )}
        {cart.cart_items.length == 0 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 20,
            }}
          >
            <Image source={assets.noProduct} resizeMode="cover" />
            <AppText style={{ marginTop: 10 }}>No Product in Cart</AppText>
          </View>
        )}
      </Container>
    </MainContainer>
  )
}

export default Cart
