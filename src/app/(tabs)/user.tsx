import { auth } from "@/firebaseConfig"
import { signOut } from "@firebase/auth"
import { router } from "expo-router"
import { Button, Text, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Page = () => {
  const user = auth.currentUser
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log("User logged out successfully!")
        await signOut(auth)
        router.replace("/")
      }
    } catch (error) {
      console.error("Authentication error:", error.message)
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user?.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </SafeAreaView>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: "#3498db",
    textAlign: "center",
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
})
