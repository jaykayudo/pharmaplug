import { useState } from 'react'
import './App.css'
import Router from './navigations/router.js'
import AuthContextProvider from './context/authContext.js'
import CartContextProvider from './context/cartContext.js'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <>
      <CartContextProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <AuthContextProvider>
            <Router />
          </AuthContextProvider>
        </GoogleOAuthProvider>
      </CartContextProvider>
    </>
  )
}

export default App
