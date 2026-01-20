import { Layout } from "./components/Layout";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
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
      content={<Editor note={activeNote} onUpdate={updateNote} />}
    />
  );
}

export default App;
