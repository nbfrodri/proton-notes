import React from "react";
import { type Note } from "../types";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onNoteSelect: (id: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  onNoteSelect,
  onAddNote,
  onDeleteNote,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300">
      <div className="p-4 pt-10 border-b border-white/5">
        <h1 className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Proton Notes
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note.id)}
            className={`
                        group relative p-3 rounded-lg cursor-pointer transition-all duration-200
                        ${
                          activeNoteId === note.id
                            ? "bg-white/10 text-white shadow-lg"
                            : "hover:bg-white/5 hover:text-white"
                        }
                    `}
          >
            <div className="font-medium truncate pr-6">
              {note.title || "Untitled Note"}
            </div>
            <div className="text-xs text-white/40 mt-1 truncate">
              {new Date(note.updatedAt).toLocaleDateString()}
            </div>

            <button
              onClick={(e) => onDeleteNote(note.id, e)}
              className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-1"
              title="Delete note"
            >
              ×
            </button>
          </div>
        ))}

        {notes.length === 0 && (
          <div className="text-center text-white/20 mt-10 text-sm">
            No notes yet
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={onAddNote}
          className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          + New Note
        </button>
      </div>
    </div>
  );
};
