import React, { useState } from "react"
import { Feather } from "@expo/vector-icons"
import {
  Href,
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router"
import {
  SafeAreaView,
  TextInput,
  Button,
  Modal,
  View,
  StyleSheet,
} from "react-native"
import FileList from "@/src/components/fileList/FileList"
import { createFolder } from "@/src/api/note/folder"
import { useSession } from "@/src/context/useSession"
import FolderPickerModal from "@/src/components/modals/FolderPickerModal"

const BrowseScreen = () => {
  const { browse, previousFolderId, currentFolderId } = useLocalSearchParams()
  const { session } = useSession()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newFolderTitle, setNewFolderTitle] = useState("")
  const path = usePathname()
  const router = useRouter()
  const currentFolderName = browse[browse.length - 1]

  const handleNavigateBackFolder = () => {
    const pathArr = path.split("/")
    pathArr.pop()
    const previousPath = pathArr.join("/")
    router.push({
      pathname: previousPath as Href<string>,
      params: {
        currentFolderId: previousFolderId,
      },
    })
  }

  const [selectedFolderId, setSelectedFolderId] = useState("")
  const [selectedFolderTitle, setSelectedFolderTitle] = useState("")

  const handleSelectFolder = (folderId: string, folderTitle: string) => {
    setSelectedFolderId(folderId)
    setSelectedFolderTitle(folderTitle)
    console.log("Selected Folder ID:", folderId)
    console.log("Selected Folder Title:", folderTitle)
  }

  const handleCreateNewFolder = async () => {
    try {
      await createFolder({
        title: newFolderTitle,
        parentFolderName: currentFolderName,
        parentFolderId: currentFolderId.toString(),
        userId: session!,
      })
      console.log("New Folder Name:", newFolderTitle)
      console.log("New Folder ID:", currentFolderId)
      setNewFolderTitle("") // Clear input field
      setIsModalVisible(false) // Close modal after creating folder
    } catch (error) {
      console.error("Error creating folder:", error)
      // Handle error appropriately, e.g., show error message to the user
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: currentFolderName,
          headerStyle: {
            backgroundColor: "orange",
          },
          headerLeft: () =>
            previousFolderId !== "" ? (
              <Feather
                style={{ paddingLeft: 16 }}
                name="arrow-left"
                size={24}
                color="black"
                onPress={handleNavigateBackFolder}
              />
            ) : null,
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <Feather
                name="folder-plus"
                size={24}
                color="black"
                style={{ marginRight: 16 }}
                onPress={() => setIsModalVisible(true)}
              />
            </View>
          ),
        }}
      />
      <FileList />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <FolderPickerModal
          onSelectFolder={handleSelectFolder}
          onClose={() => setIsModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export default BrowseScreen
