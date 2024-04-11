import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native"
import { NoteFolder } from "@/src/types/NoteFolder"
import { getFolders } from "@/src/api/note/folder"
import { useSession } from "@/src/context/useSession"

type FolderPickerModalProps = {
  onSelectFolder: (folderId: string, folderTitle: string) => void
  onClose: () => void
}

const FolderPickerModal = ({
  onSelectFolder,
  onClose,
}: FolderPickerModalProps) => {
  const [folders, setFolders] = useState<NoteFolder[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string>("home") // Hardcoded to 'home'
  const [currentFolderTitle, setCurrentFolderTitle] = useState<string>("Home") // Hardcoded to 'Home'
  const [previousFoldersId, setPreviousFoldersId] = useState<string[]>([])
  const [previousFoldersTitles, setPreviousFoldersTitle] = useState<string[]>(
    []
  )
  const { session } = useSession()

  useEffect(() => {
    fetchFolders(currentFolderId)
  }, [])

  const fetchFolders = async (folderId: string) => {
    try {
      const fetchedFolders = await getFolders(session!, folderId)
      setFolders(fetchedFolders)
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const handleFolderPress = async (folderId: string, folderTitle: string) => {
    try {
      setPreviousFoldersId((prev) => [...prev, currentFolderId])
      setPreviousFoldersTitle((prev) => [...prev, currentFolderTitle])
      setCurrentFolderId(folderId)
      setCurrentFolderTitle(folderTitle)
      const fetchedFolders = await getFolders(session!, folderId)
      setFolders(fetchedFolders)
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const handleBackPress = () => {
    const lastFolderId = previousFoldersId.pop()
    const lastFolderTitle = previousFoldersTitles.pop()
    fetchFolders(lastFolderId || "home")
    setCurrentFolderId(lastFolderId || "home")
    setCurrentFolderTitle(lastFolderTitle || "Home")
  }

  const handleSelect = () => {
    onSelectFolder(currentFolderId, currentFolderTitle)
    onClose()
  }

  const renderItem = ({ item }: { item: NoteFolder }) => (
    <TouchableOpacity
      style={styles.folderItem}
      onPress={() => handleFolderPress(item.id, item.title)}
    >
      <Text style={styles.folderTitle}>{item.title}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {currentFolderId !== "home" && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity onPress={handleSelect} style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onClose()
          setPreviousFoldersId([])
          setPreviousFoldersTitle([])
        }}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 50,
  },
  folderItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  folderTitle: {
    fontSize: 18,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "blue",
  },
  selectButton: {
    backgroundColor: "blue",
    alignItems: "center",
    paddingVertical: 15,
  },
  selectButtonText: {
    fontSize: 18,
    color: "white",
  },
  closeButton: {
    alignItems: "center",
    padding: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: "blue",
  },
})

export default FolderPickerModal
