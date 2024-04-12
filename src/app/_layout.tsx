import { Slot, SplashScreen } from "expo-router"
import { SessionProvider } from "../context/AuthContext"
import { LoaderProvider } from "../context/LoaderContext"
import { ThemeProvider } from "@react-navigation/native"
import { useEffect } from "react"
import { useFonts } from "expo-font"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Toast from "react-native-toast-message"

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <Root />
}

export const MyTheme = {
  dark: false,
  colors: {
    primary: "rgb(255, 45, 85)",
    background: "rgb(242, 242, 242)",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(199, 199, 204)",
    notification: "rgb(255, 69, 58)",
  },
}

function Root() {
  return (
    <SessionProvider>
      <LoaderProvider>
        <ThemeProvider value={MyTheme}>
          <Slot />
          <Toast topOffset={60} />
        </ThemeProvider>
      </LoaderProvider>
    </SessionProvider>
  )
}
