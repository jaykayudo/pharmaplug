import React, { createContext, ReactNode, useState } from 'react'
import theme from '../infrastructure/styles'

export const ThemeContext = createContext({
  theme: theme,
  currentMode: "light",
  setCurrentMode: (value: string) => {}
})

export const ThemeContextProvider:React.FC<{children: ReactNode}>  = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<string>('light')
  return (
    <ThemeContext.Provider
      value={{
        currentMode,
        theme: theme,
        setCurrentMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
