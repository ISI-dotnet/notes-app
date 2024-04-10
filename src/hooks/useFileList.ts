import { useState, useEffect } from "react"

import { useSession } from "@/src/context/useSession"
import { toastFirebaseErrors } from "@/src/utils/toastFirebaseErrors"
import { showToast } from "@/src/utils/showToast"
import { UNKNOWN_ERROR_MESSAGE } from "@/src/constants/ErrorMessages"
import { Note } from "@/src/types/Note"
import { NoteFolder } from "@/src/types/NoteFolder"
import { useLoader } from "@/src/context/useLoader"
import {
  getNotesByFolderId,
  subscribeToNotesByFolderId,
} from "@/src/api/note/note"
import {
  getFoldersByFolderId,
  subscribeToFoldersByFolderId,
} from "@/src/api/note/folder"

const useFileList = (currentFolderId: string) => {
  const { session } = useSession()
  const [notesList, setNotesList] = useState<Note[]>([])
  const [foldersList, setFoldersList] = useState<NoteFolder[]>([])
  const { setIsLoading } = useLoader()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      const [initialNotes, initialFolders] = await Promise.all([
        getNotesByFolderId(session!, currentFolderId),
        getFoldersByFolderId(session!, currentFolderId),
      ])

      setFoldersList(initialFolders)
      setNotesList(initialNotes)
    }

    fetchData()
    const unsubscribeNotes = subscribeToNotesByFolderId(
      session!,
      currentFolderId,
      notesList,
      (modifiedNotes: Note[]) => {
        setNotesList(modifiedNotes)
      }
    )

    const unsubscribeFolders = subscribeToFoldersByFolderId(
      session!,
      currentFolderId,
      foldersList,
      (modifiedFolders: NoteFolder[]) => setFoldersList(modifiedFolders)
    )

    setIsLoading(false)

    return () => {
      unsubscribeNotes()

      unsubscribeFolders()
    }
  }, [currentFolderId, session])

  return { notesList, foldersList }
}

export default useFileList
