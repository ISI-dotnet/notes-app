import { Stack } from "expo-router"
import { useSession } from "@/src/context/useSession"
import { Redirect } from "expo-router"
import Loader from "@/src/components/Loader"

export default function AppLayout() {
  const { session, isLoading } = useSession()

  if (isLoading) {
    return <Loader />
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="note/[id]"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  )
}
