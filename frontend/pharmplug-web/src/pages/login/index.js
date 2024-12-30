import './style.scss'
import assets from '../../assets/index.js'
import { useContext, useState } from 'react'
import Logo from '../../components/logo/index.js'
import { SecondaryInput } from '../../components/input/index.js'
import { NormalButton } from '../../components/button/index.js'
import { Link, useNavigate } from 'react-router-dom'
import Path from '../../navigations/constants.js'
import { AuthContext } from '../../context/authContext.js'
import { validateEmail } from '../../utils/validation.js'
import { message } from 'antd'
import { usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import SiteLoader from '../../components/loader/index.js'

const Login = () => {
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const submitForm = () => {
    if (!email || !password) return
    const emailValidation = validateEmail(email)
    if (!emailValidation.status) {
      message.error({
        content: emailValidation.errorText,
        duration: 2,
      })
      return
    }
    const data = {
      email,
      password,
    }
    sendRequest(data)
  }
  const onSuccessCallback = (data) => {
    authContext.logUserIn(data)
    if (data.is_doctor) {
      navigate(Path.doctorDashboard)
    } else {
      navigate(Path.userDashboard)
    }
  }
  const submitGoogleSignUptoBackend = (response) => {
    const authToken = response.credential
    googleSigninApi.sendRequest({
      auth_token: authToken,
    })
  }
  const onGoogleSignIn = (data) => {
    authContext.logUserIn(data)
    message.success({
      content: 'Login Successful',
      duration: 5,
    })
    if (data.is_doctor) {
      navigate(Path.doctorDashboard)
    } else {
      navigate(Path.userDashboard)
    }
  }
  const onErrorCallback = (err) => {
    googleLogout()
  }
  const googleSigninApi = usePostAPI(
    endpoints.googleSignIn,
    setLoading,
    onGoogleSignIn,
    onErrorCallback,
  )
  const { sendRequest } = usePostAPI(
    endpoints.login,
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
        <p className="text-center text-white"></p>
      </div>
      <form className="main-page-div">
        <Logo />
        <h2 className="mb-2em text-center">Login</h2>
        <div style={{ padding: '15px 0' }}>
          <GoogleLogin
            size="large"
            text="signin_with"
            onSuccess={(credentialResponse) => {
              submitGoogleSignUptoBackend(credentialResponse)
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
            label={'Email address'}
            placeholder="Enter your email address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <SecondaryInput
            label={'Password'}
            type="password"
            minLength={8}
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div></div>
          <NormalButton full onClick={submitForm} type="button">
            Login
          </NormalButton>
          <p className="mb-2em text-center" style={{ marginTop: '1em' }}>
            Don't have an account ?{' '}
            <Link to={Path.registerPreview} className="link">
              Create account
            </Link>
          </p>
          <p className="mb-2em text-center">
            Forgot Password ?{' '}
            <Link to={Path.forgotPassword} className="link">
              Click here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
