import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { COLORS } from "@/src/constants/Colors";
import { useTheme } from "@react-navigation/native";
import Toolbar from "@/src/components/note/Toolbar";
import RichTextEditor from "@/src/components/note/RichTextEditor";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const Note = () => {
  const richText = useRef<RichEditor | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [description, setDescription] = useState("");

  // effect used for showing and hiding note styling toolbar based on keyboard visibility on screen
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // When note is long enough not not fit in screen, scroll the note by 30px when entering new line
  const handleScroll = (scrollY: number) => {
    // Only trigger scrolling if the RichEditor is focused
    if (isFocused && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: scrollY - 30,
        animated: true,
      });
    }
  };

  const handleChange = (descriptionText: string) => {
    setDescription(descriptionText);
  };

  const handleSubmit = async () => {
    try {
      console.log(title, description);
      await addDoc(collection(db, "notes"), {
        title: title,
        description: description,
      });
      // console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "orange",
          },
          headerRight: () => (
            <Pressable
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
              onPress={handleSubmit}
            >
              <AntDesign name="check" size={24} color="black" />
            </Pressable>
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
            handleChange={handleChange}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      {/* Toolbar is only visible on note description and when the keyboard is open */}
      {isFocused && isKeyboardVisible && <Toolbar editor={richText} />}
    </View>
  );
};

export default Note;
