import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  saveImage: (buffer: ArrayBuffer) => ipcRenderer.invoke("save-image", buffer),
  saveNote: (id: string, content: string) =>
    ipcRenderer.invoke("save-note", id, content),
  deleteNote: (id: string) => ipcRenderer.invoke("delete-note", id),
  loadNotes: () => ipcRenderer.invoke("load-notes"),
  deleteImage: (fileName: string) =>
    ipcRenderer.invoke("delete-image", fileName),
  getAllImages: () => ipcRenderer.invoke("get-all-images"),
});
