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

  const handleCreateNewFolder = async () => {
    try {
      await createFolder({
        title: newFolderTitle,
        parentFolderName: currentFolderName,
        parentFolderId: currentFolderId.toString(),
        userId: session!,
      })
      console.log(currentFolderId)
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
              <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TextInput
                      placeholder="Enter folder name"
                      value={newFolderTitle}
                      onChangeText={(text) => setNewFolderTitle(text)}
                      style={styles.input}
                    />
                    <Button title="Create" onPress={handleCreateNewFolder} />
                  </View>
                </View>
              </Modal>
            </View>
          ),
        }}
      />
      <FileList />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
})

export default BrowseScreen
