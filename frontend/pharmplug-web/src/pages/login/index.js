import './style.scss'
import { useContext, useState } from 'react'
import { NormalInput } from '../../components/input/index.js'
import { NormalButton } from '../../components/button/index.js'
import { Link, useNavigate } from 'react-router-dom'
import Path from '../../navigations/constants.js'
import { AuthContext } from '../../context/authContext.js'
import { validateEmail } from '../../utils/validation.js'
import { message } from 'antd'
import { usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'

const Login = () => {
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
  const { sendRequest, loading } = usePostAPI(
    endpoints.login,
    null,
    onSuccessCallback,
  )
  return (
    <div className="auth-full-page">
      <form
        className="form-box"
        onSubmit={(e) => {
          e.preventDefault()
          submitForm()
        }}
      >
        <h2 className="mb-2em text-center">Log In</h2>
        <p className="mb-2em text-center">
          Lorem ipsum dolor sit amet consectetur.
        </p>

        <div className="auth-form-group">
          <NormalInput
            value={email}
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-form-group">
          <NormalInput
            value={password}
            label={'Password'}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="mb-2em text-center">
          Don't have an account ?{' '}
          <Link to={Path.register} className="link">
            Register
          </Link>
        </p>
        <NormalButton full onClick={submitForm} disabled={loading}>
          Log In
        </NormalButton>
        <p className="mb-2em text-center" style={{ marginTop: '1em' }}>
          Forgot Password ?{' '}
          <Link to={Path.forgotPassword} className="link">
            Click here
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
