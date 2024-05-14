import NoteItem from "@/src/components/fileList/NoteItem"
import SearchBar from "@/src/components/searchBar/SearchBar"
import useAllNotes from "@/src/hooks/useAllNotes"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useMemo, useState } from "react"
import { FlatList, Text, View } from "react-native"

const SearchScreen = () => {
  const [query, setQuery] = useState<string>("")
  const { notesList } = useAllNotes()

  const filteredNotes = useMemo(() => {
    return notesList
      .filter((note) => note.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [notesList, query])

  const sortedNotes = useMemo(() => {
    return filteredNotes.sort((a, b) => a.title.localeCompare(b.title))
  }, [filteredNotes])

  return (
    <View className="flex-1">
      <View className="mt-4 mx-2">
        <SearchBar query={query} setQuery={setQuery} />
      </View>
      {filteredNotes.length > 0 && query.length > 0 ? (
        <FlatList
          className="p-3"
          contentContainerStyle={{ paddingBottom: 20 }}
          data={sortedNotes}
          renderItem={({ item }) => <NoteItem noteDetails={item} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        query.length > 0 && (
          <View className="flex-1 items-center justify-center">
            <MaterialCommunityIcons
              name="note-off-outline"
              size={100}
              color="lightgray"
            />
            <Text className="text-3xl text-gray-500 mt-6 font-light">
              No matches
            </Text>
          </View>
        )
      )}
    </View>
  )
}

export default SearchScreen
