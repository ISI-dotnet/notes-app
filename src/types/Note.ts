export type Note = {
  id: number
  title: string
  description: string
  parentFolderId: number
  parentFolderName: string
  dateCreated?: Date
  dateModified?: Date
}
