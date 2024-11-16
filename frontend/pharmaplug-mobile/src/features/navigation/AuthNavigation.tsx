import { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import Landing from '../auth/screens/Landing'
import RegisterNavigator from './RegisterNavigation'
import LoginNavigator from './LoginNavigation'

// import { ThemeContext } from '../../context/themecontext'

const AuthStack = createStackNavigator()

const AuthNavigator = () => {
  //   const theme = useContext(ThemeContext).theme
  const MyTheme = {
    ...DefaultTheme,
    // dark: theme.currentTheme === 'dark',
    // colors: {
    //   ...DefaultTheme.colors,
    //   primary: theme.color[theme.currentTheme].ui.primary,
    //   background: theme.color[theme.currentTheme].bg.primary,
    // },
  }
  return (
    <NavigationContainer theme={MyTheme}>
      <AuthStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <AuthStack.Screen name="Landing" component={Landing} />
        <AuthStack.Screen name="Login" component={LoginNavigator} />
        <AuthStack.Screen name="SignUp" component={RegisterNavigator} />
      </AuthStack.Navigator>
    </NavigationContainer>
  )
}

export default AuthNavigator
