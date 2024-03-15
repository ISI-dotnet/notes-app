import { COLORS } from "@/src/constants/Colors"
import { NoteFolder } from "@/src/types/NoteFolder"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import {
  Route,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"

type FolderItemProps = {
  folderDetails: NoteFolder
}

const FolderItem = ({ folderDetails }: FolderItemProps) => {
  const router = useRouter()
  const path = usePathname()
  const handleFolderItemPress = () => {
    router.push({
      pathname: `${path}/${folderDetails.title}` as any,
      params: {
        currentFolderId: folderDetails.id,
        previousFolderId: folderDetails.parentFolderId,
      },
    })
  }

  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-lg my-1 px-2 py-3"
      onPress={handleFolderItemPress}
    >
      <View className="h-full mr-3">
        <Feather name="folder" size={28} color={COLORS.darkOrange} />
      </View>
      <Text
        className={`text-gray-800 text-lg h-full font-semibold`}
        numberOfLines={1}
      >
        {folderDetails.title}
      </Text>
      <View className="ml-auto">
        <MaterialIcons name="arrow-forward-ios" size={18} color="lightgray" />
      </View>
    </TouchableOpacity>
  )
}

export default FolderItem
