import React, { createContext, useEffect, useState, ReactNode } from 'react'
import { useGetAPI, usePostAPI } from '../services/serviceHooks'
import { endpoints } from '../services/constants'
import { CartType, ProductType } from '../../types'


export const CartContext = createContext({
  cartId: undefined,
  addToCart: (id:string) => {},
  removeFromCart: (ids:string[]) => {},
  increaseQuantity: (id:string) => {},
  decreaseQuantity: (id:string) => {},
  cart: {
    cart_items: [],
  },
})

type CartContextProps = {
    children: ReactNode
}
type AddToCartDataType = {
    product: string,
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
    console.log(data)
    if (!cartId) {
      setCartId(data)
      localStorage.setItem('cartId', data)
    }else{
      CartAPI.sendRequest()
    }
  }
  const decreaseQuantity = (id: string) =>{
    if(!cartId) return
    CartDecreaseAPI.sendRequest({
      cart: cartId,
      item: id
    })
  }
  const increaseQuantity = (id: string) =>{
    if(!cartId) return
    CartIncreaseAPI.sendRequest({
      cart: cartId,
      item: id
    })
  }
  const CartAPI = useGetAPI(endpoints.cart(cartId), null, fetchCartItems)
  const CartDeleteAPI = usePostAPI(endpoints.removeFromCart, null, reloadCart)
  const CartAddAPI = usePostAPI(endpoints.addToCart, null, reloadCart)
  const CartIncreaseAPI = usePostAPI(endpoints.cartQuantityIncrease, null, reloadCart)
  const CartDecreaseAPI = usePostAPI(endpoints.cartQuantityDecrease, null, reloadCart)
  useEffect(() => {
    // search local storage for the cart id
    const tempStore = localStorage.getItem('cartId')
    if (tempStore && typeof tempStore == 'string') {
      setCartId(tempStore)
    }
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
        cart,
        loading: CartAPI.loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider

