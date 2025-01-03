import React, { createContext, useEffect, useState, ReactNode } from 'react'
import { useGetAPI, usePostAPI } from '../services/serviceHooks'
import { endpoints } from '../services/constants'
import { CartType, ProductType } from '../../types'
import storage from '../infrastructure/utils/storageAsync'

export const CartContext = createContext({
  cartId: undefined,
  addToCart: (id: string) => {},
  removeFromCart: (ids: string[]) => {},
  increaseQuantity: (id: string) => {},
  decreaseQuantity: (id: string) => {},
  refreshCart: () => {},
  clearCart: () => {},
  cart: {
    cart_items: [],
  },
})

type CartContextProps = {
  children: ReactNode
}
type AddToCartDataType = {
  product: string
  cart?: string
}

const CartContextProvider: React.FC<CartContextProps> = ({ children }) => {
  const [cartId, setCartId] = useState<string | undefined>(undefined)
  const [cart, setCart] = useState<CartType>({
    cart_items: [],
  })
  const addToCart = (product_id: string) => {
    const data: AddToCartDataType = {
      product: product_id,
    }
    if (cartId) {
      data.cart = cartId
    }
    CartAddAPI.sendRequest(data)
  }
  const removeFromCart = (ids: string[]) => {
    if (!cartId) return
    if (ids.length === 0) return
    const formObj = new FormData()
    formObj.append('cart', cartId)
    for (const obj of ids) {
      formObj.append('cart_items', obj)
    }
    CartDeleteAPI.sendRequest(formObj)
  }
  const fetchCartItems = (data: CartType) => {
    setCart(data)
  }
  const addAlternatives = (id: string, data: ProductType[]) => {
    const replicaCart: CartType = { ...cart }
    const alt = replicaCart.cart_items.find((value) => value.id == id)
    if (alt) {
      alt.alternatives = data
      setCart(replicaCart)
    }
  }
  const reloadCart = (data: string) => {
    if (!cartId) {
      setCartId(data)
      storage.save({
        key: 'cartId',
        data: data,
      })
    } else {
      CartAPI.sendRequest()
    }
  }
  const decreaseQuantity = (id: string) => {
    if (!cartId) return
    CartDecreaseAPI.sendRequest({
      cart: cartId,
      item: id,
    })
  }
  const increaseQuantity = (id: string) => {
    if (!cartId) return
    CartIncreaseAPI.sendRequest({
      cart: cartId,
      item: id,
    })
  }
  const refreshCart = () => {
    if (cartId) {
      CartAPI.sendRequest()
    }
  }
  const clearCart = () => {
    if (!cartId) return
    if (cart.cart_items.length == 0) return
    const formObj = new FormData()
    formObj.append('cart', cartId)
    for (const obj of cart.cart_items) {
      formObj.append('cart_items', obj.id)
    }
    CartDeleteAPI.sendRequest(formObj)
  }
  const CartAPI = useGetAPI(endpoints.cart(cartId), null, fetchCartItems)
  const CartDeleteAPI = usePostAPI(endpoints.removeFromCart, null, reloadCart)
  const CartAddAPI = usePostAPI(endpoints.addToCart, null, reloadCart)
  const CartIncreaseAPI = usePostAPI(
    endpoints.cartQuantityIncrease,
    null,
    reloadCart,
  )
  const CartDecreaseAPI = usePostAPI(
    endpoints.cartQuantityDecrease,
    null,
    reloadCart,
  )
  useEffect(() => {
    // search local storage for the cart id
    storage
      .load({
        key: 'cartId',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true,
        },
      })
      .then((data) => {
        setCartId(data)
      })
      .catch((err) => {})
  }, [])

  useEffect(() => {
    if (cartId) {
      CartAPI.sendRequest()
    }
  }, [cartId])
  return (
    <CartContext.Provider
      value={{
        cartId,
        addToCart,
        removeFromCart,
        addAlternatives,
        increaseQuantity,
        decreaseQuantity,
        refreshCart,
        clearCart,
        cart,
        loading: CartAPI.loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
