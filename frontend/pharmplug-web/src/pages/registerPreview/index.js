import Logo from '../../components/logo/index.js'
import './style.scss'
import { NormalButton } from '../../components/button/index.js'
import assets from '../../assets/index.js'
import { Link, useNavigate } from 'react-router-dom'
import Path from '../../navigations/constants.js'
import { FaUserDoctor, FaUser } from 'react-icons/fa6'
import { useState } from 'react'

const RegisterPreview = () => {
  const [currentPick, setCurrentPick] = useState(null)
  const navigate = useNavigate()
  const selectPick = (pick) => {
    if (currentPick === 'user' && pick === 'user') {
      navigate(Path.register)
    } else if (currentPick === 'doctor' && pick === 'doctor') {
      navigate(Path.doctorRegister)
    } else {
      setCurrentPick(pick)
    }
  }
  const sendRegister = () => {
    if (currentPick == null) {
      return
    } else if (currentPick == 'user') {
      navigate(Path.register)
    } else if (currentPick == 'doctor') {
      navigate(Path.doctorRegister)
    }
  }
  return (
    <div className="auth-full-page2">
      <div
        className="image-div"
        style={{ backgroundImage: `url("${assets.authBG2}")` }}
      ></div>
      <div className="main-page-div">
        <Logo />
        <p className="mb-2em text-center">
          Which{' '}
          <span style={{ color: '#2DAA5F', fontWeight: 'bold' }}>user</span>{' '}
          best describes you?
        </p>
        <div className="user-chooser">
          <button
            className={`single-box${currentPick == 'doctor' ? ' active' : ''}`}
            onClick={() => selectPick('doctor')}
          >
            <FaUserDoctor className="box-icon" />
            <h2>Doctor</h2>
          </button>
          <button
            className={`single-box${currentPick == 'user' ? ' active' : ''}`}
            onClick={() => selectPick('user')}
          >
            <FaUser className="box-icon" />
            <h2>Patient</h2>
          </button>
        </div>
        <div className="mb-2em" style={{ width: '80%' }}>
          <NormalButton full onClick={sendRegister}>
            Continue
          </NormalButton>
        </div>
        <p className="mb-2em text-center">
          Already have an account ?{' '}
          <Link to={Path.login} className="link">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPreview
