import { COLORS } from "@/src/constants/Colors"
import { NoteFolder } from "@/src/types/NoteFolder"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { Href, usePathname, useRouter } from "expo-router"
import React, { memo, useState } from "react"
import { Text, TouchableOpacity, View, Alert } from "react-native"

type FolderItemProps = {
  folderDetails: NoteFolder
}

const FolderItem = ({ folderDetails }: FolderItemProps) => {
  const router = useRouter()
  const path = usePathname()
  const [showDeleteOption, setShowDeleteOption] = useState(false)

  const handleFolderItemPress = () => {
    router.push({
      pathname: `${path}/${folderDetails.title}` as Href<string>,
      params: {
        currentFolderId: folderDetails.id,
        previousFolderId: folderDetails.parentFolderId,
      },
    })
  }

  const handleLongPress = () => {
    setShowDeleteOption(true)
  }

  const handleDeleteFolder = () => {
    setShowDeleteOption(false)
    // Implement folder deletion logic here
    Alert.alert(
      "Delete Folder",
      "Are you sure you want to delete this folder?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            console.log("Deleted")
          },
          style: "destructive",
        },
      ]
    )
  }

  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-lg my-1 px-2 py-3"
      onPress={handleFolderItemPress}
      onLongPress={handleLongPress}
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
      <View style={{ flex: 1 }} />
      {showDeleteOption ? (
        <TouchableOpacity onPress={handleDeleteFolder}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      ) : (
        <View>
          <MaterialIcons name="arrow-forward-ios" size={18} color="lightgray" />
        </View>
      )}
    </TouchableOpacity>
  )
}

export default memo(FolderItem)
