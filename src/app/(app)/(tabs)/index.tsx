import { subscribeToRecentNotes } from "@/src/api/note/note"
import Loader from "@/src/components/Loader"
import NoteItem from "@/src/components/fileList/NoteItem"
import { COLORS } from "@/src/constants/Colors"
import { UNKNOWN_ERROR_MESSAGE } from "@/src/constants/ErrorMessages"
import { useLoader } from "@/src/context/useLoader"
import { useSession } from "@/src/context/useSession"
import { Note } from "@/src/types/Note"
import { showToast } from "@/src/utils/showToast"
import { toastFirebaseErrors } from "@/src/utils/toastFirebaseErrors"
import { AntDesign } from "@expo/vector-icons"
import { Link } from "expo-router"
import { useEffect, useState } from "react"
import { Text, Pressable, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const HomeScreen = () => {
  const { loading, setIsLoading } = useLoader()
  const { session } = useSession()
  const [recentNotes, setRecentNotes] = useState<Note[]>([])

  useEffect(() => {
    const unsubscribeRecentNotes = subscribeToRecentNotes(
      session!,
      (modifiedRecentNotes: Note[]) => setRecentNotes(modifiedRecentNotes)
    )
    setIsLoading(false)

    return () => {
      unsubscribeRecentNotes()
    }
  }, [session])

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 12 }} className="mt-12">
        <Text className="text-3xl mb-4">Recently modified</Text>
        {loading ? (
          <Loader />
        ) : recentNotes.length > 0 ? (
          recentNotes.map((note) => (
            <NoteItem key={note.id} noteDetails={note} />
          ))
        ) : (
          <Text>You haven't modified any notes yet</Text>
        )}
      </ScrollView>
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
