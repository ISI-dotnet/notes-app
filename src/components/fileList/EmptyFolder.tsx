import React from "react"
import { Text, View } from "react-native"
import { FontAwesome6 } from "@expo/vector-icons"

const EmptyFolder = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <FontAwesome6 name="folder-open" size={100} color="lightgray" />
      <Text className="text-3xl text-gray-500 mt-6 font-light">
        Folder empty
      </Text>
    </View>
  )
}

export default EmptyFolder
