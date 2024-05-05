import { Note } from "@/src/types/Note"
import { db } from "@/firebaseConfig"
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  onSnapshot,
  orderBy,
  limit,
  deleteDoc,
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
    .catch((error) => {
      throw error
    })
}

export const updateNote = async (noteDetails: Note) => {
  noteDetails.dateModified = new Date()

  return setDoc(doc(db, "notes", noteDetails.id), noteDetails, { merge: true })
    .then(() => "Note updated successfully")
    .catch((error) => {
      throw new Error("Error updating note: " + error.message)
    })
}

export const getNotesByFolderId = async (
  userId: string,
  parentFolderId: string
) => {
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
    .catch((error) => {
      throw error
    })
}

export const getNoteById = async (noteId: string) => {
  const notesRef = doc(db, "notes", noteId)

  return getDoc(notesRef)
    .then((noteDoc) => {
      if (!noteDoc.exists()) {
        throw new Error("Note not found")
      }
      return { id: noteId, ...noteDoc.data() } as Note
    })
    .catch((error) => {
      throw error
    })
}

export const subscribeToNotesByFolderId = (
  userId: string,
  parentFolderId: string,
  existingNotes: Note[],
  callback: (notes: Note[]) => void
) => {
  const notesRef = collection(db, "notes")
  const q = query(
    notesRef,
    where("userId", "==", userId),
    where("parentFolderId", "==", parentFolderId)
  )

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const note = { id: change.doc.id, ...change.doc.data() } as Note
      if (change.type === "added") {
        const existingNoteIndex = existingNotes.findIndex(
          (n) => n.id === note.id
        )
        if (existingNoteIndex === -1) {
          // If not found, push the note to modifiedNotes array
          existingNotes.push(note)
        }
      } else if (change.type === "modified") {
        // Find the index of the modified note in modifiedNotes array
        const index = existingNotes.findIndex((n) => n.id === note.id)
        // If found, replace the existing note with the modified one

        if (index !== -1) {
          existingNotes[index] = note
        }
      } else if (change.type === "removed") {
        // Filter out the removed note from the modifiedNotes array
        existingNotes = existingNotes.filter((n) => n.id !== note.id)
      }
    })

    callback(existingNotes)
  })
}

export const subscribeToRecentNotes = (
  userId: string,
  callback: (notes: Note[]) => void
) => {
  const notesRef = collection(db, "notes")
  const q = query(
    notesRef,
    where("userId", "==", userId),
    orderBy("dateModified", "desc"),
    limit(5)
  )

  return onSnapshot(q, (snapshot) => {
    const recentNotes: Note[] = []
    snapshot.forEach((doc) => {
      const note = { id: doc.id, ...doc.data() } as Note
      recentNotes.push(note)
    })

    callback(recentNotes)
  })
}

export const deleteNote = async (noteId: string) => {
  const noteRef = doc(db, "notes", noteId)

  return deleteDoc(noteRef)
    .then(() => "Note deleted successfully")
    .catch((error) => {
      throw new Error("Error deleting note: " + error.message)
    })
}

export const deleteNoteByParentFolderId = (parentFolderId: string) => {
  const notesQuery = query(collection(db, "notes"), where("parentFolderId", "==", parentFolderId));

  return getDocs(notesQuery)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref)
          .catch((error) => {
            throw new Error("Error deleting notes: " + error.message);
          });
      });

      return "Notes deleted successfully";
    })
    .catch((error) => {
      throw new Error("Error fetching notes: " + error.message);
    });
};

