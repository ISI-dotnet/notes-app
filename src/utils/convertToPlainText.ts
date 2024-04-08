const { convert } = require("html-to-text")

export const convertToPlainText = (richText: string) => {
  return convert(richText)
}
