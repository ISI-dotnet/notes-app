import { auth } from "@/firebaseConfig"
import { getFolders } from "@/src/api/note/folder"
import { getNotes } from "@/src/api/note/note"
import { Note } from "@/src/types/Note"
import { NoteFolder } from "@/src/types/NoteFolder"
import { useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { FlatList } from "react-native"
import NoteItem from "./NoteItem"
import FolderItem from "./FolderItem"
import EmptyFolder from "./EmptyFolder"

const FileList = () => {
  const { currentFolderId } = useLocalSearchParams()
  const [fileList, setFileList] = useState<(Note | NoteFolder)[]>([])
  const user = auth.currentUser

  console.log(fileList)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch notes and folders concurrently
        const [notesArr, foldersArr] = await Promise.all([
          getNotes(user!.uid, currentFolderId as string),
          getFolders(user!.uid, currentFolderId as string),
        ])

        // Update fileList state after both promises have resolved
        setFileList([...foldersArr, ...notesArr])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [currentFolderId])
  return fileList.length > 0 ? (
    <FlatList
      className="px-3"
      contentContainerStyle={{ paddingVertical: 20 }}
      data={fileList}
      renderItem={({ item }) => {
        return "description" in item ? (
          <NoteItem noteDetails={item} />
        ) : (
          <FolderItem folderDetails={item} />
        )
      }}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <EmptyFolder />
  )
}

export default FileList
