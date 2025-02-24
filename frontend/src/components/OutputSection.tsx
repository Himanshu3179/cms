import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useEffect, useRef, useState } from "react";

const OutputSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const [titleState, setTitleState] = useState(title || "");
  const editorRef = useRef<Editor | null>(null);

  // ✅ Use a state to store the editor content
  const [editorContent, setEditorContent] = useState(description || "");

  useEffect(() => {
    setTitleState(title); // Update title state
    setEditorContent(description); // Update editor content state

    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(description || ""); // Set new content
    }
  }, [title, description]); // Runs when title or description changes

  console.log("i got this :", title, description);

  return (
    <div className="bg-white">
      <div className="w-full flex justify-end items-center p-2">
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
          Publish
        </button>
      </div>
      <input
        type="text"
        value={titleState}
        onChange={(e) => setTitleState(e.target.value)}
        placeholder="Enter title"
        className="border mb-2 p-2 w-full"
      />
      <Editor
        ref={editorRef}
        initialValue={editorContent} // ✅ Set initial content properly
        previewStyle="wysiwyg"
        height="600px"
        initialEditType="wysiwyg" // ✅ Ensure correct mode
        useCommandShortcut={true}
      />
    </div>
  );
};

export default OutputSection;
