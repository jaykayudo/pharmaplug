// import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, StatusBar } from 'react-native'
import AppNavigation from './src/features/navigation'
import { ThemeContextProvider } from './src/contexts/ThemeContext'
import AuthContextProvider from './src/contexts/AuthContext'
import CartContextProvider from './src/contexts/CartContext'
import { LoaderContextProvider } from './src/contexts/LoaderContext'

export default function App() {
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
