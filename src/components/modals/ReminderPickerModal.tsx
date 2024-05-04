import { COLORS } from "@/src/constants/Colors"
import useLocalStorage from "@/src/hooks/useLocalStorage"
import { usePushNotification } from "@/src/hooks/usePushNotifications"
import { Note } from "@/src/types/Note"
import {
  cancelNotification,
  schedulePushNotification,
} from "@/src/utils/pushNotifications"
import { showToast } from "@/src/utils/showToast"
import { AntDesign } from "@expo/vector-icons"
import DateTimePicker, {
  AndroidNativeProps,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker"

import React, { useEffect, useState } from "react"
import {
  Button,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
type ReminderPickerModalProps = {
  noteId: string
  noteDetails: Note | Omit<Note, "id">
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  isReminderPickerModalVisible: boolean
  setIsReminderPickerModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const ReminderPickerModal = ({
  noteId,
  noteDetails,
  date,
  setDate,
  isReminderPickerModalVisible,
  setIsReminderPickerModalVisible,
}: ReminderPickerModalProps) => {
  const { storage, addNotification, removeNotification } = useLocalStorage()
  const { expoPushToken, notification } = usePushNotification()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [mode, setMode] = useState<AndroidNativeProps["mode"]>("date")
  const [show, setShow] = useState(false)

  useEffect(() => {
    setSelectedDate(date)
  }, [date])
  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    setShow(false)
    setSelectedDate(selectedDate)
  }

  const showMode = (currentMode: AndroidNativeProps["mode"]) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode("date")
  }

  const showTimepicker = () => {
    showMode("time")
  }

  const handleRemovePress = async () => {
    if (noteId !== "0") {
      await cancelNotification(noteId)
      removeNotification(noteId)
    }
    setDate(undefined)

    setIsReminderPickerModalVisible(false)
  }

  const handleCancelPress = () => {
    setSelectedDate(date)
    setIsReminderPickerModalVisible(false)
  }

  const handleAddPress = async () => {
    if (!selectedDate) {
      showToast("error", "Please select reminder date and time!")
      return
    } else if (selectedDate < new Date()) {
      showToast("error", "Notification time can't be in the past!")
      return
    }

    setDate(selectedDate)
    setIsReminderPickerModalVisible(false)

    if (noteId !== "0") {
      const previousReminderDate = new Date(storage[noteId]?.date)
      if (previousReminderDate.getTime() !== selectedDate.getTime()) {
        await cancelNotification(noteId)
        removeNotification(noteId)
        const notificationId = await schedulePushNotification(
          selectedDate,
          "Reminder",
          `Note: ${noteDetails.title}`
        )
        addNotification(noteId, notificationId, selectedDate)
      }
    }
  }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isReminderPickerModalVisible}
      onRequestClose={() => setIsReminderPickerModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center">
        <TouchableWithoutFeedback onPress={handleCancelPress}>
          <View className="absolute top-0 left-0 right-0 bottom-0" />
        </TouchableWithoutFeedback>

        <View className="bg-slate-50 shadow-md shadow-black rounded-2xl w-10/12">
          <TouchableOpacity
            onPress={handleCancelPress}
            className="ml-auto mr-0 p-4 "
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <View className="pb-8 px-8">
            <Text className="text-center text-xl mb-7">
              Please select reminder date and time
            </Text>
            <View className="flex-row justify-between mb-4">
              <Button onPress={showDatepicker} title="Select date" />
              <Button onPress={showTimepicker} title="Select time" />
            </View>
            <Text className="text-center text-lg bg-gray-800 text-white rounded-xl py-6 px-4">
              {selectedDate
                ? `Selected: ${selectedDate.toLocaleString()}`
                : date
                ? `Selected: ${date.toLocaleString()}`
                : `No reminder selected`}
            </Text>
          </View>
          <View className="flex-row gap-2 justify-end pb-6 px-6">
            {date && (
              <TouchableOpacity
                onPress={handleRemovePress}
                className="mr-auto px-3 py-2 bg-red-500 rounded-md"
              >
                <Text className="text-zinc-100">REMOVE</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleCancelPress}
              className="  px-4 py-2 rounded-md"
            >
              <Text className="">CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddPress}
              className=" bg-orange-400 px-4 py-2 rounded-md"
            >
              <Text className="text-zinc-100">ADD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {show && (
        <DateTimePicker
          minimumDate={new Date()}
          value={selectedDate ?? new Date()}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </Modal>
  )
}

export default ReminderPickerModal
