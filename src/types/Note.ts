export type Note = {
  id: string
  userId: string
  title: string
  description: string
  parentFolderId: string
  parentFolderName: string
  dateCreated?: Date
  dateModified?: Date
}
