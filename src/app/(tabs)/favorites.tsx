import { useRouter } from "expo-router"
import { StyleSheet } from "react-native"

import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const FavoritesScreen = () => {
  const router = useRouter()

  const handlePress = () => {
    router.navigate(`browse/home`)
  }
  return (
    <SafeAreaView>
      <Text onPress={handlePress}>Favorites</Text>
    </SafeAreaView>
  )
}

export default FavoritesScreen
