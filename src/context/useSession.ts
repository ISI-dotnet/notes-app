import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"

export const useSession = () => {
  const value = useContext(AuthContext)
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />")
    }
  }

  return { ...value }
}
