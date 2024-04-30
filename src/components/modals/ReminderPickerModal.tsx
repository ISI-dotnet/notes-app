import useLocalStorage from "@/src/hooks/useLocalStorage"
import { usePushNotification } from "@/src/hooks/usePushNotifications"
import { Note } from "@/src/types/Note"
import { AntDesign } from "@expo/vector-icons"
import DateTimePicker, {
  AndroidNativeProps,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker"

import React, { useState } from "react"
import {
  Button,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
type ReminderPickerModalProps = {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  defaultDate: Date | undefined
  previousSelectedDate: Date | undefined
  setPreviousSelectedDate: React.Dispatch<
    React.SetStateAction<Date | undefined>
  >
  setNoteDetails: React.Dispatch<React.SetStateAction<Note | Omit<Note, "id">>>
  isReminderPickerModalVisible: boolean
  setIsReminderPickerModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const ReminderPickerModal = ({
  date,
  setDate,
  defaultDate,
  previousSelectedDate,
  setPreviousSelectedDate,
  setNoteDetails,
  isReminderPickerModalVisible,
  setIsReminderPickerModalVisible,
}: ReminderPickerModalProps) => {
  const handleReminderDateSelect = (date: Date) => {
    setNoteDetails((oldValue) => ({ ...oldValue, reminder: { date: date } }))
    // You can perform any additional logic here, such as posting data to the database
    console.log("Selected date:", date)
  }

  const { storage } = useLocalStorage()

  const { expoPushToken, notification } = usePushNotification()

  console.log(date)
  const [mode, setMode] = useState<AndroidNativeProps["mode"]>("date")
  const [show, setShow] = useState(false)

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate
    setShow(false)
    setDate(currentDate)
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

  const handleCancelPress = () => {
    setDate(previousSelectedDate)
    setIsReminderPickerModalVisible(false)
  }

  const handleAddPress = () => {
    setPreviousSelectedDate(date)
    setIsReminderPickerModalVisible(false)
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
            <Text>Please select reminder date and time</Text>
            <Button onPress={showDatepicker} title="Show date picker!" />
            <Button onPress={showTimepicker} title="Show time picker!" />
            {date ? (
              <Text>selected: {date.toLocaleString()}</Text>
            ) : (
              <Text>No reminder selected</Text>
            )}
          </View>
          <View className="flex-row gap-2 justify-end pb-6 px-6">
            {defaultDate && (
              <TouchableOpacity
                onPress={() => setIsReminderPickerModalVisible(false)}
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
          value={date ?? new Date()}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </Modal>
  )
}

export default ReminderPickerModal
