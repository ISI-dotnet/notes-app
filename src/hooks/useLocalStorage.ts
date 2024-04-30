import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface NotificationData {
  notificationId: string
  date: Date
}

interface StorageData {
  [noteId: string]: NotificationData
}

const useLocalStorage = () => {
  const [storage, setStorage] = useState<StorageData>({})

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem("@notificationStorage")
        if (storedData !== null) {
          setStorage(JSON.parse(storedData))
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error)
      }
    }

    loadStorage()
  }, [storage]) // Added storage to the dependency array

  const saveStorage = async (data: StorageData) => {
    try {
      await AsyncStorage.setItem("@notificationStorage", JSON.stringify(data))
      setStorage(data)
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error)
    }
  }

  const addNotification = async (
    noteId: string,
    notificationId: string,
    date: Date
  ) => {
    const newStorage = { ...storage, [noteId]: { notificationId, date } }
    await saveStorage(newStorage)
  }

  const removeNotification = async (noteId: string) => {
    const newStorage = { ...storage }
    delete newStorage[noteId]
    await saveStorage(newStorage)
  }

  const editNotification = async (
    noteId: string,
    newNotificationId: string,
    newDate: Date
  ) => {
    const newStorage = {
      ...storage,
      [noteId]: { notificationId: newNotificationId, date: newDate },
    }
    await saveStorage(newStorage)
  }

  return {
    storage,
    addNotification,
    removeNotification,
    editNotification,
  }
}

export default useLocalStorage
