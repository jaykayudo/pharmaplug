import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Container, MainContainer } from '../../../components/container'
import { ThemeMode, ThemeType } from '../../../../types'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { AppText } from '../../../components/text'
import { NormalInput } from '../../../components/input'
import { NormalButtton } from '../../../components/button'
import { AuthContext } from '../../../contexts/AuthContext'
import { validatePassword } from '../../../infrastructure/utils/validation'
import { usePostAPI, useGetAPI } from '../../../services/serviceHooks'
import { endpoints } from '../../../services/constants'

const Profile = () => {
  const themeContext = useContext(ThemeContext)
  const authContext = useContext(AuthContext)
  const styles = getStyles(themeContext.theme, themeContext.currentMode)
  const [activePage, setActivePage] = useState(1)
  const [firstName, setFirstName] = useState(authContext.user.first_name)
  const [lastName, setLastName] = useState(authContext.user.last_name ?? '')
  const [email, setEmail] = useState(authContext.user.email)
  const [username, setUsername] = useState(authContext.user.username)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const submitPasswordForm = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Validation Error', 'all fields are required')
      return
    }
    const passwordValidation = validatePassword(newPassword)

    if (!passwordValidation.status) {
      Alert.alert('Validation Error', passwordValidation.errorText)
      return
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Validation Error', 'Passwords do not match')
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
      Alert.alert('Validation Error', 'first name field is required')
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
    Alert.alert('Success', 'Password Changed')
    setOldPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }
  const onProfileSuccess = (data) => {
    authContext.logUserIn(data)
    Alert.alert('Success', 'Profile Updated')
  }
  const ChangePasswordAPI = usePostAPI(
    endpoints.changePassword,
    null,
    onChangeSuccess,
  )
  const ProfileUpdateAPI = usePostAPI(endpoints.profile, null, onProfileSuccess)
  const CategoryAPI = useGetAPI(endpoints.doctorCategories, null, fetchCategory)
  return (
    <MainContainer title="Profile" back>
      <Container>
        <View>
          <View style={styles.tabButtonCover}>
            <TouchableOpacity
              style={[
                styles.tabButtons,
                activePage === 1 ? styles.activeTabButton : {},
              ]}
              onPress={() => setActivePage(1)}
            >
              <AppText>Profile</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButtons,
                activePage === 2 ? styles.activeTabButton : {},
              ]}
              onPress={() => setActivePage(2)}
            >
              <AppText>Security</AppText>
            </TouchableOpacity>
          </View>
          <View>
            {activePage === 1 && (
              <View style={{ marginVertical: 20 }}>
                <View></View>
                <View style={{ marginBottom: 30 }}>
                  <AppText style={styles.headerText}>Profile Photo</AppText>
                  <AppText style={styles.smallText}>
                    This image will be displayed on your profile
                  </AppText>
                </View>
                <View style={{ marginBottom: 10 }}>
                  <AppText style={styles.headerText}>
                    Personal Information
                  </AppText>
                  <AppText style={styles.smallText}>
                    This image will be displayed on your profile
                  </AppText>
                </View>
                <View>
                  <View style={styles.formGroup}>
                    <NormalInput
                      label="First Name"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <NormalInput
                      label="Last Name"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <NormalInput label="Email" value={email} editable={false} />
                  </View>
                  <View style={styles.formGroup}>
                    <NormalInput
                      label="Username"
                      value={username}
                      onChangeText={setUsername}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <NormalInput label="Role" />
                  </View>
                  <View>
                    <NormalButtton onPress={submitUpdateProfileForm}>
                      Save Changes
                    </NormalButtton>
                  </View>
                </View>
              </View>
            )}
            {activePage === 2 && (
              <View style={{ marginVertical: 20 }}>
                <View style={{ marginBottom: 30 }}>
                  <AppText style={styles.headerText}>Profile Photo</AppText>
                  <AppText style={styles.smallText}>
                    This image will be displayed on your profile
                  </AppText>
                </View>
                <View style={styles.formGroup}>
                  <NormalInput
                    label="Current Password"
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                  />
                </View>
                <View style={styles.formGroup}>
                  <NormalInput
                    label="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>
                <View style={styles.formGroup}>
                  <NormalInput
                    label="Confirm New Password"
                    secureTextEntry
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                  />
                </View>
                <View>
                  <NormalButtton onPress={submitPasswordForm}>
                    Update Password
                  </NormalButtton>
                </View>
              </View>
            )}
          </View>
        </View>
      </Container>
    </MainContainer>
  )
}

export default Profile

const getStyles = (theme: ThemeType, mode: ThemeMode) =>
  StyleSheet.create({
    tabButtonCover: {
      borderRadius: 10,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#E4E7EC',
      overflow: 'hidden',
    },
    tabButtons: {
      flexGrow: 1,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTabButton: {
      backgroundColor: '#F0F2F5',
    },
    headerText: {
      marginBottom: 5,
    },
    smallText: {
      color: '#667185',
    },
    formGroup: {
      marginBottom: 10,
    },
  })
