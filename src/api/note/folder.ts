import { db } from "@/firebaseConfig"
import { NoteFolder } from "@/src/types/NoteFolder"
import { collection, getDocs, query, where } from "firebase/firestore"

export const getFolders = async (userId: string, parentFolderId: string) => {
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
