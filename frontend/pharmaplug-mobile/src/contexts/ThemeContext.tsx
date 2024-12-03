import React, { createContext, ReactNode, useState } from 'react'
import theme from '../infrastructure/styles'
import { ThemeType } from '../../types'

type ThemeContextProps = {
  theme: ThemeType
  currentMode: 'light' | 'dark'
  setCurrentMode: (v: 'light' | 'dark') => void
}

export const ThemeContext: React.Context<ThemeContextProps> = createContext({
  theme: theme,
  currentMode: 'light',
  setCurrentMode: (value: 'light' | 'dark') => {},
})

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light')
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
