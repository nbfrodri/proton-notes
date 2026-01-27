export interface ElectronAPI {
  platform: string;
  saveImage: (buffer: ArrayBuffer) => Promise<string>;
  saveNote: (id: string, content: string) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  loadNotes: () => Promise<any[]>;
  deleteImage: (fileName: string) => Promise<boolean>;
  getAllImages: () => Promise<string[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
