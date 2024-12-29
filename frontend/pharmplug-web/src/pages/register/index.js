import './style.scss'
import assets from '../../assets/index.js'
import Logo from '../../components/logo/index.js'
import { NormalSelect, SecondaryInput } from '../../components/input/index.js'
import { NormalButton } from '../../components/button/index.js'
import { Link, useNavigate } from 'react-router-dom'
import Path from '../../navigations/constants.js'
import { useGetAPI, usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { useContext, useEffect, useState } from 'react'
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from '../../utils/validation.js'
import { message } from 'antd'
import { AuthContext } from '../../context/authContext.js'
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import SiteLoader from '../../components/loader/index.js'

const Register = () => {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const [showAltForm, setShowAltForm] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const submitForm = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log(formData.get('fullname'))
    const emailValidation = validateEmail(formData.get('email'))
    const nameValidation = validateName(
      formData.get('fullname'),
      'full name',
      true,
    )
    const phonenumberValidation = validatePhoneNumber(
      formData.get('phone_number'),
    )
    const passwordValidation = validatePassword(formData.get('password'))
    for (const validator of [
      emailValidation,
      nameValidation,
      phonenumberValidation,
      passwordValidation,
    ]) {
      if (!validator.status) {
        message.error({
          content: validator.errorText,
          duration: 2,
        })
        return
      }
    }
    const [firstName, lastName] = formData.get('fullname').split(' ', 2)
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    sendRequest(formData)
  }
  const onSuccessCallback = (data) => {
    authContext.logUserIn(data)
    message.success({
      content: 'User account created',
      duration: 5,
    })
    navigate(Path.userDashboard)
  }
  const onGoogleLoginResponse = (response) => {
    console.log(response)
    setAuthToken(response.credential)
    // get additional info
    setShowAltForm(true)
  }
  const submitGoogleSignUptoBackend = () => {
    if (!authToken || !phoneNumber) {
      message.error({
        content: 'Fill all additional field',
        duration: 2,
      })
      return
    }
    googleSignupApi.sendRequest({
      auth_token: authToken,
      phone_number: phoneNumber,
    })
  }
  const onGoogleSignUp = (data) => {
    authContext.logUserIn(data)
    setShowAltForm(false)
    message.success({
      content: 'User account created',
      duration: 5,
    })
    navigate(Path.userDashboard)
  }
  const onErrorCallback = (err) => {
    setShowAltForm(false)
    googleLogout()
  }

  const googleSignupApi = usePostAPI(
    endpoints.googleSignUp,
    setLoading,
    onGoogleSignUp,
    onErrorCallback,
  )
  const { sendRequest } = usePostAPI(
    endpoints.register,
    setLoading,
    onSuccessCallback,
  )
  return (
    <div className="auth-full-page2">
      {loading && <SiteLoader />}
      <div
        className="image-div"
        style={{ backgroundImage: `url("${assets.authBG2}")` }}
      >
        <p className="text-center text-white">
          Office ipsum you must be muted. Replied event activities closing eow
          like rehydrate. Points money agile including whistles initiative
          shower loss cadence running.
        </p>
      </div>
      {showAltForm ? (
        <div className="main-page-div">
          <Logo />
          <h2 className="mb-2em text-center">Add additional fields</h2>
          <SecondaryInput
            label={'Phone number'}
            type="tel"
            placeholder="Enter your phone number"
            name="phone_number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <NormalButton full onClick={submitGoogleSignUptoBackend}>
            Register with Google
          </NormalButton>
        </div>
      ) : (
        <form className="main-page-div" onSubmit={submitForm}>
          <Logo />
          <h2 className="mb-2em text-center">Create your account</h2>
          <div style={{ padding: '15px 0' }}>
            <GoogleLogin
              size="large"
              text="signup_with"
              onSuccess={(credentialResponse) => {
                onGoogleLoginResponse(credentialResponse)
              }}
              onError={() => {
                message.error({
                  content: 'Authentication Error',
                  duration: 2,
                })
              }}
            />
          </div>
          <div className="register-form-box">
            <SecondaryInput
              label={'Full name'}
              placeholder="Enter your full name"
              name="fullname"
              required
            />
            <SecondaryInput
              label={'Email address'}
              placeholder="Enter your email address"
              type="email"
              name="email"
              required
            />
            <SecondaryInput
              label={'Phone number'}
              type="tel"
              placeholder="Enter your phone number"
              name="phone_number"
            />
            <SecondaryInput
              label={'Password'}
              type="password"
              minLength={8}
              placeholder="Enter your password"
              name="password"
              required
            />
            <div></div>
            <NormalButton full>Register</NormalButton>
            <p className="mb-2em text-center" style={{ marginTop: '1em' }}>
              Already have an account ?{' '}
              <Link to={Path.login} className="link">
                Log In
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  )
}

export default Register
