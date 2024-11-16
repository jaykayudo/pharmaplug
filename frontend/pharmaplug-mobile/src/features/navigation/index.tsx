import { AuthContext } from '../../context/authContext'
import AuthNavigator from './authNavigation'
import MainNavigator from './mainNavigation'
import { useContext } from 'react'

const AppNavigation = () => {
  const authContext = useContext(AuthContext)
  if (authContext.isLoggedIn) {
    return <MainNavigator />
  }
  return <AuthNavigator />
}

export default AppNavigation