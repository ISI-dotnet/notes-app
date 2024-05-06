import { usePushNotification } from "@/src/hooks/usePushNotifications"
import { useRouter } from "expo-router"
import * as Notifications from "expo-notifications"
import { Button, Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const FavoritesScreen = () => {
  const { expoPushToken, notification } = usePushNotification()
  return (
    <SafeAreaView>
      <Text>Favorites</Text>
      <TouchableOpacity
        className={`mt-4 bg-orange-400 h-12 rounded-md justify-center items-center shadow-sm shadow-black`}
        onPress={async () => {
          await schedulePushNotification()
        }}
      >
        <Text className="text-base font- text-white uppercase">
          Start notification
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  })
}

export default FavoritesScreen
