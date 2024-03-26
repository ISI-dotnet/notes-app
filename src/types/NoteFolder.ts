export type NoteFolder = {
  id: string
  title: string
  parentFolderName: string
  parentFolderId: string
  dateCreated?: Date
  dateModified?: Date
}
