// import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text } from 'react-native'
import AppNavigation from './src/features/navigation'
import { ThemeContextProvider } from './src/contexts/ThemeContext'

export default function App() {
  return (
  <ThemeContextProvider>
    <AppNavigation />  
  </ThemeContextProvider> 
)
}
