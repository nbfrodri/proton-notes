export interface ElectronAPI {
  platform: string;
  saveImage: (buffer: ArrayBuffer) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
