import * as Notifications from "expo-notifications"

export async function schedulePushNotification(
  reminderDate: Date,
  reminderTitle: string,
  reminderBody: string
) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: reminderTitle,
      body: reminderBody,
    },
    trigger: { date: reminderDate },
  })
}
