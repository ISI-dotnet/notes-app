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
  const [isNewFolderModalVisible, setIsNewFolderModalVisible] = useState(false)
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
      if (newFolderTitle === "") {
        throw new Error("Add folder name")
      }
      await createFolder({
        title: newFolderTitle,
        parentFolderName: currentFolderName,
        parentFolderId: currentFolderId.toString(),
        userId: session!,
      })
      setNewFolderTitle("")
      setIsNewFolderModalVisible(false)
    } catch (error) {
      throw new Error("Error creating folder")
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: currentFolderId === "home" ? "Home" : currentFolderName,
          headerStyle: {
            backgroundColor: "orange",
          },
          headerLeft: () =>
            currentFolderId !== "home" ? (
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
                onPress={() => setIsNewFolderModalVisible(true)}
              />
            </View>
          ),
        }}
      />
      <FileList />
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
          <View style={styles.buttonContainer}>
            <Button
              title="Create Folder"
              onPress={handleCreateNewFolder}
              color="orange" // Set button color to orange
            />
            <Button
              title="Cancel"
              onPress={() => setIsNewFolderModalVisible(false)}
              color="#555" // Set button color to gray
            />
          </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
})

export default BrowseScreen
