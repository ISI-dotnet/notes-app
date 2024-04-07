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
import { useLocalSearchParams } from "expo-router"

type FolderPickerModalProps = {
  onSelectFolder: (folderId: string, folderTitle: string) => void
  onClose: () => void
}

const FolderPickerModal = ({
  onSelectFolder,
  onClose,
}: FolderPickerModalProps) => {
  const [folders, setFolders] = useState<NoteFolder[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [currentFolderTitle, setCurrentFolderTitle] = useState<string | null>(
    null
  )
  const [previousFolders, setPreviousFolders] = useState<string[]>([]) // List of previous folder titles
  const { session } = useSession()
  const { currentFolderId: initialFolderId, browse } = useLocalSearchParams() // Initial folder ID
  const initialFolderName = browse.at(-1)

  useEffect(() => {
    fetchFolders(initialFolderId as string) // Fetch folders using initial folder ID
  }, [])

  const fetchFolders = async (folderId: string | null) => {
    try {
      if (!folderId) {
        return
      }

      const fetchedFolders = await getFolders(session!, folderId)
      setFolders(fetchedFolders)
      setCurrentFolderId(folderId)
      setCurrentFolderTitle(initialFolderName as string)
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const handleFolderPress = async (folderId: string, folderTitle: string) => {
    try {
      setCurrentFolderId(folderId)
      setCurrentFolderTitle(folderTitle)
      const fetchedFolders = await getFolders(session!, folderId) // Fetch contents of selected folder
      setFolders(fetchedFolders)
      // Add current folder id to the previous folders list
      setPreviousFolders((prev) => [
        ...prev,
        currentFolderId || (initialFolderId as string),
      ])
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const handleBackPress = () => {
    console.log(previousFolders)
    const lastFolder = previousFolders.pop()
    fetchFolders(lastFolder as string)
  }

  const handleSelect = () => {
    onSelectFolder(currentFolderId as string, currentFolderTitle as string)
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
      {currentFolderId && (
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
          setPreviousFolders([])
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
