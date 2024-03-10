import { Text, TouchableOpacity, View } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { Note } from "@/src/types/Note"
type NoteItemProps = {
  noteDetails: Note
}

const NoteItem = ({ noteDetails }: NoteItemProps) => {
  return (
    <TouchableOpacity className="flex-row items-center bg-white rounded-lg my-1 px-2 py-3">
      <View className="h-full mr-3">
        <MaterialCommunityIcons
          name="note-text-outline"
          size={30}
          color="orange"
        />
      </View>
      <Text className={`text-gray-800 text-lg h-full`}>
        {noteDetails.title}
      </Text>
    </TouchableOpacity>
  )
}

export default NoteItem
