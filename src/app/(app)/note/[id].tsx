import { Stack, useLocalSearchParams, router } from "expo-router"
import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import React, { useEffect, useRef, useState } from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native"
import { RichEditor } from "react-native-pell-rich-editor"
import Toolbar from "@/src/components/note/Toolbar"
import RichTextEditor from "@/src/components/note/RichTextEditor"
import { Note } from "@/src/types/Note"
import {
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "@/src/api/note/note"
import { useLoader } from "@/src/context/useLoader"
import Loader from "@/src/components/Loader"
import { useSession } from "@/src/context/useSession"
import { useNavigation } from "expo-router"
import { toastFirebaseErrors } from "@/src/utils/toastFirebaseErrors"
import { showToast } from "@/src/utils/showToast"
import { UNKNOWN_ERROR_MESSAGE } from "@/src/constants/ErrorMessages"
import { convertToPlainText } from "@/src/utils/convertToPlainText"
import FolderPickerModal from "@/src/components/modals/FolderPickerModal"
import { SafeAreaView } from "react-native-safe-area-context"
import ReminderPickerModal from "@/src/components/modals/ReminderPickerModal"
import { COLORS } from "@/src/constants/Colors"
import useLocalStorage from "@/src/hooks/useLocalStorage"
import { schedulePushNotification } from "@/src/utils/pushNotifications"

const NotePage = () => {
  const { id }: { id: string } = useLocalSearchParams()
  const { loading, setIsLoading } = useLoader()
  const { session } = useSession()
  const navigation = useNavigation()
  const [isFolderPickerModalVisible, setIsFolderPickerModalVisible] =
    useState(false)
  const [isReminderOptionsModalVisible, setIsReminderOptionsModalVisible] =
    useState(false)

  const [noteDetails, setNoteDetails] = useState<Omit<Note, "id"> | Note>({
    userId: session!,
    title: "",
    description: "",
    richTextDescription: "",
    parentFolderName: "Home",
    parentFolderId: "home",
  })

  const richText = useRef<RichEditor | null>(null)
  const scrollRef = useRef<ScrollView | null>(null)
  const [selectedFolderTitle, setSelectedFolderTitle] = useState("")

  const [isFocused, setIsFocused] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  const { storage, addNotification, editNotification, removeNotification } =
    useLocalStorage()
  let defaultDate: Date | undefined
  if ("id" in noteDetails) {
    // `noteDetails` has an `id` property
    defaultDate = storage[noteDetails.id]?.date
  }

  const [reminderDate, setReminderDate] = useState<Date | undefined>()
  const [previousSelectedDate, setPreviousSelectedDate] = useState<
    Date | undefined
  >(defaultDate)

  const handleSubmit = async () => {
    if (noteDetails.title === "") {
      showToast("info", "Note can't be saved without a title")
      return
    }
    noteDetails.description = convertToPlainText(
      noteDetails.richTextDescription
    )
    if (id !== "0") {
      const updatedNote = { id: id, ...noteDetails }
      updateNote(updatedNote)
        .then(() => router.back())
        .catch((error) => {
          if (error.message) {
            toastFirebaseErrors(error.message)
            return
          } else {
            showToast("error", UNKNOWN_ERROR_MESSAGE)
            return
          }
        })
    } else {
      try {
        const note = await createNote(noteDetails)
        const newNoteId = note.id
        router.back()

        if (reminderDate) {
          const notificationId = await schedulePushNotification(
            reminderDate,
            "Reminder",
            `Note: ${noteDetails.title}`
          )
          addNotification(newNoteId, notificationId, reminderDate)
        }
      } catch (error: any) {
        if (error.message) {
          toastFirebaseErrors(error.message)
        } else {
          showToast("error", UNKNOWN_ERROR_MESSAGE)
        }
      }
    }
  }

  const handleSelectFolder = (folderId: string, folderTitle: string) => {
    setSelectedFolderTitle(folderTitle)
    setIsFolderPickerModalVisible(false)
    // Update note details with selected folder
    setNoteDetails((oldValue) => ({
      ...oldValue,
      parentFolderName: folderTitle,
      parentFolderId: folderId,
    }))
  }

  const handleDeleteNote = () => {
    deleteNote(id)
      .then(() => {
        router.back()
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    const getNoteDetails = async () => {
      setIsLoading(true)
      if (id !== "0") {
        const note = await getNoteById(id)
        setNoteDetails(note)
        setSelectedFolderTitle(note.parentFolderName)
      } else {
        setSelectedFolderTitle("Home")
      }
      setIsLoading(false)
    }
    const unsubscribe = navigation.addListener("transitionEnd" as any, () => {
      getNoteDetails()
    })
    return unsubscribe
  }, [navigation])

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
          title: selectedFolderTitle,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "orange",
          },
          header: () => (
            <SafeAreaView
              className={`flex-row justify-between items-center px-4 py-3 bg-orange-400`}
            >
              <TouchableOpacity onPress={() => router.back()} className="mr-3">
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>

              {!loading && selectedFolderTitle !== "" && (
                <>
                  <MaterialIcons
                    name="add-alert"
                    size={24}
                    color="black"
                    onPress={() => setIsReminderOptionsModalVisible(true)}
                  />
                  {/* <MaterialCommunityIcons name="bell-ring" size={24} color="black" /> */}
                  <TouchableOpacity
                    onPress={() => setIsFolderPickerModalVisible(true)}
                    className="flex-row justify-center items-center space-x-1 flex-1"
                  >
                    <Text
                      className="font-bold text-xl text-center p-0"
                      numberOfLines={1}
                    >
                      Folder: {selectedFolderTitle}
                    </Text>
                    <AntDesign name="down" size={15} color="black" style={{}} />
                  </TouchableOpacity>
                  <View className="flex-row items-center space-x-2">
                    {id !== "0" && (
                      <MaterialIcons
                        name="delete-forever"
                        size={24}
                        color="black"
                        onPress={handleDeleteNote}
                      />
                    )}
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={noteDetails.title === ""}
                      style={{ opacity: noteDetails.title === "" ? 0.3 : 1 }}
                    >
                      <AntDesign name="check" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </SafeAreaView>
          ),
        }}
      />
      {loading || (id !== "0" && noteDetails.dateCreated === undefined) ? (
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
                  richTextDescription: descriptionText,
                }))
              }
              ref={richText}
              setIsFocused={setIsFocused}
              handleScroll={handleScroll}
              noteDescription={noteDetails.richTextDescription}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      )}

      {/* Toolbar is only visible on note description and when the keyboard is open */}
      {isFocused && isKeyboardVisible && <Toolbar editor={richText} />}

      <FolderPickerModal
        isFolderPickerModalVisible={isFolderPickerModalVisible}
        setIsFolderPickerModalVisible={setIsFolderPickerModalVisible}
        onSelectFolder={handleSelectFolder}
        onClose={() => setIsFolderPickerModalVisible(false)}
      />

      <ReminderPickerModal
        date={reminderDate}
        setDate={setReminderDate}
        defaultDate={defaultDate}
        previousSelectedDate={previousSelectedDate}
        setPreviousSelectedDate={setPreviousSelectedDate}
        isReminderPickerModalVisible={isReminderOptionsModalVisible}
        setIsReminderPickerModalVisible={setIsReminderOptionsModalVisible}
        setNoteDetails={setNoteDetails}
      />
    </View>
  )
}
export default NotePage
