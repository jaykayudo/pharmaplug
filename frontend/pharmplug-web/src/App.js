import { useState } from 'react'
import './App.css'
import Router from './navigations/router.js'
import AuthContextProvider from './context/authContext.js'
import CartContextProvider from './context/cartContext.js'

function App() {
  return (
    <>
      <CartContextProvider>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </CartContextProvider>
    </>
  )
}

export default App
