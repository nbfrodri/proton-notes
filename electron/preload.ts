import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  saveImage: (buffer: ArrayBuffer) => ipcRenderer.invoke("save-image", buffer),
});
