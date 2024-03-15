import FolderItem from "@/src/components/fileList/FolderItem"
import NoteItem from "@/src/components/fileList/NoteItem"
import { AntDesign, Feather } from "@expo/vector-icons"
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router"
import { FlatList, SafeAreaView } from "react-native"
import { Note } from "@/src/types/Note"
import { NoteFolder } from "@/src/types/NoteFolder"
import { useEffect, useState } from "react"
import { PATHS } from "@/src/constants/Paths"

let initialDummyNotesData = [
  {
    id: 1,
    title: "First note eyuw8 wyuwefd gyuw wweeeweww",
    description: "This is description",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 2,
    title: "Second note",
    description: "This is description",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 3,
    title: "Third note",
    description: "This is description",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 4,
    title: "Fourth note",
    description:
      "This is description a very long desription ocntaining a lot of words and a long story blah blah blah and isusedtotest",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 5,
    title: "Fifth note",
    description: "",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 6,
    title: "Sixth note",
    description: "",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 7,
    title: "Seventh note",
    description: "Hi, this is nested note",
    parentFolderName:
      "First folder with a super lengthy and sophisticated folder name",
    parentFolderId: 111,
  },
]

let initialDummyFoldersData = [
  {
    id: 111,
    title: "First folder with a super lengthy and sophisticated folder name",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 112,
    title: "Second folder",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 113,
    title: "Third folder",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 114,
    title: "Fourth folder",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 115,
    title: "Fifth folder",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 116,
    title: "Sixth folder",
    parentFolderName: "Home",
    parentFolderId: 0,
  },
  {
    id: 117,
    title: "Folder inside first folder",
    parentFolderName:
      "First folder with a super lengthy and sophisticated folder name",
    parentFolderId: 111,
  },
]

let initialDummyData: (Note | NoteFolder)[] = [
  ...initialDummyFoldersData,
  ...initialDummyNotesData,
]

const BrowseScreen = () => {
  const { browse, currentFolderId, previousFolderId } = useLocalSearchParams()

  const path = usePathname()
  const router = useRouter()
  const [fileList, setFileList] =
    useState<(Note | NoteFolder)[]>(initialDummyData)

  const currentFolderName = browse[browse.length - 1]
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
