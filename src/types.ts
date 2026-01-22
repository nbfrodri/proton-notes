export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: "text" | "checklist" | "image";
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}
