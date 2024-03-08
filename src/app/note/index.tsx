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
} from "react-native"
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor"
import { COLORS } from "@/src/constants/Colors"
import { useTheme } from "@react-navigation/native"
import Toolbar from "@/src/components/note/Toolbar"

const Note = () => {
  const { colors } = useTheme()
  const richText = useRef<RichEditor | null>(null)
  const scrollRef = useRef<ScrollView | null>(null)

  const [title, setTitle] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

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
          className="flex-1"
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

          <RichEditor
            showsVerticalScrollIndicator={false}
            placeholder="Note"
            style={{ marginHorizontal: 4 }}
            editorStyle={{
              backgroundColor: colors.background,
              placeholderColor: "#606060",
              caretColor: COLORS.darkOrange,
            }}
            ref={richText}
            onChange={(descriptionText) => {
              console.log("descriptionText:", descriptionText)
            }}
            onFocus={() => {
              setIsFocused(true)
            }}
            onBlur={() => setIsFocused(false)}
            onCursorPosition={handleScroll}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      {isFocused && isKeyboardVisible && <Toolbar editor={richText} />}
    </View>
  )
}

export default Note
