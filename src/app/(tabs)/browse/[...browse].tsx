import FolderItem from "@/src/components/fileList/FolderItem"
import NoteItem from "@/src/components/fileList/NoteItem"
import { Feather } from "@expo/vector-icons"
import {
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

const BrowseScreen = () => {
  const { browse, currentFolderId, previousFolderId } = useLocalSearchParams()

  const path = usePathname()
  const router = useRouter()
  const [fileList, setFileList] =
    useState<(Note | NoteFolder)[]>(initialDummyData)

  const currentFolderName = browse[browse.length - 1]

  // TODO: call api to fetch notes based on currentFolderId
  useEffect(() => {
    const dummyNotesData = initialDummyNotesData.filter(
      (item) => item.parentFolderId === Number(currentFolderId)
    )
    const dummyFoldersData = initialDummyFoldersData.filter(
      (item) => item.parentFolderId === Number(currentFolderId)
    )
    let mergedDummyData = [...dummyFoldersData, ...dummyNotesData]
    setFileList(mergedDummyData)
  }, [path])

  const handleNavigateBackFolder = () => {
    const pathArr = path.split("/")
    pathArr.pop()
    const previousPath = pathArr.join("/")
    router.push({
      pathname: previousPath as any,
      params: {
        currentFolderId: Number(previousFolderId),
      },
    })
  }

  return (
    <SafeAreaView>
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

      <FlatList
        className="pt-4 px-3"
        contentContainerStyle={{ paddingBottom: 20 }}
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
    </SafeAreaView>
  )
}

export default BrowseScreen
