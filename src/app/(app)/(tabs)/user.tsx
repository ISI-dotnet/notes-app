import { auth } from "@/firebaseConfig"
import { useSession } from "@/src/context/useSession"
import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import { toastFirebaseErrors } from "@/src/utils/toastFirebaseErrors"
import { showToast } from "@/src/utils/showToast"
import { UNKNOWN_ERROR_MESSAGE } from "@/src/constants/ErrorMessages"

const UserPage = () => {
  const { signOut } = useSession()

  const user = auth.currentUser

  const handleLogOut = async () => {
    await signOut()
      .then(() =>
        showToast("success", "You are now logged out!", undefined, 4000)
      )
      .catch((error) => {
        if (error.message) {
          toastFirebaseErrors(error.message)
        } else {
          showToast("error", UNKNOWN_ERROR_MESSAGE)
        }
      })
  }

  return (
    <SafeAreaView className="flex-1 px-16">
      <View className="items-center">
        <MaterialIcons name="account-circle" size={100} color="grey" />
      </View>
      <Text className="mb-10 mt-2 text-center font-semibold text-lg">
        {user?.email}
      </Text>
      <TouchableOpacity
        onPress={handleLogOut}
        className="bg-red-500 h-12 rounded-md justify-center items-center shadow-sm shadow-black"
      >
        <Text className="text-base text-white uppercase">logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default UserPage
