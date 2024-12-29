import ReactCodeInput from 'react-code-input'
import { NormalButton } from '../../components/button/index.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Path from '../../navigations/constants.js'
import { NormalInput } from '../../components/input/index.js'
import { message } from 'antd'
import { usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'

const VerifyForgotPasswordCode = () => {
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const submitForm = () => {
    if (code.length !== 6) {
      message.error({
        content: 'Code length invalid',
        duration: 2,
      })
      return
    }
  }
  const verifyForgotPassword = usePostAPI(endpoints)
  useEffect(() => {}, [])
  return (
    <div className="auth-full-page">
      <div className="form-box">
        <h2 className="mb-2em text-center">Verfiy Code</h2>
        <p className="mb-2em text-center">
          Enter the 6-digit code sent to your email.
        </p>
        <div className="auth-form-group">
          <NormalInput
            maxLength={6}
            minLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="tel"
          />
        </div>
        <NormalButton full onClick={submitForm}>
          Submit
        </NormalButton>
      </div>
    </div>
  )
}

export default VerifyForgotPasswordCode
