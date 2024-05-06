import { useState, useEffect, useRef } from "react"
import { Alert } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"

import Constants from "expo-constants"

import { Platform } from "react-native"
import { PushNotificationState } from "@/src/types/PushNotificationState"

export const usePushNotification = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  })

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >()

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >()

  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  const registerForPushNotificationsAsync = async () => {
    let token
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()

      let finalStatus = existingStatus

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Notification Permission Required",
          "Please enable notifications in your device settings to receive notifications."
        )
        return
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    } else {
      console.log("Not a physical device")
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    return token
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token)
    })

    notificationListener.current =
      Notifications.addNotificationResponseReceivedListener(
        ({ notification }) => setNotification(notification)
      )

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) =>
        console.log(response)
      )

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      )

      Notifications.removeNotificationSubscription(responseListener.current!)
    }
  }, [])

  return {
    expoPushToken,
    notification,
  }
}
