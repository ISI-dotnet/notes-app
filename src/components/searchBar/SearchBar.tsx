import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { Keyboard, TextInput, View } from "react-native"

type SearchBarProps = {
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
}

const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleBackArrowPress = () => {
    Keyboard.dismiss()
    setIsFocused(false)
  }

  return (
    <View className=" bg-gray-50 p-4 rounded-full flex-row items-center">
      {isFocused && (
        <AntDesign
          name="arrowleft"
          size={24}
          color="black"
          onPress={handleBackArrowPress}
        />
      )}
      <TextInput
        className="text-xl font-medium flex-1 ml-4 mr-2"
        placeholder="Start typing here..."
        maxLength={50}
        value={query}
        onChangeText={(value) => setQuery(value)}
        selectionColor={"orange"}
        multiline={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {query.length > 0 && (
        <MaterialIcons
          name="cancel"
          size={24}
          color="black"
          onPress={() => setQuery("")}
        />
      )}
    </View>
  )
}

export default SearchBar
