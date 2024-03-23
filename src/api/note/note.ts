import { Note } from "@/src/types/Note"
import { auth, db } from "@/firebaseConfig"
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore"

export const createNote = async (
  noteDetails: Omit<Note, "id" | "dateCreated" | "dateModified">
) => {
  return addDoc(collection(db, "notes"), {
    ...noteDetails,
    dateCreated: serverTimestamp(),
    dateModified: serverTimestamp(),
  })
    .then((docRef) => docRef)
    .catch((error) => error)
}

export const getNotes = async (userId: string, parentFolderId: string) => {
  const notesRef = collection(db, "notes")
  const q = query(
    notesRef,
    where("userId", "==", userId),
    where("parentFolderId", "==", parentFolderId)
  )

  return getDocs(q)
    .then((querySnapshot) => {
      const notes: Note[] = []
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() } as Note)
      })
      return notes
    })
    .catch((error) => error)
}
