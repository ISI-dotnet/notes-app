import { Stack, useLocalSearchParams, router } from "expo-router"
import { AntDesign } from "@expo/vector-icons"
import React, { useEffect, useRef, useState } from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native"
import { RichEditor } from "react-native-pell-rich-editor"
import Toolbar from "@/src/components/note/Toolbar"
import RichTextEditor from "@/src/components/note/RichTextEditor"
import { Note } from "@/src/types/Note"
import { auth } from "@/firebaseConfig"
import { createNote, getNoteById, updateNote } from "@/src/api/note/note"
import { useLoader } from "@/src/context/useLoader"
import Loader from "@/src/components/Loader"
import { useSession } from "@/src/context/useSession"

const NotePage = () => {
  const { id }: { id: string } = useLocalSearchParams()
  const { loading, setIsLoading } = useLoader()
  const { session } = useSession()
  const [noteDetails, setNoteDetails] = useState<Omit<Note, "id"> | Note>({
    userId: session!,
    title: "",
    description: "",
    parentFolderName: "Home",
    parentFolderId: "home",
  })

  const richText = useRef<RichEditor | null>(null)
  const scrollRef = useRef<ScrollView | null>(null)

  const [isFocused, setIsFocused] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // TODO: handle errors with toast, modal or smth
  const handleSubmit = () => {
    if (id !== "0") {
      const updatedNote = { id: id, ...noteDetails }
      updateNote(updatedNote)
        .then(() => router.back())
        .catch((error) => console.log(error))
    } else {
      createNote(noteDetails)
        .then(() => router.back())
        .catch((error) => console.log(error))
    }
  }

  useEffect(() => {
    const getNoteDetails = async () => {
      if (id !== "0") {
        setIsLoading(true)
        const note = await getNoteById(id)
        setNoteDetails(note)
        setTimeout(() => {}, 500)
        setIsLoading(false)
      }
    }

    getNoteDetails()
  }, [])

  // effect used for showing and hiding note styling toolbar based on keyboard visibility on screen
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true)
      }
    )

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false)
      }
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  // When note is long enough not not fit in screen, scroll the note by 30px when entering new line
  const handleScroll = (scrollY: number) => {
    // Only trigger scrolling if the RichEditor is focused
    if (isFocused && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: scrollY - 30,
        animated: true,
      })
    }
  }
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "orange",
          },
          headerRight: () => (
            <AntDesign
              name="check"
              size={24}
              color="black"
              onPress={handleSubmit}
            />
          ),
        }}
      />
      {loading ? (
        <Loader />
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="always"
          className="flex-1"
          ref={scrollRef}
          nestedScrollEnabled={true}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TextInput
              className="text-2xl p-4 font-medium"
              placeholder="Title"
              maxLength={200}
              value={noteDetails.title}
              onChangeText={(text) =>
                setNoteDetails((oldValue) => ({ ...oldValue, title: text }))
              }
              selectionColor={"orange"}
              multiline={true}
            />

            <RichTextEditor
              handleChange={(descriptionText) =>
                setNoteDetails((oldValue) => ({
                  ...oldValue,
                  description: descriptionText,
                }))
              }
              ref={richText}
              setIsFocused={setIsFocused}
              handleScroll={handleScroll}
              noteDescription={noteDetails.description}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      )}

      {/* Toolbar is only visible on note description and when the keyboard is open */}
      {isFocused && isKeyboardVisible && <Toolbar editor={richText} />}
    </View>
  )
}

export default NotePage