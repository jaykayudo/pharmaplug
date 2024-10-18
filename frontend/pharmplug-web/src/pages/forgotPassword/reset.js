import { NormalInput } from '../../components/input/index.js'
import { NormalButton } from '../../components/button/index.js'
import { useState } from 'react'
const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  return (
    <div className="auth-full-page">
      <div className="form-box">
        <h2 className="mb-2em text-center">Reset Password</h2>
        <p className="mb-2em text-center">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <div className="auth-form-group">
          <NormalInput
            label={'Password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="auth-form-group">
          <NormalInput
            label={'Confirm Password'}
            placeholder="Enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <NormalButton full>Reset Password</NormalButton>
      </div>
    </div>
  )
}

export default ResetPassword
