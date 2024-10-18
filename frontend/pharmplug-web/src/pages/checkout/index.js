import './style.scss'
import { NormalButton } from '../../components/button/index.js'
import { LargeAccordion } from '../../components/accordion/index.js'
import { NormalInput, NormalSelect } from '../../components/input/index.js'
import { MiniCartItem } from '../../components/cartItem/index.js'
import assets from '../../assets/index.js'

import { useContext, useEffect, useState } from 'react'
import { usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { CartContext } from '../../context/cartContext.js'
import { message } from 'antd'
import {
  validateEmail,
  validateName,
  validatePhoneNumber,
} from '../../utils/validation.js'
import { lgaList } from '../../utils/lga.js'

const Checkout = () => {
  const cartContext = useContext(CartContext)
  const { cart } = cartContext
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [state, setState] = useState('')
  const [region, setRegion] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('')

  const [lgas, setLgas] = useState([])
  let subtotal = 0
  cart.cart_items.forEach((value) => {
    subtotal += value.price
  })
  const onSuccessCallback = (data) => {}
  const toggleLGA = (e) => {
    const value = e.target.value
    setState(value)
    if (!value) return
    setLgas(lgaList[value])
    setRegion('')
  }
  const Pay = () => {
    if (cart.cart_items.length === 0) return
    const firstNameValidation = validateName(fullName, 'full name')
    const phoneNumberValidation = validatePhoneNumber(phoneNumber)
    const emailValidation = validateEmail(email, 'email address')
    const addressValidation = validateName(address, 'Address')
    for (const validator of [
      firstNameValidation,
      emailValidation,
      phoneNumberValidation,
      addressValidation,
    ]) {
      if (!validator.status) {
        message.error({
          content: validator.errorText,
          duration: 2,
        })
        return
      }
    }
    if (!state || !paymentMethod || !region || !deliveryMethod) {
      message.error({
        content: 'All fields is required',
        duration: 2,
      })
      return
    }
    const data = {
      email,
      phoneNumber,
      state,
      region,
      address,
      paymentMethod,
      deliveryMethod,
      cart: cartContext.cartId,
    }
    sendRequest(data)
  }
  const { sendRequest, loading } = usePostAPI(
    endpoints.checkout,
    null,
    onSuccessCallback,
  )
  useEffect(() => {}, [])
  return (
    <div className="checkout-page-cover">
      <div className="breadcrump-header-top">
        <p>
          <span></span>
          <h3></h3>
        </p>{' '}
        <hr />
        <p>
          <span></span>
          <h3></h3>
        </p>{' '}
        <hr />
        <p>
          <span></span>
          <h3></h3>
        </p>
      </div>
      <div className="container">
        <div className="flex-between">
          <h3 className="checkout-header">Checkout</h3>
        </div>
        <div className="checkout-cover">
          <div className="checkout-box">
            <div className="info-box">
              <LargeAccordion
                header1={'Personal details'}
                header2={'Provide your personal details for delivery'}
              >
                <div className="personal-info-box">
                  <div className="info-input">
                    <NormalInput
                      label={'Full name'}
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="info-input">
                    <NormalInput
                      label={'Email Address'}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      value={email}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="info-input">
                    <NormalInput
                      label={'Phone Number'}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      type="tel"
                      value={phoneNumber}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </LargeAccordion>
              <div style={{ paddingLeft: '1.2em', paddingRight: '1.2em' }}>
                <hr />
              </div>
              <LargeAccordion
                header1={'Delivery location'}
                header2={'Provide your address for delivery'}
              >
                <div className="personal-info-box">
                  <div className="info-input">
                    <NormalSelect
                      label={'State'}
                      onChange={toggleLGA}
                      value={state}
                    >
                      <option value="Abia">Abia</option>
                      <option value="Adamawa">Adamawa</option>
                      <option value="AkwaIbom">AkwaIbom</option>
                      <option value="Anambra">Anambra</option>
                      <option value="Bauchi">Bauchi</option>
                      <option value="Bayelsa">Bayelsa</option>
                      <option value="Benue">Benue</option>
                      <option value="Borno">Borno</option>
                      <option value="Cross River">Cross River</option>
                      <option value="Delta">Delta</option>
                      <option value="Ebonyi">Ebonyi</option>
                      <option value="Edo">Edo</option>
                      <option value="Ekiti">Ekiti</option>
                      <option value="Enugu">Enugu</option>
                      <option value="FCT">FCT</option>
                      <option value="Gombe">Gombe</option>
                      <option value="Imo">Imo</option>
                      <option value="Jigawa">Jigawa</option>
                      <option value="Kaduna">Kaduna</option>
                      <option value="Kano">Kano</option>
                      <option value="Katsina">Katsina</option>
                      <option value="Kebbi">Kebbi</option>
                      <option value="Kogi">Kogi</option>
                      <option value="Kwara">Kwara</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Nasarawa">Nasarawa</option>
                      <option value="Niger">Niger</option>
                      <option value="Ogun">Ogun</option>
                      <option value="Ondo">Ondo</option>
                      <option value="Osun">Osun</option>
                      <option value="Oyo">Oyo</option>
                      <option value="Plateau">Plateau</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Sokoto">Sokoto</option>
                      <option value="Taraba">Taraba</option>
                      <option value="Yobe">Yobe</option>
                      <option value="Zamfara">Zamafara</option>
                    </NormalSelect>
                  </div>
                  <div className="info-input">
                    <NormalSelect
                      label={'Region'}
                      onChange={(e) => setRegion(e.target.value)}
                      value={region}
                    >
                      {lgas.map((value, idx) => (
                        <option key={idx} value={value}>
                          {value}
                        </option>
                      ))}
                    </NormalSelect>
                  </div>
                  <div style={{ width: '100%' }}>
                    <NormalInput
                      label={'Address'}
                      onChange={(e) => setAddress(e.target.value)}
                      value={address}
                      placeholder="Enter your Address"
                    />
                  </div>
                </div>
              </LargeAccordion>
              <div className="checkout-btn-cover">
                <NormalButton>Save details</NormalButton>
              </div>
            </div>
            <div className="info-box">
              <LargeAccordion
                header1={'Delivery option'}
                header2={'Choose how you want to receive your products'}
              >
                <div>
                  <div className="select-section">
                    <div>
                      <input
                        type="radio"
                        name="delivery-method"
                        value={'home'}
                      />
                    </div>
                    <div>
                      <h3>Home delivery ($2.7 delivery fee)</h3>
                      <p>
                        You will be redirected at checkout to complete payment
                      </p>
                    </div>
                  </div>
                  <div className="select-section">
                    <div>
                      <input
                        type="radio"
                        name="delivery-method"
                        value={'pharmacy'}
                      />
                    </div>
                    <div>
                      <h3>Pick up from pharmacy (no delivery fee)</h3>
                      <p>You will pay at the point of delivery</p>
                    </div>
                  </div>
                </div>
              </LargeAccordion>
            </div>
            <div className="info-box">
              <LargeAccordion
                header1={'Payment Method'}
                header2={'Choose how you want to pay'}
              >
                <div>
                  <div className="select-section">
                    <div>
                      <input
                        type="radio"
                        name="payment-method"
                        value={'card'}
                      />
                    </div>
                    <div>
                      <h3>Pay with Card</h3>
                      <p>
                        You will be redirected at checkout to complete payment
                      </p>
                    </div>
                  </div>
                  <div className="select-section">
                    <div>
                      <input
                        type="radio"
                        name="payment-method"
                        value={'bank'}
                      />
                    </div>
                    <div>
                      <h3>Pay with bank transfer</h3>
                      <p>
                        You will be redirected at checkout to complete payment
                      </p>
                    </div>
                  </div>
                  <div className="select-section">
                    <div>
                      <input
                        type="radio"
                        name="payment-method"
                        value={'delivery'}
                      />
                    </div>
                    <div>
                      <h3>Pay on delivery</h3>
                      <p>You will pay at the point of delivery </p>
                    </div>
                  </div>
                </div>
              </LargeAccordion>
            </div>
          </div>
          <div className="item-box">
            <div className="checkout-items">
              <h3>Order summary</h3>
              <div>
                {cart.cart_items.map((value, idx) => (
                  <MiniCartItem key={idx} data={value.product} quantity={value.quantity}  />
                ))}
              </div>
            </div>
            <div className="total-box">
              <h3>Price details</h3>
              <div className="flex-between">
                <p>Subtotal</p>
                <h3>₦ {`${cart.price}`}</h3>
              </div>
              <div className="flex-between">
                <p>Shipping Fee</p>
                <h3>₦ 200</h3>
              </div>
              <div className="flex-between">
                <p>Total</p>
                <h3>₦ {cart.price}</h3>
              </div>
            </div>
            <div style={{ paddingTop: '1em', paddingBottom: '1em' }}>
              <NormalButton full onClick={Pay}>
                Pay Now
              </NormalButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
