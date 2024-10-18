import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { usePostAPI } from '../services/serviceHooks.js'
import { endpoints } from '../services/constants.js'

export const AuthContext = createContext({
  isLoggedIn: false,
  loading: false,
  logUserIn: (user) => {},
  logUserOut: () => {},
  user: {},
  isExpired: () => {},
  refreshToken: () => {},
})
const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const logUserIn = (user) => {
    setUser(user)
    axios.defaults.headers.common.Authorization = `Bearer ${user.access}`
    setUserToLocalStorage(user)
    setIsLoggedIn(true)
  }
  const logUserOut = (callback = null) => {
    setIsLoggedIn(false)
    setUser(null)
    axios.defaults.headers.common.Authorization = undefined
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    if (callback) {
      callback()
    }
  }
  const setUserFromLocalStorage = () => {
    const authToken = localStorage.getItem('authToken')
    const authUser = localStorage.getItem('authUser')
    if (authUser && authToken) {
      try {
        const user = JSON.parse(authUser)

        if (typeof user.expiry !== 'number') return
        const expiry = new Date(user.expiry * 1000)
        const now = new Date()
        if (expiry > now) {
          logUserIn(user)
        } else {
          refreshToken()
        }
      } catch (e) {}
    }
  }
  const setUserToLocalStorage = (user) => {
    localStorage.setItem('authToken', user.access)
    localStorage.setItem('authUser', JSON.stringify(user))
  }
  const isExpired = () => {
    if (!user) return
    if (user.expiry > Date.now() / 1000) return true
    return false
  }
  const refreshToken = () => {
    if (user) {
      refreshTokenAPI.sendRequest({
        refresh: user.refresh,
      })
    }
  }
  const refreshTokenCallback = (data) => {
    const newData = { ...user, ...data, expiry: Date.now() / 1000 }
    logUserIn(newData)
  }
  const refreshErrorCallback = (err) => {
    logUserOut()
  }
  const refreshTokenAPI = usePostAPI(
    endpoints.refreshToken,
    null,
    refreshTokenCallback,
    refreshErrorCallback,
  )

  useEffect(() => {
    setUserFromLocalStorage()
  }, [])
  return (
    <AuthContext.Provider
      value={{
        isExpired,
        isLoggedIn,
        loading,
        logUserIn,
        logUserOut,
        refreshToken,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
