import { useEffect, useState } from "react"
import { useSession } from "../context/useSession"
import { Note } from "../types/Note"
import { useLoader } from "../context/useLoader"
import { getAllNotes, subscribeToAllNotes } from "../api/note/note"

const useAllNotes = () => {
  const { session } = useSession()
  const [notesList, setNotesList] = useState<Note[]>([])
  const { setIsLoading } = useLoader()

  useEffect(() => {
    let initialNotes: Note[] = []
    const fetchData = async () => {
      setIsLoading(true)

      const notes = await getAllNotes(session!)
      initialNotes = notes
    }

    fetchData()
    const unsubscribeNotes = subscribeToAllNotes(
      session!,
      initialNotes,
      (modifiedNotes: Note[]) => {
        setNotesList(modifiedNotes)
      }
    )

    setIsLoading(false)

    return () => {
      unsubscribeNotes()
    }
  }, [session])

  return { notesList }
}

export default useAllNotes
