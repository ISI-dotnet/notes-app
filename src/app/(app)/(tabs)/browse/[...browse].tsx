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
  const [isFolderPickerModalVisible, setIsFolderPickerModalVisible] =
    useState(false)
  const [isNewFolderModalVisible, setIsNewFolderModalVisible] = useState(false)
  const [newFolderTitle, setNewFolderTitle] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState("")
  const [selectedFolderTitle, setSelectedFolderTitle] = useState("")
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

  const handleSelectFolder = (folderId: string, folderTitle: string) => {
    setSelectedFolderId(folderId)
    setSelectedFolderTitle(folderTitle)
    console.log("Selected Folder ID:", folderId)
    console.log("Selected Folder Title:", folderTitle)
    setIsFolderPickerModalVisible(false)
    setIsNewFolderModalVisible(true)
  }

  const handleCreateNewFolder = async () => {
    try {
      await createFolder({
        title: newFolderTitle,
        parentFolderName: selectedFolderTitle,
        parentFolderId: selectedFolderId,
        userId: session!,
      })
      console.log("New Folder Name:", newFolderTitle)
      console.log("New Folder ID:", currentFolderId)
      setNewFolderTitle("") // Clear input field
      setIsNewFolderModalVisible(false) // Close modal after creating folder
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
                onPress={() => setIsFolderPickerModalVisible(true)}
              />
            </View>
          ),
        }}
      />
      <FileList />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFolderPickerModalVisible}
        onRequestClose={() => setIsFolderPickerModalVisible(false)}
      >
        <FolderPickerModal
          onSelectFolder={handleSelectFolder}
          onClose={() => setIsFolderPickerModalVisible(false)}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNewFolderModalVisible}
        onRequestClose={() => setIsNewFolderModalVisible(false)}
      >
        <View style={styles.newFolderModalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new folder title"
            value={newFolderTitle}
            onChangeText={setNewFolderTitle}
          />
          <Button
            title="Create Folder"
            onPress={handleCreateNewFolder}
            color="orange" // Set button color to orange
          />
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  newFolderModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  createButton: {
    backgroundColor: "orange",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default BrowseScreen
