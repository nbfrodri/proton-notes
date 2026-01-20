import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Add API functions here
  platform: process.platform,
});
