import { Text, TouchableOpacity, View } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { Note } from "@/src/types/Note"
import { useRouter } from "expo-router"
type NoteItemProps = {
  noteDetails: Note
}

const NoteItem = ({ noteDetails }: NoteItemProps) => {
  const router = useRouter()

  const handleNoteItemPress = () => {
    const id = noteDetails.id.toString()
    router.navigate(`note/${id}`)
  }
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-lg my-1 px-2 py-3 h-20"
      onPress={handleNoteItemPress}
    >
      <View className="mr-3">
        <MaterialCommunityIcons
          name="note-text-outline"
          size={30}
          color="orange"
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-gray-800 font-semibold text-lg`}
          numberOfLines={1}
        >
          {noteDetails.title}
        </Text>
        <Text className={` text-gray-500 `} numberOfLines={2}>
          {noteDetails.description
            ? noteDetails.description
            : "Description empty"}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default NoteItem
