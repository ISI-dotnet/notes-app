import { COLORS } from "@/src/constants/Colors"
import { NoteFolder } from "@/src/types/NoteFolder"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { Href, usePathname, useRouter } from "expo-router"
import React, { memo, useState } from "react"
import { Text, TouchableOpacity, View, Alert } from "react-native"
import { deleteFolderAndChildren } from "@/src/api/note/folder" // Import the deleteFolderAndChildren function

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

  const handleDeleteFolder = async () => {
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
          onPress: async () => {
            try {
              // Call the deleteFolderAndChildren function to delete the folder and its children
              await deleteFolderAndChildren(folderDetails.id)
              console.log("Folder and its children deleted successfully.")
            } catch (error) {
              console.error("Error deleting folder:", error)
            }
          },
          style: "destructive",
        },
      ]
    )
  }

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        marginVertical: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
      onPress={handleFolderItemPress}
      onLongPress={handleLongPress}
    >
      <View style={{ marginRight: 12 }}>
        <Feather name="folder" size={28} color={COLORS.darkOrange} />
      </View>
      <Text style={{ color: "gray", fontSize: 16 }} numberOfLines={1}>
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
