import './style.scss'
import React, { useContext, useState } from 'react'
import { NormalButton } from '../../../../components/button/index.js'
import { NormalInput } from '../../../../components/input/index.js'
import assets from '../../../../assets/index.js'
import { LuImagePlus } from 'react-icons/lu'
import { FaCheckCircle } from 'react-icons/fa'
import { useGetAPI, usePostAPI } from '../../../../services/serviceHooks.js'
import { endpoints } from '../../../../services/constants.js'
import { validatePassword, validateName } from '../../../../utils/validation.js'
import { message } from 'antd'
import { AuthContext } from '../../../../context/authContext.js'

const UserSettings = () => {
  const authContext = useContext(AuthContext)
  const [profileDisabled, setProfileDisabled] = useState(true)
  const [activePage, setActivePage] = useState(1)

  const [firstName, setFirstName] = useState(authContext.user.first_name)
  const [lastName, setLastName] = useState(authContext.user.last_name ?? '')
  const [email, setEmail] = useState(authContext.user.email)
  const [username, setUsername] = useState(authContext.user.username)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const onInputChange = () => {
    if (profileDisabled) {
      setProfileDisabled(false)
    }
  }
  const submitPasswordForm = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      message.error({
        content: 'All fields are required',
        duration: 2,
      })
      return
    }
    const passwordValidation = validatePassword(newPassword)

    if (!passwordValidation.status) {
      message.error({
        content: passwordValidation.errorText,
        duration: 2,
      })
      return
    }
    if (newPassword !== confirmNewPassword) {
      message.error({
        content: 'Passwords does not match',
        duration: 2,
      })
      return
    }
    const data = {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    }
    ChangePasswordAPI.sendRequest(data)
  }
  const submitUpdateProfileForm = () => {
    if (!firstName) {
      message.error({
        content: 'first name field is required',
        duration: 2,
      })
      return
    }
    if (
      authContext.user.first_name === firstName.trim() &&
      authContext.user.last_name === lastName.trim()
    ) {
      return
    }
    const data = {
      first_name: firstName,
      last_name: lastName,
    }
    ProfileUpdateAPI.sendRequest(data)
  }
  const fetchCategory = (data) => {}
  const onChangeSuccess = (data) => {
    message.success({
      content: 'Password changed',
      duration: 2,
    })
    setOldPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }
  const onProfileSuccess = (data) => {
    authContext.logUserIn(data)
    message.success({
      content: 'Profile updated',
      duration: 2,
    })
  }
  const ChangePasswordAPI = usePostAPI(
    endpoints.changePassword,
    null,
    onChangeSuccess,
  )
  const ProfileUpdateAPI = usePostAPI(endpoints.profile, null, onProfileSuccess)
  const CategoryAPI = useGetAPI(endpoints.doctorCategories, null, fetchCategory)
  return (
    <div className="settings-cover">
      <div className="mb-3em">
        <h2 className="mb-1em">Settings</h2>
        <p>
          Take a look at your policies and the new policy to see what is covered
        </p>
      </div>
      <div>
        <div className="tab-buttons mb-2em">
          <button
            className={`${activePage == 1 ? 'active' : ''}`}
            onClick={() => setActivePage(1)}
          >
            Profile
          </button>
          <button
            className={`${activePage == 2 ? 'active' : ''}`}
            onClick={() => setActivePage(2)}
          >
            Security
          </button>
        </div>
        <div className="settings-box">
          {activePage == 1 && (
            <div className="profile-box">
              <div className="profile-image-box gap-20 mb-2em">
                <div>
                  <p className="text-bold mb-1em">Profile photo</p>
                  <p className="font-14 text-gray mb-1em">
                    This image will be displayed on your profile
                  </p>
                  <button className="change-photo-button">
                    <LuImagePlus size={16} color="#145B7A" />
                    <span>Change Photo</span>
                  </button>
                </div>
                <div className="profile-image-holder">
                  <img src={assets.profile} className="big-rounded-image" />
                  <span style={{ position: 'absolute', bottom: 2, right: 5 }}>
                    <FaCheckCircle color="#145B7A" size={25} />
                  </span>
                </div>
              </div>
              <form
                className="personal-info-box"
                onInput={onInputChange}
                onSubmit={(e) => {
                  e.preventDefault()
                  submitUpdateProfileForm()
                }}
              >
                <div className="w-30 sm-w-100 mb-1em">
                  <h3 className="mb-1em">Personal Information</h3>
                  <p className="mb-1em text-gray font-14">
                    Update your personal details here
                  </p>
                  <NormalButton
                    disabled={profileDisabled || ProfileUpdateAPI.loading}
                    style={{ borderRadius: 10 }}
                    onClick={submitUpdateProfileForm}
                  >
                    Save changes
                  </NormalButton>
                </div>
                <div className="w-60 sm-w-100">
                  <div className="flex-between">
                    <div className="w-45 sm-w-100">
                      <NormalInput
                        label={'First Name'}
                        value={firstName}
                        onChange={(event) => {
                          setFirstName(event.target.value)
                        }}
                      />
                    </div>
                    <div className="w-45 sm-w-100">
                      <NormalInput
                        label={'Last Name'}
                        value={lastName}
                        onChange={(event) => {
                          setLastName(event.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <NormalInput
                      label={'Email address'}
                      disabled={true}
                      value={email}
                    />
                  </div>
                  <div>
                    <NormalInput
                      label={'Username'}
                      value={username}
                      disabled={true}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
          {activePage == 2 && (
            <div className="security-box">
              <form
                className="personal-info-box"
                onInput={onInputChange}
                onSubmit={(e) => {
                  e.preventDefault()
                  submitPasswordForm()
                }}
              >
                <div className="w-30 sm-w-100 mb-1em">
                  <h3 className="mb-1em">Change Password</h3>
                  <p className="mb-1em text-gray font-14">
                    Update your password here
                  </p>
                  <NormalButton
                    disabled={profileDisabled || ChangePasswordAPI.loading}
                    style={{ borderRadius: 10 }}
                  >
                    Save changes
                  </NormalButton>
                </div>
                <div className="w-60 sm-w-100">
                  <div className="mb-1em">
                    <NormalInput
                      label={'Enter Current Password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-1em">
                    <NormalInput
                      label={'Enter New Password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-1em">
                    <NormalInput
                      label={'Confirm New Password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSettings
