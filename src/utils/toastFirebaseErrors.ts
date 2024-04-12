import { showToast } from "./showToast"

export const toastFirebaseErrors = (errorMessage: string) => {
  switch (errorMessage) {
    case "Firebase: Error (auth/invalid-email).":
      showToast("error", "Provided email is not valid", undefined)
      break
    case "Firebase: Error (auth/invalid-credential).":
      showToast("error", "Incorrect user email or password", undefined)
      break
    case "Firebase: Password should be at least 6 characters (auth/weak-password).":
      showToast("error", "Password should be at least 6 characters", undefined)
      break
    case "Firebase: Error (auth/email-already-in-use).":
      showToast("error", "Provided email already taken", undefined)
      break
    case "User created successfully!":
      showToast("success", "User created successfully!")
    default:
      showToast("error", "Oops, something went wrong...")
      break
  }
}
