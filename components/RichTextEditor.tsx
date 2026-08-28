// components/RichTextEditor.tsx

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaHeading,
  FaEraser,
} from "react-icons/fa";
import { BiUndo, BiRedo } from "react-icons/bi";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  height = "300px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false, // avoids SSR warnings
  });

  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleHeading = (level: 1 | 2 | 3) =>
    editor.chain().focus().toggleHeading({ level }).run();
  const clearFormatting = () => editor.chain().focus().clearNodes().unsetAllMarks().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  return (
    <div className="rich-editor border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button
          onClick={undo}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("undo") ? "bg-gray-200" : ""}`}
          title="Undo"
        >
          <BiUndo size={18} />
        </button>
        <button
          onClick={redo}
          className="p-1.5 rounded hover:bg-gray-200"
          title="Redo"
        >
          <BiRedo size={18} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={toggleBold}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
          title="Bold"
        >
          <FaBold size={16} />
        </button>
        <button
          onClick={toggleItalic}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
          title="Italic"
        >
          <FaItalic size={16} />
        </button>
        <button
          onClick={toggleUnderline}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
          title="Underline"
        >
          <FaUnderline size={16} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={() => toggleHeading(1)}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""}`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => toggleHeading(2)}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => toggleHeading(3)}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""}`}
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={toggleBulletList}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
          title="Bullet List"
        >
          <FaListUl size={16} />
        </button>
        <button
          onClick={toggleOrderedList}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
          title="Numbered List"
        >
          <FaListOl size={16} />
        </button>
        <div className="w-px bg-gray-300 mx-1" />

        <button
          onClick={clearFormatting}
          className="p-1.5 rounded hover:bg-gray-200 text-red-500"
          title="Clear formatting"
        >
          <FaEraser size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        style={{ minHeight: height }}
        className="p-2 focus:outline-none"
      />

      <style jsx global>{`
        .rich-editor .ProseMirror {
          min-height: ${height};
          outline: none;
        }
        .rich-editor .ProseMirror p {
          margin: 0 0 0.5em 0;
        }
        .rich-editor .ProseMirror h1 {
          font-size: 1.8em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .rich-editor .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.4em 0;
        }
        .rich-editor .ProseMirror h3 {
          font-size: 1.2em;
          font-weight: bold;
          margin: 0.3em 0;
        }
        .rich-editor .ProseMirror ul,
        .rich-editor .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .rich-editor .ProseMirror .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .rich-editor .ProseMirror strong {
          font-weight: bold;
        }
        .rich-editor .ProseMirror em {
          font-style: italic;
        }
        .rich-editor .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}