import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "@firebase/auth"
import { auth } from "@/firebaseConfig"
import { useRouter } from "expo-router"
import { PropsWithChildren, createContext } from "react"
import { useStorageState } from "../hooks/useStorageState"

export const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  session?: string | null
  isLoading: boolean
}>({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  session: null,
  isLoading: false,
})

// This hook can be used to access the user info.

export function SessionProvider(props: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session")
  const router = useRouter()

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      if (auth.currentUser) {
        setSession(auth.currentUser.uid)
      } else {
        throw new Error("Couldn't get user info, please try again.")
      }
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      if (session) {
        // If user is already authenticated, log out
        await firebaseSignOut(auth)
        setSession(null)
        router.replace("/")
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ signIn, signUp, signOut, session, isLoading }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
