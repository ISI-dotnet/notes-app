import Toast, { ToastType } from "react-native-toast-message"

export const showToast = (
  type: ToastType = "success",
  mainText: string,
  descriptionText?: string,
  visibilityTime = 6000
) => {
  Toast.show({
    type: type,
    text1: mainText,
    text2: descriptionText,
    visibilityTime: visibilityTime,
  })
}
