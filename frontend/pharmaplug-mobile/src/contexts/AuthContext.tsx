import axios, { AxiosError } from 'axios'
import React, { createContext, useEffect, useState, ReactNode } from 'react'
import { usePostAPI } from '../services/serviceHooks'
import { endpoints } from '../services/constants'
import { UserType } from '../../types'


type callbackType = () => void

export const AuthContext = createContext({
  isLoggedIn: false,
  loading: false,
  logUserIn: (user: UserType) => {},
  logUserOut: () => {},
  user: {},
  isExpired: () => {},
  refreshToken: () => {},
})
const AuthContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const logUserIn = (user: UserType) => {
    setUser(user)
    axios.defaults.headers.common.Authorization = `Bearer ${user.access}`
    setUserToLocalStorage(user)
    setIsLoggedIn(true)
  }
  const logUserOut = (callback: null | callbackType = null) => {
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
  const setUserToLocalStorage = (user: UserType) => {
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
  const refreshTokenCallback = (data: UserType) => {
    const newData = { ...user, ...data, expiry: Date.now() / 1000 }
    logUserIn(newData)
  }
  const refreshErrorCallback = (err: AxiosError ) => {
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
