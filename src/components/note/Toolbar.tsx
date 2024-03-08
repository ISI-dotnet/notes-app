import React, { MutableRefObject, Ref } from "react"
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor"

const Toolbar = ({
  editor,
}: {
  editor: MutableRefObject<null | RichEditor>
}) => {
  return (
    <RichToolbar
      editor={editor}
      actions={[
        actions.setBold,
        actions.setItalic,
        actions.setUnderline,

        actions.insertBulletsList,
        actions.insertOrderedList,
        actions.setStrikethrough,
        actions.setUnderline,
        actions.removeFormat,

        actions.undo,
      ]}
    />
  )
}

export default Toolbar
