import { usePushNotification } from "@/src/hooks/usePushNotifications"
import { useRouter } from "expo-router"
import * as Notifications from "expo-notifications"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useLoader } from "@/src/context/useLoader"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSession } from "@/src/context/useSession"
import { useEffect, useState } from "react"
import { Note } from "@/src/types/Note"
import { subscribeToFavouriteNotes } from "@/src/api/note/note"
import Loader from "@/src/components/Loader"
import NoteItem from "@/src/components/fileList/NoteItem"

const FavoritesScreen = () => {
  const { expoPushToken, notification } = usePushNotification()

  const { loading, setIsLoading } = useLoader()
  const { session } = useSession()
  const [favouriteNotes, setFavouriteNotes] = useState<Note[]>([])

  useEffect(() => {
    const unsubscribeFavouriteNotes = subscribeToFavouriteNotes(
      session!,
      (modifiedFavouriteNotes: Note[]) =>
        setFavouriteNotes(modifiedFavouriteNotes)
    )
    setIsLoading(false)

    return () => {
      unsubscribeFavouriteNotes()
    }
  }, [session])

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ padding: 12 }} className="mt-12">
        <Text className="text-3xl mb-4">Favourite Notes</Text>
        {loading ? (
          <Loader />
        ) : favouriteNotes.length > 0 ? (
          favouriteNotes.map((note) => (
            <NoteItem key={note.id} noteDetails={note} />
          ))
        ) : (
          <Text>You don't have any favourites yet</Text>
        )}
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
      </ScrollView>
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
