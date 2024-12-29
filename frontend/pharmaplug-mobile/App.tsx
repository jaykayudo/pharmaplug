// import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, StatusBar } from 'react-native'
import AppNavigation from './src/features/navigation'
import { ThemeContextProvider } from './src/contexts/ThemeContext'
import AuthContextProvider from './src/contexts/AuthContext'
import CartContextProvider from './src/contexts/CartContext'
import { LoaderContextProvider } from './src/contexts/LoaderContext'
// Uncomment when using development build or production build
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react'

export default function App() {
  // Uncomment when using development build or production build
  // useEffect(()=>{
  //   GoogleSignin.configure({
  //     webClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  //     iosClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  //   });
  // },[])
  return (
    <LoaderContextProvider>
      <AuthContextProvider>
        <ThemeContextProvider>
          <CartContextProvider>
            <StatusBar barStyle={'dark-content'} />
            <AppNavigation />
          </CartContextProvider>
        </ThemeContextProvider>
      </AuthContextProvider>
    </LoaderContextProvider>
  )
}
