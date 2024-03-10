import NoteItem from "@/src/components/fileList/NoteItem"
import { AntDesign, Feather } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { View, Text, FlatList } from "react-native"

const dummyNotesData = [
  {
    id: 1,
    title: "First note",
    description: "This is description",
    parentFolder: "home",
  },
  {
    id: 2,
    title: "Second note",
    description: "This is description",
    parentFolder: "home",
  },
  {
    id: 3,
    title: "Third note",
    description: "This is description",
    parentFolder: "home",
  },
  {
    id: 4,
    title: "Fourth note",
    description: "This is description",
    parentFolder: "home",
  },
  {
    id: 5,
    title: "Fifth note",
    description: "This is description",
    parentFolder: "home",
  },
]

const dummyFoldersData = [
  {
    id: 1,
    title: "First folder",
    parentFolder: "home",
  },
]

const BrowseScreen = () => {
  return (
    <View className="p-3 my-4">
      <Stack.Screen
        options={{
          title: "Browse",
          headerStyle: {
            backgroundColor: "orange",
          },
          headerRight: () => (
            <Feather
              name="folder-plus"
              size={24}
              color="black"
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      <FlatList
        data={dummyNotesData}
        renderItem={({ item }) => <NoteItem noteDetails={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )
}

export default BrowseScreen
