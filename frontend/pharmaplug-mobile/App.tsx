// import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, StatusBar } from 'react-native'
import AppNavigation from './src/features/navigation'
import { ThemeContextProvider } from './src/contexts/ThemeContext'
import AuthContextProvider from './src/contexts/AuthContext'
import CartContextProvider from './src/contexts/CartContext'

export default function App() {
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <CartContextProvider>
          <StatusBar barStyle={'dark-content'} />
          <AppNavigation />
        </CartContextProvider>
      </ThemeContextProvider>
    </AuthContextProvider>
  )
}
