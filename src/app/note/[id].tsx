import { Stack, useLocalSearchParams } from "expo-router"
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
import { initialDummyNotesData } from "@/src/constants/DummyData"

const NotePage = () => {
  const { id } = useLocalSearchParams()
  const [noteDetails, setNoteDetails] = useState<Note>({
    id: 0,
    title: "",
    description: "",
    parentFolderName: "Home",
    parentFolderId: 0,
  })

  //TODO: change useEffect to fetch note details based on ID from DB
  useEffect(() => {
    if (id !== "0") {
      const note = initialDummyNotesData.find((note) => note.id === Number(id))
      if (!note) return
      setNoteDetails(note)
    }
  }, [])

  const richText = useRef<RichEditor | null>(null)
  const scrollRef = useRef<ScrollView | null>(null)

  const [isFocused, setIsFocused] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

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
          headerRight: () => <AntDesign name="check" size={24} color="black" />,
        }}
      />
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
            description={noteDetails.description}
            ref={richText}
            setIsFocused={setIsFocused}
            handleScroll={handleScroll}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      {/* Toolbar is only visible on note description and when the keyboard is open */}
      {isFocused && isKeyboardVisible && <Toolbar editor={richText} />}
    </View>
  )
}

export default NotePage
