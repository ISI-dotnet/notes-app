import { useRouter } from "expo-router"
import { StyleSheet } from "react-native"

import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const FavoritesScreen = () => {
  const router = useRouter()

  return (
    <SafeAreaView>
      <Text>Favorites</Text>
    </SafeAreaView>
  )
}

export default FavoritesScreen
