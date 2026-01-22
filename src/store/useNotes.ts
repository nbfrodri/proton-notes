import { useState, useEffect } from "react";
import { type Note, type Folder } from "../types";

const STORAGE_KEY = "proton-notes-data";
const FOLDERS_STORAGE_KEY = "proton-notes-folders";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem(FOLDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const addNote = (
    type: "text" | "checklist" | "image" = "text",
    folderId?: string,
  ) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "New Note",
      content: "",
      type,
      folderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
      ),
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  // Folder actions
  const addFolder = (name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
    };
    setFolders([...folders, newFolder]);
  };

  const updateFolder = (id: string, name: string) => {
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const deleteFolder = (id: string) => {
    // Determine what to do with notes in the folder - for now, move to root (start)
    // Or delete them? Usually safer to move to root or ask.
    // Let's move them to root (remove folderId)
    setNotes((prev) =>
      prev.map((n) => (n.folderId === id ? { ...n, folderId: undefined } : n)),
    );
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  const reorderNotes = (newNotes: Note[]) => setNotes(newNotes);
  const reorderFolders = (newFolders: Folder[]) => setFolders(newFolders);

  return {
    notes,
    folders,
    activeNoteId,
    setActiveNoteId,
    addNote,
    updateNote,
    deleteNote,
    addFolder,
    updateFolder,
    deleteFolder,
    reorderNotes,
    reorderFolders,
  };
}
