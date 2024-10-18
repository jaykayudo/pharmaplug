import { useNavigate } from 'react-router-dom'
import { NormalButton } from '../../components/button/index.js'
import { NormalInput } from '../../components/input/index.js'
import Path from '../../navigations/constants.js'
import { useState } from 'react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const submitForm = () => {
    navigate(Path.forgotPasswordVerify)
  }
  return (
    <div className="auth-full-page">
      <div className="form-box">
        <h2 className="mb-2em text-center">Forgot Password</h2>
        <p className="mb-2em text-center">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <div className="auth-form-group">
          <NormalInput
            label={'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <NormalButton full onClick={submitForm}>
          Submit
        </NormalButton>
      </div>
    </div>
  )
}

export default ForgotPassword
