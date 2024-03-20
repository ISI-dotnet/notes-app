import { Stack } from "expo-router"
import { AntDesign } from "@expo/vector-icons"
import React, { useEffect, useRef, useState } from "react"
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  Button,
} from "react-native"
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor"
import { COLORS } from "@/src/constants/Colors"
import { useTheme } from "@react-navigation/native"
import Toolbar from "@/src/components/note/Toolbar"
import RichTextEditor from "@/src/components/note/RichTextEditor"
import db from "@react-native-firebase/database"

const Note = () => {
  const richText = useRef<RichEditor | null>(null)
  const scrollRef = useRef<ScrollView | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
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

  const saveToDatabase = () => {
    // Assuming you have a 'notes' node in your database
    const newNoteRef = db().ref('notes').push();
    newNoteRef.set({
      title: title,
      description: description,
    }, (error) => {
      if (error) {
        console.error('Error saving data:', error);
      } else {
        console.log('Data saved successfully');
      }
    });
  };

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
            <Button
              onPress={saveToDatabase}
              title="Save"
            />
          ),
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
            value={title}
            onChangeText={(text) => setTitle(text)}
            selectionColor={"orange"}
            multiline={true}
          />

          <RichTextEditor
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

export default Note;
