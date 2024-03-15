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

let initialDummyNotesData = [
  {
    id: 1,
    title: "First note eyuw8 wyuwefd gyuw wweeeweww",
    description: "This is description",
    parentFolder: "home",
  },
  {
    id: 2,
    title: "Second note",
    description: "This is description",
    parentFolder: "home",
  },
  {
    id: 3,
    title: "Third note",
    description: "This is description",
    parentFolder: "home",
  },
  {
    id: 4,
    title: "Fourth note",
    description:
      "This is description a very long desription ocntaining a lot of words and a long story blah blah blah and isusedtotest",
    parentFolder: "home",
  },
  {
    id: 5,
    title: "Fifth note",
    description: "",
    parentFolder: "home",
  },
  {
    id: 6,
    title: "Sixth note",
    description: "",
    parentFolder: "home",
  },
  {
    id: 6,
    title: "Seventh note",
    description: "Hi, this is nested note",
    parentFolder:
      "First folder with a super lengthy and sophisticated folder name",
  },
]

let initialDummyFoldersData = [
  {
    id: 111,
    title: "First folder with a super lengthy and sophisticated folder name",
    parentFolder: "home",
  },
  {
    id: 112,
    title: "Second folder",
    parentFolder: "home",
  },
  {
    id: 113,
    title: "Third folder",
    parentFolder: "home",
  },
  {
    id: 114,
    title: "Fourth folder",
    parentFolder: "home",
  },
  {
    id: 115,
    title: "Fifth folder",
    parentFolder: "home",
  },
  {
    id: 116,
    title: "Sixth folder",
    parentFolder: "home",
  },
  {
    id: 117,
    title: "Folder inside first folder",
    parentFolder:
      "First folder with a super lengthy and sophisticated folder name",
  },
]

let initialDummyData: (Note | NoteFolder)[] = [
  ...initialDummyFoldersData,
  ...initialDummyNotesData,
]

const BrowseScreen = () => {
  const { browse } = useLocalSearchParams()
  const path = usePathname()
  const router = useRouter()
  const [fileList, setFileList] =
    useState<(Note | NoteFolder)[]>(initialDummyData)

  const parentFolder = browse[browse.length - 1]
  console.log(parentFolder)
  useEffect(() => {
    const dummyNotesData = initialDummyNotesData.filter(
      (item) => item.parentFolder === parentFolder
    )
    const dummyFoldersData = initialDummyFoldersData.filter(
      (item) => item.parentFolder === parentFolder
    )
    let mergedDummyData = [...dummyFoldersData, ...dummyNotesData]
    setFileList(mergedDummyData)
  }, [path])

  const handleNavigateBackFolder = () => {
    const pathArr = path.split("/")
    pathArr.pop()
    const previousPath = pathArr.join("/")
    router.push(previousPath as any)
  }

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: parentFolder,
          headerStyle: {
            backgroundColor: "orange",
          },
          headerLeft: () =>
            path !== "/browse/home" ? (
              <Feather
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
