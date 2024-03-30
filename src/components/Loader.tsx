import React from "react"
import { ActivityIndicator, View } from "react-native"

const Loader = () => {
  return (
    <View className="flex-1 justify-center">
      <ActivityIndicator size={70} color="orange" />
    </View>
  )
}

export default Loader
