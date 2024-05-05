import { db } from "@/firebaseConfig";
import { NoteFolder } from "@/src/types/NoteFolder";
import { deleteNoteByParentFolderId } from "@/src/api/note/note";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc // Import deleteDoc method
} from "firebase/firestore";

export const deleteFolderAndChildren = async (folderId: string) => {
  await deleteNoteByParentFolderId(folderId);
  const fetchedFolders = await getDocs(
    query(collection(db, "folders"), where("parentFolderId", "==", folderId))
  )
  for (const folder of fetchedFolders.docs) {
    await deleteFolderAndChildren(folder.id)
  }
  await deleteDoc(doc(collection(db, "folders"), folderId))
}

export const getFoldersByFolderId = async (
  userId: string,
  parentFolderId: string
) => {
  const q = query(
    collection(db, "folders"),
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
  const q = query(
    collection(db, "folders"),
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
