import {
  ScrollView,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native"
import { useSession } from "../context/useSession"
import { useState } from "react"
import { useRouter } from "expo-router"
import { showToast } from "../utils/showToast"
import { auth } from "@/firebaseConfig"
import { toastFirebaseErrors } from "../utils/toastFirebaseErrors"
import { UNKNOWN_ERROR_MESSAGE } from "../constants/ErrorMessages"
import { COLORS } from "../constants/Colors"
import { SafeAreaView } from "react-native-safe-area-context"
import { SimpleLineIcons } from "@expo/vector-icons"

const SignInPage = () => {
  const { signIn, signUp } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)

  const handleInputType = () => {
    setIsLogin(!isLogin)
    setEmail("")
    setPassword("")
  }

  const handleAuthentication = async () => {
    if (isLogin) {
      // Sign in
      await signIn(email, password)
        .then(() => {
          router.navigate("/(tabs)/")
          showToast(
            "success",
            `Welcome back, ${auth.currentUser?.email} 👋`,
            undefined,
            4000
          )
        })
        .catch((error) => {
          if (error.message) {
            toastFirebaseErrors(error.message)
          } else {
            showToast("error", UNKNOWN_ERROR_MESSAGE)
          }
        })
    } else {
      // Sign up
      await signUp(email, password)
        .then((event) => {
          showToast(
            "success",
            "User created successfully! You can click SIGN IN."
          )
          setIsLogin(true)
        })
        .catch((error) => {
          if (error.message) {
            toastFirebaseErrors(error.message)
          } else {
            showToast("error", UNKNOWN_ERROR_MESSAGE)
          }
        })
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center mb-10">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingLeft: 64,
          paddingRight: 64,
        }}
      >
        <View className="items-center mb-10">
          <SimpleLineIcons name="note" size={80} color={COLORS.darkOrange} />
        </View>

        <Text className="mb-8 text-2xl text-center font-medium">
          {isLogin ? "Welcome back." : "Sign Up"}
        </Text>
        <TextInput
          className="h-12 border border-gray-300 mb-4 px-2 rounded-md"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          className="h-12 border border-gray-300 mb-4 px-2 rounded-md"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity
          className={`mt-4 bg-orange-400 ${
            email === "" || password === "" ? "opacity-70" : ""
          } h-12 rounded-md justify-center items-center shadow-sm shadow-black`}
          disabled={email === "" || password === ""}
          onPress={handleAuthentication}
        >
          <Text className="text-base font- text-white uppercase">
            {isLogin ? "Sign In" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View className="mt-4">
          <Text className="text-center">
            {isLogin ? "Need an account? " : "Already have an account? "}
            <Text
              className="underline text-orange-500"
              onPress={handleInputType}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignInPage
