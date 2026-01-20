import React, { useState, useEffect } from "react";
import { type Note } from "../types";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistEditorProps {
  note: Note | undefined;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export const ChecklistEditor: React.FC<ChecklistEditorProps> = ({
  note,
  onUpdate,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  // Parse items from content on load
  useEffect(() => {
    if (note?.content) {
      try {
        const parsed = JSON.parse(note.content);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          // Fallback for empty or newly converted notes
          setItems([]);
        }
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id]); // Only re-parse on note switch

  const saveItems = (newItems: ChecklistItem[]) => {
    setItems(newItems);
    if (note) {
      onUpdate(note.id, { content: JSON.stringify(newItems) });
    }
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: "",
      checked: false,
    };
    saveItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );
    saveItems(newItems);
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ];
    saveItems(newItems);
  };

  if (!note) return null;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-8 pt-12">
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdate(note.id, { title: e.target.value })}
        placeholder="Checklist Title"
        className="bg-transparent text-4xl font-bold text-white placeholder-slate-600 focus:outline-none mb-8 w-full"
      />

      <button
        onClick={addItem}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors py-2 px-4 rounded-lg border border-dashed border-slate-700 hover:border-emerald-400/50 w-full justify-center"
      >
        <Plus size={20} />
        <span>Add Task</span>
      </button>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-white/5 group transition-colors hover:border-white/10"
          >
            <div className="flex flex-col gap-1 text-slate-600">
              <button
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                className="hover:text-slate-400 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                title="Move Up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => moveItem(index, "down")}
                disabled={index === items.length - 1}
                className="hover:text-slate-400 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                title="Move Down"
              >
                <ArrowDown size={16} />
              </button>
            </div>

            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) =>
                updateItem(item.id, { checked: e.target.checked })
              }
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
            />

            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(item.id, { text: e.target.value })}
              placeholder="Task description..."
              className={`flex-1 bg-transparent border-none focus:ring-0 text-lg ${item.checked ? "text-slate-500 line-through decoration-2 decoration-slate-600" : "text-slate-100"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addItem();
                }
              }}
              autoFocus={item.text === ""}
            />

            <button
              onClick={() => deleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
