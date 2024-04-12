import { db } from "@/firebaseConfig"
import { NoteFolder } from "@/src/types/NoteFolder"
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"

export const getFoldersByFolderId = async (
  userId: string,
  parentFolderId: string
) => {
  const foldersRef = collection(db, "folders")
  const q = query(
    foldersRef,
    where("userId", "==", userId),
    where("parentFolderId", "==", parentFolderId)
  )

  return getDocs(q)
    .then((querySnapshot) => {
      const folders: NoteFolder[] = []
      querySnapshot.forEach((doc) => {
        folders.push({ id: doc.id, ...doc.data() } as NoteFolder)
      })
      return folders
    })
    .catch((error) => {
      throw error
    })
}

export const subscribeToFoldersByFolderId = (
  userId: string,
  parentFolderId: string,
  existingFolders: NoteFolder[],
  callback: (folders: NoteFolder[]) => void
) => {
  const foldersRef = collection(db, "folders")
  const q = query(
    foldersRef,
    where("userId", "==", userId),
    where("parentFolderId", "==", parentFolderId)
  )

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const folder = { id: change.doc.id, ...change.doc.data() } as NoteFolder
      if (change.type === "added") {
        const existingFolderIndex = existingFolders.findIndex(
          (f) => f.id === folder.id
        )
        if (existingFolderIndex === -1) {
          // If not found, push the note to modifiedNotes array
          existingFolders.push(folder)
        }
      } else if (change.type === "modified") {
        // Find the index of the modified folder in modifiedFolders array
        const index = existingFolders.findIndex((f) => f.id === folder.id)
        // If found, replace the existing folder with the modified one
        if (index !== -1) {
          existingFolders[index] = folder
        }
      } else if (change.type === "removed") {
        // Filter out the removed folder from the modifiedFolders array
        existingFolders = existingFolders.filter((f) => f.id !== folder.id)
      }
    })
    callback(existingFolders)
  })
}

export const createFolder = async (
  folderDetails: Omit<NoteFolder, "id" | "dateCreated" | "dateModified">
) => {
  return addDoc(collection(db, "folders"), {
    ...folderDetails,
    dateCreated: serverTimestamp(),
    dateModified: serverTimestamp(),
  })
    .then((docRef) => docRef)
    .catch((error) => {
      throw error
    })
}
