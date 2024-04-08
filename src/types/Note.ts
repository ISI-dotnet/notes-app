export type Note = {
  id: string
  userId: string
  title: string
  description: string
  richTextDescription: string
  parentFolderId: string
  parentFolderName: string
  dateCreated?: Date
  dateModified?: Date
}
