import './style.scss'
import { useContext, useState } from 'react'
import { NormalInput } from '../../components/input/index.js'
import { NormalButton } from '../../components/button/index.js'
import { Link, useNavigate } from 'react-router-dom'
import Path from '../../navigations/constants.js'
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from '../../utils/validation.js'
import { usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { AuthContext } from '../../context/authContext.js'
import { message } from 'antd'

const Register = () => {
  const authContext = useContext(AuthContext)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const submitForm = () => {
    const fullNameValidation = validateName(fullName, 'Full name')
    const emailValidation = validateEmail(email)
    const phoneNumberValidation = validatePhoneNumber(phoneNumber)
    const passwordValidation = validatePassword(password)
    for (const validator of [
      fullNameValidation,
      emailValidation,
      phoneNumberValidation,
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
    const [firstName, lastName] = fullName.split(' ', 2)
    const data = {
      first_name: firstName,
      last_name: lastName ?? '',
      email: email,
      phone_number: phoneNumber,
      password: password,
    }
    message.loading({
      content: 'Sending Request',
      duration: 2,
    })
    sendRequest(data)
  }
  const onSuccessCallback = (data) => {
    authContext.logUserIn(data)
    message.success({
      content: 'Registration Successful',
      duration: 2,
    })
    navigate(Path.userDashboard)
  }
  const { sendRequest, loading } = usePostAPI(
    endpoints.register,
    null,
    onSuccessCallback,
  )
  return (
    <div className="auth-full-page">
      <div className="form-box">
        <h2 className="mb-2em text-center">Create Account</h2>
        <p className="mb-2em text-center">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <div className="auth-form-group">
          <NormalInput
            label={'Full name'}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="auth-form-group">
          <NormalInput
            label={'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>
        <div className="auth-form-group">
          <NormalInput
            label={'Phone Number'}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="tel"
          />
        </div>
        <div className="auth-form-group">
          <NormalInput
            label={'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="mb-2em text-center">
          Already have an account ?{' '}
          <Link to={Path.login} className="link">
            Login
          </Link>
        </p>
        <NormalButton full onClick={submitForm} disabled={loading}>
          Create Account
        </NormalButton>
      </div>
    </div>
  )
}

export default Register
