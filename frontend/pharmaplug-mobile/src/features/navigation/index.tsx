// import { AuthContext } from '../../contexts/AuthContext'
import AuthNavigator from './AuthNavigation'
import MainNavigator from './MainNavigation'
import { useContext } from 'react'

const AppNavigation = () => {
//   const authContext = useContext(AuthContext)
//   if (authContext.isLoggedIn) {
//     return <MainNavigator />
//   }
  return <AuthNavigator />
}

export default AppNavigation;