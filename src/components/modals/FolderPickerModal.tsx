import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
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
  const [currentFolderId, setCurrentFolderId] = useState<string>("home")
  const [currentFolderTitle, setCurrentFolderTitle] = useState<string>("Home")
  const [previousFoldersId, setPreviousFoldersId] = useState<string[]>([])
  const [previousFoldersTitles, setPreviousFoldersTitles] = useState<string[]>(
    []
  )
  const [selected, setSelected] = useState<boolean>(false)
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
      setPreviousFoldersTitles((prev) => [...prev, currentFolderTitle])
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
    if (lastFolderId === undefined) {
      onClose()
      setPreviousFoldersId([])
      setPreviousFoldersTitles([])
    } else {
      fetchFolders(lastFolderId || "home")
      setCurrentFolderId(lastFolderId || "home")
      setCurrentFolderTitle(lastFolderTitle || "Home")
    }
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{currentFolderTitle}</Text>
        <TouchableOpacity
          onPress={() => handleSelect()}
          style={styles.checkButton}
        >
          <View style={{ left: 15 }}>
            <AntDesign name="check" size={24} />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    marginRight: 30,
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
    marginRight: 20,
  },
  checkButton: {
    marginLeft: "auto",
    marginRight: 10, // Add some margin to separate from the text
  },
  checkIconContainer: {
    marginRight: 10,
  },
})

export default FolderPickerModal
