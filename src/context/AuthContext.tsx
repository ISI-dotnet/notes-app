import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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
      setSession(auth.currentUser ? auth.currentUser.uid : null)
    } catch (error) {
      console.error("Sign-in error:", error.message)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      console.log("User created successfully!")
    } catch (error) {
      console.error("Sign-in error:", error.message)
    }
  }

  const signOut = async () => {
    try {
      if (session) {
        // If user is already authenticated, log out
        await firebaseSignOut(auth)
        console.log("User logged out successfully!")
        setSession(null)
        router.replace("/")
      }
    } catch (error) {
      console.error("Authentication error:", error.message)
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
