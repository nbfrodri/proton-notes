import { Layout } from "./components/Layout";
import { Sidebar } from "./components/Sidebar";
import { RichEditor } from "./components/RichEditor";
import { ChecklistEditor } from "./components/ChecklistEditor";
import { ImageCollection } from "./components/ImageCollection";
import { useNotes } from "./store/useNotes";

function App() {
  const {
    notes,
    activeNoteId,
    setActiveNoteId,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(id);
    }
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onNoteSelect={setActiveNoteId}
          onAddNote={addNote}
          onDeleteNote={handleDelete}
        />
      }
      content={
        activeNote?.type === "checklist" ? (
          <ChecklistEditor note={activeNote} onUpdate={updateNote} />
        ) : activeNote?.type === "image" ? (
          <ImageCollection note={activeNote} onUpdate={updateNote} />
        ) : (
          <RichEditor note={activeNote} onUpdate={updateNote} />
        )
      }
    />
  );
}

export default App;
