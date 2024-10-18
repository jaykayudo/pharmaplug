import ReactCodeInput from 'react-code-input'
import { NormalButton } from '../../components/button/index.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Path from '../../navigations/constants.js'

const VerifyForgotPasswordCode = () => {
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const submitForm = () => {
    navigate(Path.resetPassword)
  }
  console.log(ReactCodeInput)
  return (
    <div className="auth-full-page">
      <div className="form-box">
        <h2 className="mb-2em text-center">Verfiy Code</h2>
        <p className="mb-2em text-center">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <div className="auth-form-group">
          {/* <ReactCodeInput fields={6} value={code} onChange={setCode} type="tel" /> */}
        </div>
        <NormalButton full onClick={submitForm}>
          Submit
        </NormalButton>
      </div>
    </div>
  )
}

export default VerifyForgotPasswordCode
