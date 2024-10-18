import './style.scss'
import assets from '../../assets/index.js'
import Logo from '../../components/logo/index.js'
import {
  NormalInput,
  NormalSelect,
  SecondaryInput,
} from '../../components/input/index.js'
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

const DoctorRegister = () => {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const [fields, setFields] = useState([])
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
    if (!formData.get('field')) {
      message.error({
        content: 'select a valid doctor field',
        duration: 2,
      })
      return
    }
    const [firstName, lastName] = formData.get('fullname').split(' ', 2)
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    sendRequest(formData)
  }
  const onSuccessCallback = (data) => {
    authContext.logUserIn(data)
    message.success({
      content: 'Doctor account created',
      duration: 5,
    })
    navigate(Path.doctorDashboard)
  }
  const fetchFields = (data) => {
    setFields(data)
  }
  const categoryAPI = useGetAPI(endpoints.doctorCategories, null, fetchFields)
  const { sendRequest, loading } = usePostAPI(
    endpoints.registerDoctor,
    null,
    onSuccessCallback,
  )
  useEffect(() => {
    categoryAPI.sendRequest()
  }, [])
  return (
    <div className="auth-full-page2">
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
      <form className="main-page-div" onSubmit={submitForm}>
        <Logo />
        <h2 className="mb-2em text-center">Create your account</h2>
        <button></button>
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
          <NormalSelect
            label="Select a field"
            headerLabel={'Select a field'}
            required
            name="field"
          >
            {fields.map((value, idx) => (
              <option value={value.id} key={idx}>
                {value.name}
              </option>
            ))}
          </NormalSelect>
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
    </div>
  )
}

export default DoctorRegister
