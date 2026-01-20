import React from "react";
import { type Note } from "../types";

interface EditorProps {
  note: Note | undefined;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdate }) => {
  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Select a note or create a new one</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full p-8 pt-12">
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdate(note.id, { title: e.target.value })}
        placeholder="Note Title"
        className="bg-transparent text-4xl font-bold text-white placeholder-slate-600 focus:outline-none mb-6 w-full"
      />
      <textarea
        value={note.content}
        onChange={(e) => onUpdate(note.id, { content: e.target.value })}
        placeholder="Start typing..."
        className="flex-1 bg-transparent text-slate-300 resize-none focus:outline-none text-lg leading-relaxed placeholder-slate-700"
      />
    </div>
  );
};
