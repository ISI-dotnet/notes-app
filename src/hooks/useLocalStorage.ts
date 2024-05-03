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
  const [loading, setLoading] = useState(true) // Add loading state

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

  useEffect(() => {
    const loadStorage = () => {
      AsyncStorage.getItem("@notificationStorage")
        .then((storedData) => {
          if (storedData !== null) {
            setStorage(JSON.parse(storedData))
          }
        })
        .catch((error) => {
          console.error("Error loading data from AsyncStorage:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    loadStorage()
  }, [])

  return {
    storage,
    isStorageLoading: loading,
    addNotification,
    removeNotification,
  }
}

export default useLocalStorage
