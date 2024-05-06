import * as Notifications from "expo-notifications"

export type PushNotificationState = {
  notification?: Notifications.Notification
  expoPushToken?: Notifications.ExpoPushToken
}
