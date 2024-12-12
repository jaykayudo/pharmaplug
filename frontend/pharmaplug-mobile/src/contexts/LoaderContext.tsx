import { createContext, ReactNode, useState } from 'react'
import Loader from '../components/loader'

export const LoaderContext = createContext({
  loading: false,
  setLoading: (val: boolean) => {},
})

type LoaderContextProviderProps = {
  children: ReactNode
}

export const LoaderContextProvider = ({
  children,
}: LoaderContextProviderProps) => {
  const [loading, setLoading] = useState(false)
  return (
    <LoaderContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {loading && <Loader />}
      {children}
    </LoaderContext.Provider>
  )
}
