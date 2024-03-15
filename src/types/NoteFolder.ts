export type NoteFolder = {
  id: number
  title: string
  parentFolderName: string
  parentFolderId: number
  dateCreated?: Date
  dateModified?: Date
}
