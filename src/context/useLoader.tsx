import { useContext } from "react"
import { Context } from "./LoaderContext"

export const useLoader = () => {
  const value = useContext(Context)
  if (!value) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return value
}
