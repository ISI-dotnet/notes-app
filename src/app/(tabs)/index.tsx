import { auth } from "@/firebaseConfig"
import { COLORS } from "@/src/constants/Colors"
import { AntDesign } from "@expo/vector-icons"
import { Link } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, Pressable, SafeAreaView } from "react-native"

const HomeScreen = () => {
  const [username, setUsername] = useState("")

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser
      const username = await user?.getIdToken()
      setUsername(username!)
    }

    fetchUsername()
  }, [])

  if (username === "")
    return (
      <View>
        <Text>Hi</Text>
      </View>
    )

  return (
    <SafeAreaView className="flex-1">
      <Text>Welcome {username}</Text>
      <Text className="">Home Screen</Text>
      <Link href={"/note/0"} asChild>
        <Pressable
          android_ripple={{ color: "#FBFBFB", radius: 42 }}
          className="bg-white absolute bottom-12 right-6 rounded-md p-3 shadow-md"
        >
          <AntDesign
            name="plus"
            size={38}
            color={COLORS.darkOrange}
          ></AntDesign>
        </Pressable>
      </Link>
    </SafeAreaView>
  )
}

export default HomeScreen
