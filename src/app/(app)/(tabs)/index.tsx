import { COLORS } from "@/src/constants/Colors"
import { AntDesign } from "@expo/vector-icons"
import { Link } from "expo-router"
import { View, Text, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1">
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
