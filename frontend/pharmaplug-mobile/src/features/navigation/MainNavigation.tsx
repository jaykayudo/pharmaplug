import { useContext } from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons'
import { SvgXml } from 'react-native-svg'
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import HomeNavigator from './HomeNavigation'
import StoreNavigator from './StoreNavigation'
import CartNavigator from './CartNavigation'
import ConsultationNavigator from './ConsultationNavigation'
import AccountNavigator from './AccountNavigation'

// import { ThemeContext } from '../../context/themecontext'
import assets from '../../../assets';
const iconPattern = {
  Home: {
    focused: (size:number ,color:string) => (
        <Foundation name="home" size={size} color={color} />
    ),
    unfocused: (size:number , color:string) => (
        <Foundation name="home" size={size} color={color} />
    ),
  },
  DrugStore: {
    focused: (size:number, color:string ) => (
      <SvgXml
        xml={assets.drugIcon}
        width={size}
        height={size}
        color={color}
      />
    ),
    unfocused: (size:number, color:string ) => (
      <SvgXml xml={assets.drugIcon} width={size} height={size} color={color} />
    ),
  },
  Cart: {
    focused: (size:number, color:string) => (
        <Ionicons name="cart-outline" size={size} color={color} />
    ),
    unfocused: (size:number, color:string ) => (
        <Ionicons name="cart-outline" size={size} color={color} />
    ),
  },
  Consultation: {
    focused: (size:number, color:string) => (
        <FontAwesome5 name="plus" size={size} color={color} />
    ),
    unfocused: (size:number, color:string) => (
        <FontAwesome5 name="plus" size={size} color={color} />
    ),
  },
  Account: {
    focused: (size:number, color:string) => (
        <FontAwesome6 name="user" size={size} color={color} />
    ),
    unfocused: (size:number, color:string) => (
        <FontAwesome6 name="user" size={size} color={color} />
    ),
  },
}
const allPath = ['Home', 'DrugStore', 'Cart', 'Consultation', 'Account']

const Tab = createBottomTabNavigator()
const MainNavigator = () => {
  const MyTheme = {
    ...DefaultTheme,
  }
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon
            if (allPath.includes(route.name))
              icon = focused
                ? iconPattern[`${route.name}`].focused(size, color)
                : iconPattern[`${route.name}`].unfocused(size, color)
            return icon
          },
          tabBarInactiveTintColor: '#555555',
          tabBarActiveTintColor: '#145B7A',
          headerShown: false,
          tabBarStyle: {
            height: 60,
          },
          tabBarItemStyle: {
            color: '#555555',
            marginBottom: 10,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeNavigator} />
        <Tab.Screen name="DrugStore" component={StoreNavigator} />
        <Tab.Screen name="Cart" component={CartNavigator} />
        <Tab.Screen name="Consultation" component={ConsultationNavigator} />
        <Tab.Screen name="Account" component={AccountNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
