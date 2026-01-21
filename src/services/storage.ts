import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

export interface StorageService {
  saveImage(buffer: ArrayBuffer): Promise<string>;
  platform: "electron" | "web" | "ios" | "android";
}

class StorageServiceImpl implements StorageService {
  get platform() {
    // Check if running in Electron
    if (window.electronAPI) {
      return "electron";
    }
    // Check Capacitor platform
    return Capacitor.getPlatform() as "web" | "ios" | "android";
  }

  async saveImage(buffer: ArrayBuffer): Promise<string> {
    if (this.platform === "electron") {
      return await window.electronAPI.saveImage(buffer);
    }

    // Capacitor (Mobile) implementation
    try {
      // Convert buffer to base64 for Capacitor Filesystem
      const base64String = this.arrayBufferToBase64(buffer);
      const fileName = `${crypto.randomUUID()}.png`;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64String,
        directory: Directory.Data, // App's private data directory
        recursive: true,
      });

      // Return a displayable URL
      // On Capacitor, we can use the uri returned by writeFile
      // But for <img> tags to work, we might need Capacitor.convertFileSrc
      return Capacitor.convertFileSrc(savedFile.uri);
    } catch (error) {
      console.error("StorageService: Failed to save image", error);
      throw error;
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export const storageService = new StorageServiceImpl();
