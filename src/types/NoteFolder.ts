export type NoteFolder = {
  id: string
  title: string
  parentFolderName: string
  parentFolderId: string
  userId: string
  dateCreated?: Date
  dateModified?: Date
}
