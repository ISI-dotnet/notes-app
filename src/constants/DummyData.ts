import { Note } from "../types/Note"
import { NoteFolder } from "../types/NoteFolder"

export let initialDummyNotesData = [
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

export let initialDummyFoldersData = [
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

export let initialDummyData: (Note | NoteFolder)[] = [
  ...initialDummyFoldersData,
  ...initialDummyNotesData,
]
