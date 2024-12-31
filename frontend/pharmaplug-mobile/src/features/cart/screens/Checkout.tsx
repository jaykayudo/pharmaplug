import { Alert, StyleSheet, View } from 'react-native'
import { Container, MainContainer } from '../../../components/container'
import { Accordion } from '../../../components/accordion'
import { NormalInput } from '../../../components/input'
import { ThemeMode, ThemeType } from '../../../../types'
import { useContext, useState, useEffect } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { NormalButtton } from '../../../components/button'
import { AppText } from '../../../components/text'
import RadioBox from '../components/RadioBox'
import { CartContext } from '../../../contexts/CartContext'
import ProductSummaryBox from '../components/ProductSummaryBox'
import RNPickerSelect from 'react-native-picker-select'
import {
  validateName,
  validateEmail,
  validatePhoneNumber,
} from '../../../infrastructure/utils/validation'
import SelectDropdown from 'react-native-select-dropdown'
import { usePostAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'
import { LoaderContext } from '../../../contexts/LoaderContext'
import { Paystack } from 'react-native-paystack-webview'
import { useNavigation } from '@react-navigation/native'

const Checkout = () => {
  const themeContext = useContext(ThemeContext)
  const cartContext = useContext(CartContext)
  const loaderContext = useContext(LoaderContext)
  const navigation = useNavigation()
  const { cart } = cartContext
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const statesData = [
    { label: 'Abia', value: 'Abia' },
    { label: 'Adamawa', value: 'Adamawa' },
    { label: 'AkwaIbom', value: 'AkwaIbom' },
    { label: 'Anambra', value: 'Anambra' },
    { label: 'Bauchi', value: 'Bauchi' },
    { label: 'Bayelsa', value: 'Bayelsa' },
    { label: 'Benue', value: 'Benue' },
    { label: 'Borno', value: 'Borno' },
    { label: 'Cross River', value: 'Cross River' },
    { label: 'Delta', value: 'Delta' },
    { label: 'Ebonyi', value: 'Ebonyi' },
    { label: 'Edo', value: 'Edo' },
    { label: 'Ekiti', value: 'Ekiti' },
    { label: 'Enugu', value: 'Enugu' },
    { label: 'FCT', value: 'FCT' },
    { label: 'Gombe', value: 'Gombe' },
    { label: 'Imo', value: 'Imo' },
    { label: 'Jigawa', value: 'Jigawa' },
    { label: 'Kaduna', value: 'Kaduna' },
    { label: 'Kano', value: 'Kano' },
    { label: 'Katsina', value: 'Katsina' },
    { label: 'Kebbi', value: 'Kebbi' },
    { label: 'Kogi', value: 'Kogi' },
    { label: 'Kwara', value: 'Kwara' },
    { label: 'Lagos', value: 'Lagos' },
    { label: 'Nasarawa', value: 'Nasarawa' },
    { label: 'Niger', value: 'Niger' },
    { label: 'Ogun', value: 'Ogun' },
    { label: 'Ondo', value: 'Ondo' },
    { label: 'Osun', value: 'Osun' },
    { label: 'Oyo', value: 'Oyo' },
    { label: 'Plateau', value: 'Plateau' },
    { label: 'Rivers', value: 'Rivers' },
    { label: 'Sokoto', value: 'Sokoto' },
    { label: 'Taraba', value: 'Taraba' },
    { label: 'Yobe', value: 'Yobe' },
    { label: 'Zamfara', value: 'Zamfara' },
  ]
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [state, setState] = useState('')
  const [region, setRegion] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<number | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<number | null>(null)
  const [billingDetail, setBillingDetail] = useState({
    billingEmail: "",
    key:"",
    amount: 0,
    ref:"",
    onSuccessResponse: (ref: string) => {}
  })
  const [pay, setPay] = useState(false)
  const onPick = () => {}
  const submitOrder = () => {
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
        Alert.alert('Validation Error', validator.errorText)
        return
      }
    }
    if (!state || isNaN(paymentMethod) || !region || isNaN(deliveryMethod)) {
      Alert.alert('Validation Error', 'All fields is required')
      return
    }
    const data = {
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      state,
      region,
      address,
      payment_method: paymentMethod,
      delivery_method: deliveryMethod,
      cart: cartContext.cartId,
    }
    sendRequest(data)
  }

  const onOrderPaymentSuccess = (ref: string) =>{
    orderVerifyAPI.sendRequest({
      ref: ref
    })
  }
  const onSuccessCallback = (data) =>{
    console.log("Triggering Order Payment")
    setBillingDetail({
      billingEmail: data.email,
      key: data.key,
      amount: Number(data.amount),
      ref: data.ref,
      onSuccessResponse: onOrderPaymentSuccess
    })
    setPay(true)
  }
  const onOrderVerify = (data) =>{
    Alert.alert("Success","Order Paid successfully")
    navigation.navigate("Account",{screen:"History"})
    cartContext.clearCart()
  }
  const { sendRequest } = usePostAPI(
    endpoints.checkout,
    loaderContext.setLoading,
    onSuccessCallback,
  )
  const orderVerifyAPI = usePostAPI(
    endpoints.orderPayVerify,
    loaderContext.setLoading,
    onOrderVerify,
  )
  return (
    <MainContainer title="Checkout" back>
      <Container>
        <View>
          <View style={{ marginBottom: 15 }}>
            <Accordion title="Personal Details" initialState={true}>
              <View style={styles.formGroup}>
                <NormalInput
                  label="Fullname"
                  placeholder="Charles white"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              <View style={styles.formGroup}>
                <NormalInput
                  label="Phone number"
                  placeholder="09022792792"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              <View style={styles.formGroup}>
                <NormalInput
                  label="Email address"
                  placeholder="charleswhite@email.com"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.formGroup}>
                <AppText style={{ marginBottom: 10 }}>State</AppText>
                <SelectDropdown
                  data={statesData}
                  onSelect={(selectedItem, index)=>{
                    setState(selectedItem.value)
                  }}
                  renderItem={(item, index, isSelected)=>(
                    <View style={{paddingHorizontal: 10, paddingVertical: 5, borderBottomColor: "#1e1e1e", borderBottomWidth: 0.5}}>
                        <AppText>{item.label}</AppText>
                    </View>
                  )

                  }
                  renderButton={(selectedItem, isOpened)=>(
                    <View style={[styles.normalInput]}>
                        {selectedItem?(
                           <AppText>{selectedItem.label}</AppText>
                        ):(
                          <AppText>Select a state</AppText>
                        )}
                        
                    </View>
                  )}
                />
              </View>
              <View style={styles.formGroup}>
                <NormalInput
                  label="Region"
                  placeholder="region"
                  value={region}
                  onChangeText={setRegion}
                />
              </View>
              <View style={styles.formGroup}>
                <NormalInput
                  label="Address"
                  placeholder="address"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
              <NormalButtton onPress={() => {}}>Save Details</NormalButtton>
            </Accordion>
          </View>
          <View style={{ marginBottom: 15 }}>
            <Accordion title="Delivery Options" initialState={true}>
              <AppText style={{ fontSize: 12, marginBottom: 10 }}>
                Choose how you want to receive your product
              </AppText>
              <View style={{ marginBottom: 20 }}>
                <RadioBox
                  title="Home delivery ($2.7 delivery fee)"
                  value="home"
                  description="You will be redirected at checkout to complete payment"
                  checked={deliveryMethod === 0}
                  onChecked={() => {
                    setDeliveryMethod(0)
                  }}
                />
              </View>
              <View>
                <RadioBox
                  title="Pick up from pharmacy (no delivery fee))"
                  value="pharmacy"
                  description="You will pay at the point of delivery "
                  checked={deliveryMethod === 1}
                  onChecked={() => {
                    setDeliveryMethod(1)
                  }}
                />
              </View>
            </Accordion>
          </View>
          <View style={{ marginBottom: 15 }}>
            <Accordion title="Payment Method" initialState={true}>
              <AppText style={{ fontSize: 12, marginBottom: 10 }}>
                Choose how you want to receive your product
              </AppText>
              <View style={{ marginBottom: 20 }}>
                <RadioBox
                  title="Pay with card"
                  value="card"
                  description="You will be redirected at checkout to complete payment"
                  checked={paymentMethod === 1}
                  onChecked={() => {
                    setPaymentMethod(1)
                  }}
                />
              </View>
              <View>
                <RadioBox
                  title="Pay on delivery"
                  value="delivery"
                  description="You will pay at the point of delivery "
                  checked={paymentMethod === 0}
                  onChecked={() => {
                    setPaymentMethod(0)
                  }}
                />
              </View>
            </Accordion>
          </View>
        </View>
        <View>
          <AppText>Order Summary</AppText>
          <View style={{ marginVertical: 10 }}>
            {cart.cart_items.map((value, idx) => (
              <ProductSummaryBox
                key={idx}
                title={value.product.name}
                quantity={value.quantity}
                image={value.product.image}
                price={value.product.price}
              />
            ))}
          </View>
          <View style={styles.summaryBox}>
            <AppText style={{ fontWeight: 700 }}>Price Details</AppText>
            <View style={styles.dataBox}>
              <AppText
                style={{ fontSize: 13, color: '#1E1E1EB2', fontWeight: 500 }}
              >
                SubTotal
              </AppText>
              <AppText style={{ fontSize: 15 }}>₦ {cart.price}</AppText>
            </View>
            <View style={styles.dataBox}>
              <AppText
                style={{ fontSize: 13, color: '#1E1E1EB2', fontWeight: 500 }}
              >
                Shipping Fee
              </AppText>
              <AppText style={{ fontSize: 15 }}>₦ 200</AppText>
            </View>
            <View style={styles.dataBox}>
              <AppText
                style={{ fontSize: 13, color: '#1E1E1EB2', fontWeight: 500 }}
              >
                Total
              </AppText>
              <AppText style={{ fontSize: 15 }}>₦ {cart.price}</AppText>
            </View>
          </View>
          <View style={{ marginVertical: 15 }}>
            <NormalButtton onPress={submitOrder}>Pay Now</NormalButtton>
          </View>
        </View>
        <View>
        {pay && (
            <Paystack
              paystackKey={billingDetail.key}
              amount={billingDetail.amount}
              billingEmail={billingDetail.billingEmail}
              refNumber={billingDetail.ref}
              activityIndicatorColor="green"
              onCancel={(e) => {
                // handle response here
                Alert.alert("Message","Transaction Cancelled")
                setPay(false)
              }}
              onSuccess={(response) => {
                // handle response here
                billingDetail.onSuccessResponse(response.transactionRef?.reference ?? "")
                setPay(false)
              }}
              autoStart={pay}
          />
        )}
        </View>
      </Container>
    </MainContainer>
  )
}

export default Checkout

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    formGroup: {
      marginBottom: 10,
    },
    summaryBox: {
      marginVertical: 20,
      backgroundColor: theme.color[mode].bg.alt,
      padding: theme.size.spacing.md,
    },
    dataBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    normalInput: {
      borderRadius: theme.size.radius.large,
      backgroundColor: theme.color[mode].ui.input,
      borderColor: theme.color[mode].ui.border,
      borderWidth: 1,
      borderStyle: 'solid',
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
  })
