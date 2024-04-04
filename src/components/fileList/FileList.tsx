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
import { useLoader } from "@/src/context/useLoader"
import Loader from "../Loader"
import { useSession } from "@/src/context/useSession"
import { showToast } from "@/src/utils/showToast"
import { toastFirebaseErrors } from "@/src/utils/toastFirebaseErrors"
import { UNKNOWN_ERROR_MESSAGE } from "@/src/constants/ErrorMessages"

const FileList = () => {
  const { currentFolderId } = useLocalSearchParams()
  const { loading, setIsLoading } = useLoader()

  const [fileList, setFileList] = useState<(Note | NoteFolder)[]>([])
  const { session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Fetch notes and folders concurrently
        const [notesArr, foldersArr] = await Promise.all([
          getNotes(session!, currentFolderId as string),
          getFolders(session!, currentFolderId as string),
        ])

        // Update fileList state after both promises have resolved
        setFileList([...foldersArr, ...notesArr])
      } catch (error: any) {
        if (error.message) {
          toastFirebaseErrors(error.message)
        } else {
          showToast("error", UNKNOWN_ERROR_MESSAGE)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentFolderId])
  return loading ? (
    <Loader />
  ) : fileList.length > 0 ? (
    <FlatList
      className="p-3"
      contentContainerStyle={{ paddingBottom: 20 }}
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
