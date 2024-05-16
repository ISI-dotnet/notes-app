import { Note } from "@/src/types/Note"
import { NoteFolder } from "@/src/types/NoteFolder"
import { useLocalSearchParams } from "expo-router"
import React, { useMemo } from "react"
import { FlatList } from "react-native"
import BrowseNoteItem from "./BrowseNoteItem"
import FolderItem from "./FolderItem"
import EmptyFolder from "./EmptyFolder"
import { useLoader } from "@/src/context/useLoader"
import Loader from "@/src/components/Loader"
import useFileList from "@/src/hooks/useFileList"

const FileList = () => {
  const { currentFolderId } = useLocalSearchParams()
  const { loading } = useLoader()

  const { notesList, foldersList } = useFileList(currentFolderId as string)
  const fileList: (Note | NoteFolder)[] = [...notesList, ...foldersList]

  const sortedFileList = useMemo(() => {
    return fileList.slice().sort((a, b) => {
      // Check if 'a' is a folder (no description), if so, prioritize it
      if (!("description" in a)) {
        // Check if 'b' is also a folder
        if (!("description" in b)) {
          // Both are folders, sort alphabetically by title
          return a.title.localeCompare(b.title)
        } else {
          // 'a' is a folder, prioritize it
          return -1
        }
      }
      // Check if 'b' is a folder (no description), if so, prioritize it
      else if (!("description" in b)) {
        // 'b' is a folder, prioritize it
        return 1
      }
      // Both are notes, sort alphabetically by title
      else {
        return a.title.localeCompare(b.title)
      }
    })
  }, [fileList])

  return loading ? (
    <Loader />
  ) : sortedFileList.length > 0 ? (
    <FlatList
      className="p-3"
      contentContainerStyle={{ paddingBottom: 20 }}
      data={sortedFileList}
      renderItem={({ item }) => {
        return "description" in item ? (
          <BrowseNoteItem noteDetails={item} />
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
