import { ReactNode, createContext, useState } from "react"

type LoaderContext = {
  loading: boolean
  setIsLoading: (loading: boolean) => void
}

export const Context = createContext<LoaderContext | null>(null)

type LoaderProviderProps = {
  children: ReactNode
}

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
  const [loading, setLoading] = useState(false)

  const setIsLoading = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  return (
    <Context.Provider value={{ loading, setIsLoading }}>
      {children}
    </Context.Provider>
  )
}
