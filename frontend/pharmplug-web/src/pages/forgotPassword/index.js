import { useNavigate } from 'react-router-dom'
import { NormalButton } from '../../components/button/index.js'
import { NormalInput } from '../../components/input/index.js'
import Path from '../../navigations/constants.js'
import { useEffect, useState } from 'react'
import { usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const submitForm = () => {
    sendRequest({
      email,
    })
  }
  const onSuccessCallback = (data) => {
    navigate(Path.resetPassword, { state: { id: data } })
  }
  const { sendRequest, loading } = usePostAPI(
    endpoints.forgotPassword,
    null,
    onSuccessCallback,
  )
  return (
    <div className="auth-full-page">
      <div className="form-box">
        <h2 className="mb-2em text-center">Forgot Password</h2>
        <p className="mb-2em text-center">
          Enter your email address to receive a code
        </p>
        <div className="auth-form-group">
          <NormalInput
            label={'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <NormalButton disabled={loading} full onClick={submitForm}>
          Submit
        </NormalButton>
      </div>
    </div>
  )
}

export default ForgotPassword
