import { COLORS } from "@/src/constants/Colors"
import { AntDesign } from "@expo/vector-icons"
import { Link } from "expo-router"
import { View, Text, Pressable } from "react-native"

const HomeScreen = () => {
  return (
    <View className="flex-1">
      <Text className="">Home Screen</Text>
      <Link href={"/note"} asChild>
        <Pressable
          android_ripple={{ color: "#FBFBFB", radius: 42 }}
          className="bg-white absolute bottom-28 right-6 rounded-md p-3 shadow-md"
        >
          <AntDesign
            name="plus"
            size={38}
            color={COLORS.darkOrange}
          ></AntDesign>
        </Pressable>
      </Link>
    </View>
  )
}

export default HomeScreen
