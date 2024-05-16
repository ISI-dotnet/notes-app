export type Note = {
  id: string
  userId: string
  title: string
  description: string
  richTextDescription: string
  parentFolderId: string
  parentFolderName: string
  isFavourite: string
  dateCreated?: Date
  dateModified?: Date
}
