import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { type Note } from "../types";

interface RichEditorProps {
  note: Note | undefined;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

const MenuButton = ({
  isActive,
  onClick,
  children,
  title,
}: {
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    className={twMerge(
      "p-2 rounded hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-100",
      isActive && "bg-slate-700 text-slate-100",
    )}
  >
    {children}
  </button>
);

export const RichEditor: React.FC<RichEditorProps> = ({ note, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: note?.content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-lg max-w-none focus:outline-none [&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:p-0 [&_li[data-type='taskItem']]:flex [&_li[data-type='taskItem']]:gap-2 [&_li[data-type='taskItem']]:items-start [&_input[type='checkbox']]:mt-1.5",
      },
    },
    onUpdate: ({ editor }) => {
      if (note) {
        onUpdate(note.id, { content: editor.getHTML() });
      }
    },
  });

  useEffect(() => {
    if (editor && note) {
      editor.commands.setContent(note.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id, editor]);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Select a note or create a new one</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-8 pt-12">
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdate(note.id, { title: e.target.value })}
        placeholder="Note Title"
        className="bg-transparent text-4xl font-bold text-white placeholder-slate-600 focus:outline-none mb-6 w-full"
      />

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 mb-4 border-b border-slate-800 flex-wrap sticky top-0 bg-slate-900/95 backdrop-blur z-10">
        <MenuButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive("bold")}
          title="Bold"
        >
          <Bold size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive("italic")}
          title="Italic"
        >
          <Italic size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          isActive={editor?.isActive("strike")}
          title="Strike"
        >
          <Strikethrough size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <MenuButton
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor?.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor?.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-slate-700 mx-1" />

        <MenuButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-slate-700 mx-1" />

        <MenuButton
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          isActive={editor?.isActive("codeBlock")}
          title="Code Block"
        >
          <Code size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive("blockquote")}
          title="Quote"
        >
          <Quote size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-slate-700 mx-1 ml-auto" />

        <MenuButton
          onClick={() => editor?.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={18} />
        </MenuButton>
      </div>

      <div
        className="flex-1 overflow-y-auto px-1 pb-12 cursor-text"
        onClick={() => editor?.chain().focus().run()}
      >
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};
