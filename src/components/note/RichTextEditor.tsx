import { COLORS } from "@/src/constants/Colors"
import { useTheme } from "@react-navigation/native"
import { forwardRef } from "react"
import { ScrollView } from "react-native"
import { RichEditor } from "react-native-pell-rich-editor"

type RichTextEditorProps = {
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
  handleScroll(scrollY: number): void
  handleChange(descriptionText: string): void
  noteDescription: string
}

const RichTextEditor = forwardRef<RichEditor, RichTextEditorProps>(
  ({ setIsFocused, handleScroll, handleChange, noteDescription }, ref) => {
    const { colors } = useTheme()
    return (
      <ScrollView>
        <RichEditor
          showsVerticalScrollIndicator={false}
          initialContentHTML={noteDescription}
          placeholder="Note"
          style={{ marginHorizontal: 4 }}
          editorStyle={{
            backgroundColor: colors.background,
            placeholderColor: "#606060",
            caretColor: COLORS.darkOrange,
          }}
          ref={ref}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true)
          }}
          onBlur={() => setIsFocused(false)}
          onCursorPosition={(scrollY) => handleScroll(scrollY)}
        />
      </ScrollView>
    )
  }
)

export default RichTextEditor
