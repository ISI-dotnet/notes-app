import FolderItem from "@/src/components/fileList/FolderItem"
import NoteItem from "@/src/components/fileList/NoteItem"
import { Feather } from "@expo/vector-icons"
import {
  Href,
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router"
import { FlatList, SafeAreaView } from "react-native"
import { Note } from "@/src/types/Note"
import { NoteFolder } from "@/src/types/NoteFolder"
import { useEffect, useState } from "react"
import { PATHS } from "@/src/constants/Paths"
import {
  initialDummyData,
  initialDummyFoldersData,
  initialDummyNotesData,
} from "@/src/constants/DummyData"
import EmptyFolder from "@/src/components/fileList/EmptyFolder"
import { auth } from "@/firebaseConfig"
import { getNotes } from "@/src/api/note/note"
import { getFolders } from "@/src/api/note/folder"

const BrowseScreen = () => {
  const { browse, currentFolderId, previousFolderId } = useLocalSearchParams()

  const user = auth.currentUser

  const path = usePathname()
  const router = useRouter()
  const [fileList, setFileList] =
    useState<(Note | NoteFolder)[]>(initialDummyData)

  const currentFolderName = browse[browse.length - 1]
  // TODO: call api to fetch notes based on currentFolderId
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch notes and folders concurrently
        const [notesArr, foldersArr] = await Promise.all([
          getNotes(user!.uid, currentFolderId as string),
          getFolders(user!.uid, currentFolderId as string),
        ])

        // Update fileList state after both promises have resolved
        setFileList([...foldersArr, ...notesArr])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [path])

  const handleNavigateBackFolder = () => {
    const pathArr = path.split("/")
    pathArr.pop()
    const previousPath = pathArr.join("/")
    router.push({
      pathname: previousPath as Href<string>,
      params: {
        currentFolderId: Number(previousFolderId),
      },
    })
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: currentFolderName,
          headerStyle: {
            backgroundColor: "orange",
          },
          headerLeft: () =>
            path !== PATHS.browseTabInitialRoute ? (
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
      {fileList.length > 0 ? (
        <FlatList
          className="px-3"
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20 }}
          data={fileList}
          renderItem={({ item }) => {
            return "description" in item ? (
              <NoteItem noteDetails={item} />
            ) : (
              <FolderItem folderDetails={item} />
            )
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <EmptyFolder />
      )}
    </SafeAreaView>
  )
}

export default BrowseScreen
