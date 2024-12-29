import './style.scss'
import { MiniAccordion } from '../../components/accordion/index.js'
import { MiniItemCard } from '../../components/card/index.js'
import CartItem from '../../components/cartItem/index.js'

import { Link } from 'react-router-dom'
import { NormalButton } from '../../components/button/index.js'

import { useContext, useRef, useState } from 'react'
import { Loader } from '../../components/loader/index.js'
import EmptyData from '../../components/empty/index.js'
import { CartContext } from '../../context/cartContext.js'
import { useNavigate } from 'react-router-dom'
import Path from '../../navigations/constants.js'

const Cart = () => {
  const deleteAllCheckRef = useRef()
  const navigate = useNavigate()
  const cartContext = useContext(CartContext)
  const { cart } = cartContext
  const [checkedDelete, setCheckDelete] = useState([])
  const increaseQuantity = (id) => {
    cartContext.increaseQuantity(id)
  }
  const decreaseQuantity = (id) => {
    cartContext.decreaseQuantity(id)
  }
  const analyseDeleteAll = () => {
    if (deleteAllCheckRef.current.checked) {
      setCheckDelete(cart.cart_items?.map((value) => value.id))
    } else {
      setCheckDelete([])
    }
    console.log(checkedDelete)
  }

  const onCheckClick = (flag, id) => {
    if (flag) {
      setCheckDelete((prevState) => {
        if (prevState.includes(id)) return prevState
        return [...prevState, id]
      })
    } else {
      setCheckDelete((prevState) => {
        if (prevState.includes(id))
          return prevState.filter((value) => value != id)
        return prevState
      })
    }
  }

  const add_to_cart = (item) => {
    cartContext.addToCart(item)
  }
  const deleteCartObject = () => {
    cartContext.removeFromCart(checkedDelete)
  }
  return (
    <div className="cart-page-section">
      <div className="container">
        <div className="nav-header-div">
          <p>
            &lt; <Link>Drug store</Link>
            <Link> / Sickness</Link>
            <span> / Headache</span>
          </p>
        </div>

        <h3 className="header-title">My Cart</h3>
        <div>
          {cart.cart_items.length === 0 ? (
            <EmptyData content="Your Cart is Empty" />
          ) : (
            <div className="main-cart-page-cover">
              <div className="main-items">
                <div className="delete-div">
                  <label>
                    <input
                      type="checkbox"
                      className="custom-check"
                      ref={deleteAllCheckRef}
                      onChange={analyseDeleteAll}
                    />
                    &nbsp; &nbsp; &nbsp; Select all
                  </label>
                  <button className="delete-button" onClick={deleteCartObject}>
                    delete selected
                  </button>
                </div>

                {cart.cart_items?.map((value, idx) => (
                  <div className="cart-item-cover-main">
                    <CartItem
                      key={idx}
                      id={value.id}
                      data={value.product}
                      quantity={value.quantity}
                      onCheckClick={onCheckClick}
                      onQuantityDecrease={() => decreaseQuantity(value.id)}
                      onQuantityIncrease={() => increaseQuantity(value.id)}
                      checkedDeleteList={checkedDelete}
                    />
                    <MiniAccordion header={'see all alternatives'}>
                      <div className="alt-item-cover-main">
                        {value.alternatives?.map((alt_value, idx) => (
                          <div className="alt-item-cover">
                            <MiniItemCard
                              key={idx}
                              name={alt_value.name}
                              price={alt_value.price}
                              image={alt_value.image}
                              onCartAdd={() => add_to_cart(alt_value)}
                            />
                          </div>
                        ))}
                      </div>
                    </MiniAccordion>
                  </div>
                ))}
              </div>
              <div className="price-details">
                <div className="cover">
                  <h3>Order Summary</h3>
                  <div className="flex-between subtotal">
                    <p>Subtotal</p>
                    <p>
                      <strong>₦ {cart.price ?? 0}</strong>
                    </p>
                  </div>
                  <NormalButton full onClick={() => navigate(Path.checkout)}>
                    <strong>Pay Now ({cart.cart_items.length})</strong>
                  </NormalButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
