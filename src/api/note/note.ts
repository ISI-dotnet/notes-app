import { Note } from "@/src/types/Note"
import { auth, db } from "@/firebaseConfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

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
