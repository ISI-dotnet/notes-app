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
    const fetchDataAndSubscribe = async () => {
      try {
        setIsLoading(true)

        const [initialNotes, initialFolders] = await Promise.all([
          getNotesByFolderId(session!, currentFolderId),
          getFoldersByFolderId(session!, currentFolderId),
        ])

        setFoldersList(initialFolders)
        setNotesList(initialNotes)

        const unsubscribeNotes = subscribeToNotesByFolderId(
          session!,
          currentFolderId,
          initialNotes,
          (modifiedNotes: Note[]) => {
            setNotesList(modifiedNotes)
          }
        )

        const unsubscribeFolders = subscribeToFoldersByFolderId(
          session!,
          currentFolderId,
          initialFolders,
          (modifiedFolders: NoteFolder[]) => setFoldersList(modifiedFolders)
        )

        setIsLoading(false)

        return () => {
          unsubscribeNotes()
          unsubscribeFolders()
        }
      } catch (error: any) {
        if (error.message) {
          toastFirebaseErrors(error.message)
        } else {
          showToast("error", UNKNOWN_ERROR_MESSAGE)
        }
        setIsLoading(false)
      }
    }

    fetchDataAndSubscribe()
  }, [currentFolderId, session])

  return { notesList, foldersList }
}

export default useFileList
