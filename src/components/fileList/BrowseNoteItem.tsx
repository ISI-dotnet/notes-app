import { Text, TouchableOpacity, View } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Note } from "@/src/types/Note"
import { useRouter } from "expo-router"
import { memo, useState } from "react"
import { updateFavStatus } from "@/src/api/note/note"

type BrowseNoteItemProps = {
  noteDetails: Note
}

const BrowseNoteItem = ({ noteDetails }: BrowseNoteItemProps) => {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(noteDetails.isFavourite === "true")

  const handleNoteItemPress = () => {
    const id = noteDetails.id.toString()
    router.navigate(`/note/${id}`)
  }

  const handleLikeNote = async () => {
    try {
      setIsLiked(!isLiked)
      await updateFavStatus(noteDetails.id)
    } catch (error) {
      setIsLiked((prevIsLiked) => !prevIsLiked)
      console.error("Error updating favorite status:", error)
    }
  }

  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-lg my-1 px-2 h-20"
      onPress={handleNoteItemPress}
    >
      <View className="flex-row">
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
        <TouchableOpacity onPress={handleLikeNote}>
          <View className="flex items-center justify-center mt-2">
            <MaterialCommunityIcons
              name={isLiked ? "heart" : "heart-outline"}
              size={30}
              color={isLiked ? "red" : "gray"}
            />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default memo(BrowseNoteItem)
