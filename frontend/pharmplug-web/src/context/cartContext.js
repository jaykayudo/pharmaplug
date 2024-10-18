import { createContext, useEffect, useState } from 'react'
import { useGetAPI, usePostAPI } from '../services/serviceHooks.js'
import { endpoints } from '../services/constants.js'
import assets from '../assets/index.js'

export const CartContext = createContext({
  cartId: undefined,
  addToCart: (id) => {},
  removeFromCart: (ids) => {},
  cart: {
    cart_items: [],
  },
})
const CartContextProvider = ({ children }) => {
  const [cartId, setCartId] = useState(undefined)
  const [cart, setCart] = useState({
    cart_items: [],
  })
  const addToCart = (product_id) => {
    const data = {
      product: product_id,
    }
    if (cartId) {
      data.cart = cartId
    }
    CartAddAPI.sendRequest(data)
  }
  const removeFromCart = (ids) => {
    if (!cartId) return
    if (ids.length === 0) return
    const formObj = new FormData()
    formObj.append('cart', cartId)
    for (const obj of checkedDelete) {
      formObj.append('cart_items', obj)
    }
    CartDeleteAPI.sendRequest(formObj)
  }
  const fetchCartItems = (data) => {
    setCart(data)
  }
  const addAlternatives = (id, data) => {
    const replicaCart = { ...cart }
    const alt = replicaCart.cart_items.find((value) => value.id == id)
    if (alt) {
      alt.alternatives = data
      setCart(replicaCart)
    }
  }
  const reloadCart = (data) => {
    console.log(data)
    if (!cartId) {
      setCartId(data)
      localStorage.setItem('cartId', data)
    }else{
      CartAPI.sendRequest()
    }
    
    
  }
  const CartAPI = useGetAPI(endpoints.cart(cartId), null, fetchCartItems)
  const CartDeleteAPI = usePostAPI(endpoints.removeFromCart, null, reloadCart)
  const CartAddAPI = usePostAPI(endpoints.addToCart, null, reloadCart)
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
        cart,
        loading: CartAPI.loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider

const tempData = [
  {
    id: 1,
    name: 'Aloe vera',
    price: 1000,
    quantity: 2,
    image: assets.drug1,
    alternatives: [],
  },
  {
    id: 2,
    name: 'Aloe vera',
    price: 1000,
    quantity: 1,
    image: assets.drug2,
    alternatives: [],
  },
  {
    id: 3,
    name: 'Aloe vera',
    price: 1000,
    quantity: 2,
    image: assets.drug3,
    alternatives: [
      {
        id: 4,
        name: 'Aloe vera',
        price: 1000,
        quantity: 2,
        image: assets.drug4,
      },
      {
        id: 3,
        name: 'Aloe vera',
        price: 1000,
        quantity: 2,
        image: assets.drug3,
      },
      {
        id: 5,
        name: 'Aloe vera',
        price: 1000,
        quantity: 2,
        image: assets.drug1,
      },
    ],
  },
  {
    id: 4,
    name: 'Aloe vera',
    price: 1000,
    quantity: 2,
    image: assets.drug4,
    alternatives: [],
  },
]
