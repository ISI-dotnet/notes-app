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
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [currentFolderTitle, setCurrentFolderTitle] = useState<string | null>(
    null
  )
  const { session } = useSession()

  useEffect(() => {
    fetchFolders(currentFolderId)
  }, [currentFolderId])

  const fetchFolders = async (folderId: string | null) => {
    try {
      if (!folderId) {
        return
      }

      const fetchedFolders = await getFolders(session!, folderId)
      setFolders(fetchedFolders)
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const handleFolderPress = (folderId: string, folderTitle: string) => {
    setCurrentFolderId(folderId)
    setCurrentFolderTitle(folderTitle)
  }

  const handleBackPress = () => {
    if (currentFolderId) {
      fetchFolders(currentFolderId)
      setCurrentFolderId(null)
    }
  }

  const handleSelect = () => {
    if (currentFolderId && currentFolderTitle) {
      onSelectFolder(currentFolderId, currentFolderTitle)
      onClose()
    }
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
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
