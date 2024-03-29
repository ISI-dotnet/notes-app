import { Feather } from "@expo/vector-icons"
import {
  Href,
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router"
import { SafeAreaView } from "react-native"
import FileList from "@/src/components/fileList/FileList"

const BrowseScreen = () => {
  const { browse, previousFolderId } = useLocalSearchParams()

  const path = usePathname()
  const router = useRouter()
  const currentFolderName = browse[browse.length - 1]

  const handleNavigateBackFolder = () => {
    const pathArr = path.split("/")
    pathArr.pop()
    const previousPath = pathArr.join("/")
    router.push({
      pathname: previousPath as Href<string>,
      params: {
        currentFolderId: previousFolderId,
      },
    })
  }
  console.log(path)

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: currentFolderName,
          headerStyle: {
            backgroundColor: "orange",
          },
          headerLeft: () =>
            previousFolderId !== "" ? (
              <Feather
                style={{ paddingLeft: 16 }}
                name="arrow-left"
                size={24}
                color="black"
                onPress={handleNavigateBackFolder}
              />
            ) : null,
          headerRight: () => (
            <Feather
              name="folder-plus"
              size={24}
              color="black"
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      <FileList />
    </SafeAreaView>
  )
}

export default BrowseScreen
