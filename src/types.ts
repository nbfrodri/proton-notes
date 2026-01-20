export interface Note {
  id: string;
  title: string;
  content: string;
  type: "text" | "checklist" | "image";
  createdAt: number;
  updatedAt: number;
}
