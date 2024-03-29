import { ReactNode, createContext, useState } from "react"

type LoaderContext = {
  loading: boolean
  setIsLoading: (loading: boolean) => void
}

export const LoaderContext = createContext<LoaderContext | null>(null)

type LoaderProviderProps = {
  children: ReactNode
}

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
  const [loading, setLoading] = useState(false)

  const setIsLoading = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  return (
    <LoaderContext.Provider value={{ loading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  )
}
