import { NormalInput } from '../../components/input/index.js'
import { NormalButton } from '../../components/button/index.js'
import { useState } from 'react'
import Path from '../../navigations/constants.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePostAPI } from '../../services/serviceHooks.js'
import { endpoints } from '../../services/constants.js'
import { message } from 'antd'
const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const user = location.state.id
  if (!user) {
    navigate(-1)
  }
  const submitForm = () => {
    if (code.length != 6) {
      message.error({
        content: 'code length is invalid',
        duration: 2,
      })
      return
    } else if (password.length < 8) {
      message.error({
        content: 'Password too short',
        duration: 2,
      })
      return
    } else if (confirmPassword != password) {
      message.error({
        content: 'Password mismatch',
        duration: 2,
      })
      return
    }
    const data = {
      user,
      code,
      password,
    }
    sendRequest(data)
  }
  const onSuccessCallback = (data) => {
    message.success({
      content: 'Password reset successfully',
      duration: 3,
    })
    location.state
    navigate(Path.login, { replace: true })
  }
  const { sendRequest } = usePostAPI(
    endpoints.resetPassword,
    null,
    onSuccessCallback,
  )
  return (
    <div className="auth-full-page">
      <div className="form-box">
        <h2 className="mb-2em text-center">Reset Password</h2>
        <p className="mb-2em text-center">
          Enter the 6-digit code sent to your email and your new password.
        </p>
        <div className="auth-form-group">
          <NormalInput
            label={'Code'}
            maxLength={6}
            minLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="tel"
          />
        </div>
        <div className="auth-form-group">
          <NormalInput
            label={'New Password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="auth-form-group">
          <NormalInput
            label={'Confirm New Password'}
            placeholder="Enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <NormalButton full onClick={submitForm}>
          Reset Password
        </NormalButton>
      </div>
    </div>
  )
}

export default ResetPassword
