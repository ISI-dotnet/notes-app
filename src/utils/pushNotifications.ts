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

export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId)
}
