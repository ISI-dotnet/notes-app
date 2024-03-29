import { useContext } from "react"
import { LoaderContext } from "./LoaderContext"

export const useLoader = () => {
  const value = useContext(LoaderContext)
  if (!value) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return value
}
