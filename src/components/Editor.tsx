import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { type Note } from "../types";

interface EditorProps {
  note: Note | undefined;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdate }) => {
  const [isPreview, setIsPreview] = useState(false);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Select a note or create a new one</p>
      </div>
    );
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const arrayBuffer = await file.arrayBuffer();
        try {
          const imagePath = await window.electronAPI.saveImage(arrayBuffer);

          // Debugging
          console.log("Image saved to:", imagePath);

          const imageMarkdown = `\n![Image](${imagePath})\n`;

          const textArea = document.querySelector("textarea");
          if (textArea) {
            const start = textArea.selectionStart;
            const end = textArea.selectionEnd;
            const newContent =
              note.content.substring(0, start) +
              imageMarkdown +
              note.content.substring(end);

            onUpdate(note.id, { content: newContent });

            // Restore cursor position (approximate)
            setTimeout(() => {
              textArea.selectionStart = start + imageMarkdown.length;
              textArea.selectionEnd = start + imageMarkdown.length;
              textArea.focus();
            }, 0);
          }
        } catch (err) {
          console.error("Failed to save image:", err);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full p-8 pt-12">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          placeholder="Note Title"
          className="bg-transparent text-4xl font-bold text-white placeholder-slate-600 focus:outline-none w-full mr-4"
        />
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
        >
          {isPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {isPreview ? (
        <div className="flex-1 overflow-auto prose prose-invert prose-lg max-w-none">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={note.content}
          onChange={(e) => onUpdate(note.id, { content: e.target.value })}
          onPaste={handlePaste}
          placeholder="Start typing..."
          className="flex-1 bg-transparent text-slate-300 resize-none focus:outline-none text-lg leading-relaxed placeholder-slate-700 w-full"
        />
      )}
    </div>
  );
};
